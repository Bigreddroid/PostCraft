import React, { useState } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  Shield,
  Layers,
  Palette,
  History,
  Crown,
} from "lucide-react";
import { UserProfile, Tone, BrandKit } from "../types";
import { PostCraftLogo } from "./PostCraftLogo";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  pendingTopic?: string;
  pendingTone?: Tone;
  brandKit?: BrandKit;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  pendingTopic,
  pendingTone,
  brandKit,
}) => {
  const [mode, setMode] = useState<"quick" | "email">("quick");
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickLogin = (provider: "google" | "demo" | "guest") => {
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      let userProfile: UserProfile;

      if (provider === "google") {
        userProfile = {
          id: `usr_google_${Date.now()}`,
          name: "Alex Rivera",
          email: "alex.rivera@gmail.com",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
          isPro: false,
          provider: "google",
        };
      } else if (provider === "demo") {
        userProfile = {
          id: `usr_demo_${Date.now()}`,
          name: "Mithra Varun",
          email: "mithravarunsasta@gmail.com",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
          isPro: true,
          provider: "google",
        };
      } else {
        // Guest mode
        userProfile = {
          id: `usr_guest_${Date.now()}`,
          name: "Guest Creator",
          email: "guest@postcraft.ai",
          avatar: "",
          isPro: false,
          provider: "email",
        };
      }

      onLoginSuccess(userProfile);
    }, 450);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isSignUp && !name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const userProfile: UserProfile = {
        id: `usr_email_${Date.now()}`,
        name: isSignUp
          ? name.trim()
          : email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        email: email.trim().toLowerCase(),
        avatar: "",
        isPro: false,
        provider: "email",
      };

      onLoginSuccess(userProfile);
    }, 500);
  };

  return (
    <div
      id="login-preview-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="login-preview-modal"
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Background Banner */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-b from-indigo-50/70 via-indigo-50/30 to-transparent dark:from-indigo-950/40 dark:via-indigo-950/15 dark:to-transparent border-b border-zinc-100 dark:border-zinc-800/80">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            <PostCraftLogo variant="full" size="md" showTagline={true} />
            <div className="mt-4">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                Sign In to Preview & Generate
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
                Unlock cross-platform generation, save campaigns to your 10-item history, and sync your custom Brand Kit.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {/* Live Campaign Queued Preview */}
          {pendingTopic && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-violet-50/50 to-white dark:from-indigo-950/50 dark:via-zinc-900 dark:to-zinc-900 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white">
                  <Sparkles className="w-3 h-3" /> Queued Campaign
                </span>
                {pendingTone && (
                  <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
                    Tone: {pendingTone}
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-2 italic">
                "{pendingTopic}"
              </p>

              {/* Ready to generate badges */}
              <div className="mt-3 pt-3 border-t border-indigo-100 dark:border-indigo-900/50 grid grid-cols-3 gap-2 text-center text-[10px] font-medium">
                <div className="p-1.5 rounded-lg bg-white/80 dark:bg-zinc-800/80 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
                  LinkedIn (16:9)
                </div>
                <div className="p-1.5 rounded-lg bg-white/80 dark:bg-zinc-800/80 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/40">
                  Twitter / X (16:9)
                </div>
                <div className="p-1.5 rounded-lg bg-white/80 dark:bg-zinc-800/80 text-pink-600 dark:text-pink-400 border border-pink-100 dark:border-pink-900/40">
                  Instagram (1:1)
                </div>
              </div>

              {brandKit?.enabled && (
                <div className="mt-2 flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                  <span className="inline-flex items-center gap-1">
                    <Palette className="w-3 h-3" />
                    <span>Brand Kit: <strong>{brandKit.brandName || "Active"}</strong></span>
                  </span>
                  <span>Preset Colors & Watermark</span>
                </div>
              )}
            </div>
          )}

          {/* Mode Switcher Pills */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMode("quick")}
              className={`py-1.5 rounded-lg transition-all ${
                mode === "quick"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              1-Click Fast Access
            </button>
            <button
              type="button"
              onClick={() => setMode("email")}
              className={`py-1.5 rounded-lg transition-all ${
                mode === "email"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              Email / Password
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {mode === "quick" ? (
            <div className="space-y-3">
              {/* Google 1-Click */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickLogin("google")}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-100 font-semibold text-xs sm:text-sm shadow-xs active:scale-[0.99] transition-all disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google (Instant)</span>
              </button>

              {/* Demo Account 1-Click */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickLogin("demo")}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/20 active:scale-[0.99] transition-all disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                <span>Instant Creator Sign In (with Pro Access)</span>
              </button>

              {/* Instant Guest / Preview */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickLogin("guest")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium text-xs transition-colors disabled:opacity-50"
              >
                <span>Continue as Guest Creator & Generate Directly</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Rivera"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="creator@brand.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50"
              >
                <span>{isSignUp ? "Create Account & Generate" : "Sign In & Generate"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
                </button>
              </div>
            </form>
          )}

          {/* Value props bullets */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 grid grid-cols-2 gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>5 Free Generations Daily</span>
            </div>
            <div className="flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>Last 10 Campaigns Saved</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>Brand Kit & Watermarks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>100% Private & Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
