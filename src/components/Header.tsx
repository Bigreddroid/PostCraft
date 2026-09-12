import React, { useState } from "react";
import {
  Sparkles,
  Sun,
  Moon,
  Crown,
  History,
  Zap,
  CheckCircle2,
  LogIn,
  LogOut,
  User,
  Home,
  Wand2,
  Palette,
  Settings,
} from "lucide-react";
import { UserQuota, UserProfile, AppView } from "../types";
import { PostCraftLogo } from "./PostCraftLogo";

interface HeaderProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
  quota: UserQuota;
  onOpenProModal: () => void;
  onOpenHistoryModal: () => void;
  onOpenBrandKitModal?: () => void;
  brandKitEnabled?: boolean;
  historyCount: number;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  user: UserProfile | null;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  quota,
  onOpenProModal,
  onOpenHistoryModal,
  onOpenBrandKitModal,
  brandKitEnabled,
  historyCount,
  currentView,
  onNavigate,
  user,
  onSignOut,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const remaining = Math.max(0, quota.maxFree - quota.countToday);
  const percentUsed = Math.min(100, (quota.countToday / quota.maxFree) * 100);

  return (
    <header
      id="app-header"
      className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors ${
        theme === "dark"
          ? "bg-zinc-950/85 border-zinc-800/80 text-zinc-100"
          : "bg-white/85 border-zinc-200/80 text-zinc-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & View Navigation */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={() => onNavigate("landing")}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
            title="Go to Landing Page"
          >
            <PostCraftLogo variant="horizontal" size="md" showTagline={false} />
            <div className="flex items-center gap-1.5">
              {quota.isPro ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  <Crown className="w-3 h-3" /> PRO
                </span>
              ) : (
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                  Studio
                </span>
              )}
            </div>
          </button>

          {/* Quick Page Switcher */}
          <div className="hidden lg:flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
            <button
              onClick={() => onNavigate("landing")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                currentView === "landing"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => onNavigate("generator")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                currentView === "generator"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Studio</span>
            </button>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Daily Quota Indicator (Studio mode) */}
          {!quota.isPro ? (
            <div
              id="quota-badge"
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border ${
                remaining > 0
                  ? "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                  : "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>
                <strong className={remaining === 0 ? "text-red-600 dark:text-red-400" : "text-zinc-900 dark:text-zinc-200"}>
                  {remaining}
                </strong>{" "}
                of {quota.maxFree} free daily gens left
              </span>
              <div className="w-12 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden ml-1">
                <div
                  className={`h-full transition-all ${
                    remaining === 0 ? "bg-red-500" : "bg-gradient-to-r from-amber-500 to-indigo-500"
                  }`}
                  style={{ width: `${percentUsed}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
              Unlimited Generations Active
            </div>
          )}

          {/* Upgrade to Pro Button */}
          {!quota.isPro && (
            <button
              id="btn-upgrade-pro"
              onClick={onOpenProModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-sm shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Crown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upgrade to Pro</span>
              <span className="sm:hidden">Pro</span>
            </button>
          )}

          {/* Brand Kit Button (if in studio) */}
          {onOpenBrandKitModal && (
            <button
              id="btn-brand-kit"
              type="button"
              onClick={onOpenBrandKitModal}
              className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                brandKitEnabled
                  ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"
                  : "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
              }`}
              title="Brand Kit & Visual References"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Brand Kit</span>
              {brandKitEnabled && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          )}

          {/* History Button (if on studio) */}
          <button
            id="btn-history"
            onClick={onOpenHistoryModal}
            className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
            title="View Generation History (Last 10 Saved)"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                {historyCount}
              </span>
            )}
          </button>

          {/* User Profile or Login CTA */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pl-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover border border-indigo-500/40"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-semibold max-w-[80px] truncate hidden md:inline">
                  {user.name.split(" ")[0]}
                </span>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      {quota.isPro ? "PRO Subscriber" : "Free Starter Plan"}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        if (onOpenBrandKitModal) {
                          onOpenBrandKitModal();
                        }
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2"
                    >
                      <Settings className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Settings & Brand Kit</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigate("generator");
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2"
                    >
                      <Wand2 className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Generator Studio</span>
                    </button>

                    {!quota.isPro ? (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenProModal();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center gap-2 font-medium"
                      >
                        <Crown className="w-3.5 h-3.5" />
                        <span>Upgrade to Pro</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenProModal();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center gap-2 font-medium"
                      >
                        <Crown className="w-3.5 h-3.5" />
                        <span>Manage Subscription</span>
                      </button>
                    )}
                  </div>

                  <div className="border-t border-zinc-100 dark:border-zinc-800 pt-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onSignOut();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigate("login")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Theme Switcher */}
          <button
            id="btn-theme-toggle"
            onClick={onToggleTheme}
            className="p-2 rounded-lg border bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
