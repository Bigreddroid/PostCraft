import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { GeneratorForm } from "./components/GeneratorForm";
import { ResultsView } from "./components/ResultsView";
import { HistoryModal } from "./components/HistoryModal";
import { ProUpgradeModal } from "./components/ProUpgradeModal";
import { BrandKitModal } from "./components/BrandKitModal";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { LoginModal } from "./components/LoginModal";
import { Tone, Platform, GenerationResult, UserQuota, UserProfile, AppView, BrandKit, ContentFormat } from "./types";
import {
  getStoredHistory,
  saveGenerationToHistory,
  deleteHistoryItem,
  clearAllHistory,
  getUserQuota,
  incrementUserQuota,
  setProStatus,
  getStoredTheme,
  setStoredTheme,
  getStoredUser,
  setStoredUser,
  getStoredBrandKit,
  saveStoredBrandKit,
} from "./utils/storage";
import { Sparkles, Loader2, AlertCircle, RefreshCw, Send, CheckCircle2, Crown, X } from "lucide-react";

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash === "generator" || hash === "login" || hash === "landing") {
        return hash as AppView;
      }
    }
    return "landing";
  });
  const [user, setUser] = useState<UserProfile | null>(null);

  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  const [contentFormat, setContentFormat] = useState<ContentFormat>("single");
  const [threadLength, setThreadLength] = useState<number>(5);
  const [targetAudience, setTargetAudience] = useState("");
  const [callToAction, setCallToAction] = useState("");
  const [imageResolution, setImageResolution] = useState<"512px" | "1K" | "2K">("1K");

  const [brandKit, setBrandKit] = useState<BrandKit>(() => getStoredBrandKit());
  const [isBrandKitModalOpen, setIsBrandKitModalOpen] = useState(false);
  const [proSuccessMessage, setProSuccessMessage] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<GenerationResult | null>(null);

  const [regeneratingPlatform, setRegeneratingPlatform] = useState<Platform | null>(null);
  const [history, setHistory] = useState<GenerationResult[]>([]);
  const [quota, setQuota] = useState<UserQuota>({
    countToday: 0,
    maxFree: 5,
    lastResetDate: "",
    isPro: false,
  });

  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingGenerationParams, setPendingGenerationParams] = useState<{
    topic: string;
    tone?: Tone;
    audience?: string;
    callToAction?: string;
  } | null>(null);

  // Initialize theme, user & storage
  useEffect(() => {
    const savedTheme = getStoredTheme();
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }

    const loadedUser = getStoredUser();
    if (loadedUser) {
      setUser(loadedUser);
    }

    const loadedHistory = getStoredHistory();
    setHistory(loadedHistory);
    if (loadedHistory.length > 0 && !currentResult) {
      setCurrentResult(loadedHistory[0]);
    }

    const loadedQuota = getUserQuota();
    if (loadedUser?.isPro) {
      setQuota({ ...loadedQuota, isPro: true });
    } else {
      setQuota(loadedQuota);
    }

    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "generator" || hash === "login" || hash === "landing") {
        setCurrentView(hash as AppView);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleToggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setStoredTheme(next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  };

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
    if (typeof window !== "undefined") {
      window.location.hash = view;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLoginSuccess = (newUser: UserProfile) => {
    setUser(newUser);
    setStoredUser(newUser);
    if (newUser.isPro) {
      const updated = setProStatus(true);
      setQuota(updated);
    }
    setIsLoginModalOpen(false);

    // If user attempted generation before logging in, resume it seamlessly
    if (pendingGenerationParams) {
      const pending = pendingGenerationParams;
      setPendingGenerationParams(null);
      setTopic(pending.topic);
      if (pending.tone) setTone(pending.tone);
      if (pending.audience) setTargetAudience(pending.audience);
      if (pending.callToAction) setCallToAction(pending.callToAction);
      handleNavigate("generator");
      setTimeout(() => {
        executeGenerate(
          pending.topic,
          pending.tone || tone,
          pending.audience,
          pending.callToAction,
          newUser
        );
      }, 100);
    } else {
      handleNavigate("generator");
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setStoredUser(null);
  };

  // Quota check
  const canGenerate = quota.isPro || quota.countToday < quota.maxFree;

  // Execute generation call
  const executeGenerate = async (
    targetTopic: string,
    targetTone: Tone,
    targetAud?: string,
    targetCta?: string,
    currentUser?: UserProfile | null
  ) => {
    const activeUser = currentUser !== undefined ? currentUser : user;
    if (!targetTopic.trim()) return;

    const isUserPro = activeUser?.isPro || quota.isPro;
    const isUnderQuota = isUserPro || quota.countToday < quota.maxFree;

    if (!isUnderQuota) {
      setIsProModalOpen(true);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/generate-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: targetTopic.trim(),
          tone: targetTone,
          contentFormat,
          threadLength,
          targetAudience: targetAud ? targetAud.trim() : undefined,
          callToAction: targetCta ? targetCta.trim() : undefined,
          imageResolution,
          brandKit: brandKit.enabled ? brandKit : undefined,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      const newResult: GenerationResult = {
        id: data.id || `gen_${Date.now()}`,
        topic: data.topic || targetTopic.trim(),
        tone: data.tone || targetTone,
        contentFormat: data.contentFormat || contentFormat,
        threadLength: data.threadLength || threadLength,
        targetAudience: targetAud ? targetAud.trim() : undefined,
        callToAction: targetCta ? targetCta.trim() : undefined,
        brandKit: data.brandKit || (brandKit.enabled ? brandKit : undefined),
        timestamp: data.timestamp || Date.now(),
        imageResolution,
        linkedin: data.linkedin,
        twitter: data.twitter,
        instagram: data.instagram,
      };

      setCurrentResult(newResult);

      // Save to local storage history (capped at 10)
      const updatedHistory = saveGenerationToHistory(newResult);
      setHistory(updatedHistory);

      // Increment quota count
      if (!isUserPro) {
        const updatedQuota = incrementUserQuota();
        setQuota(updatedQuota);
      }
    } catch (err: any) {
      console.error("Generate error:", err);
      setErrorMessage(err.message || "Failed to generate posts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Full Generation for all 3 platforms (Checks authentication first!)
  const handleGenerate = async (customTopic?: string, customTone?: Tone) => {
    const activeTopic = (customTopic !== undefined ? customTopic : topic).trim();
    const activeTone = customTone || tone;

    if (!activeTopic) return;

    // Prompt login modal if unauthenticated user attempts generation
    if (!user) {
      setPendingGenerationParams({
        topic: activeTopic,
        tone: activeTone,
        audience: targetAudience.trim() || undefined,
        callToAction: callToAction.trim() || undefined,
      });
      setIsLoginModalOpen(true);
      return;
    }

    executeGenerate(
      activeTopic,
      activeTone,
      targetAudience.trim() || undefined,
      callToAction.trim() || undefined,
      user
    );
  };

  // Handle in-place content edits and AI improvements
  const handleUpdatePlatformContent = (platform: Platform, updatedData: any) => {
    if (!currentResult) return;
    const updated = {
      ...currentResult,
      [platform]: updatedData,
    };
    setCurrentResult(updated);
    const updatedHistory = saveGenerationToHistory(updated);
    setHistory(updatedHistory);
  };

  // Handle single platform regeneration
  const handleRegeneratePlatform = async (
    platform: Platform,
    type: "both" | "text" | "image"
  ) => {
    if (!currentResult) return;
    setRegeneratingPlatform(platform);

    try {
      const response = await fetch("/api/regenerate-platform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          topic: currentResult.topic,
          tone: currentResult.tone,
          targetAudience: currentResult.targetAudience,
          callToAction: currentResult.callToAction,
          type,
          imageResolution: currentResult.imageResolution || imageResolution,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to regenerate platform");
      }

      const res = await response.json();
      const updatedResult = { ...currentResult };

      if (platform === "linkedin") {
        if (res.textData) {
          updatedResult.linkedin = {
            ...updatedResult.linkedin,
            headline: res.textData.headline || updatedResult.linkedin.headline,
            content: res.textData.content || updatedResult.linkedin.content,
            imagePrompt: res.textData.imagePrompt || updatedResult.linkedin.imagePrompt,
          };
        }
        if (res.imgData?.imageUrl) {
          updatedResult.linkedin.imageUrl = res.imgData.imageUrl;
          updatedResult.linkedin.imageError = undefined;
        }
      } else if (platform === "twitter") {
        if (res.textData) {
          updatedResult.twitter = {
            ...updatedResult.twitter,
            hook: res.textData.hook || updatedResult.twitter.hook,
            tweet: res.textData.tweet || updatedResult.twitter.tweet,
            imagePrompt: res.textData.imagePrompt || updatedResult.twitter.imagePrompt,
          };
        }
        if (res.imgData?.imageUrl) {
          updatedResult.twitter.imageUrl = res.imgData.imageUrl;
          updatedResult.twitter.imageError = undefined;
        }
      } else if (platform === "instagram") {
        if (res.textData) {
          updatedResult.instagram = {
            ...updatedResult.instagram,
            caption: res.textData.caption || updatedResult.instagram.caption,
            hashtags: res.textData.hashtags || updatedResult.instagram.hashtags,
            imagePrompt: res.textData.imagePrompt || updatedResult.instagram.imagePrompt,
          };
        }
        if (res.imgData?.imageUrl) {
          updatedResult.instagram.imageUrl = res.imgData.imageUrl;
          updatedResult.instagram.imageError = undefined;
        }
      }

      setCurrentResult(updatedResult);
      const updatedHistory = saveGenerationToHistory(updatedResult);
      setHistory(updatedHistory);
    } catch (err: any) {
      console.error("Single regen error:", err);
    } finally {
      setRegeneratingPlatform(null);
    }
  };

  // Upgraded to Pro via Paywall
  const handleUpgradeSuccess = (details?: import("./types").SubscriptionDetails) => {
    const updated = setProStatus(true, details);
    setQuota(updated);
    if (user) {
      const updatedUser = { ...user, isPro: true };
      setUser(updatedUser);
      setStoredUser(updatedUser);
    }
    setProSuccessMessage(
      "🎉 Subscription Activated! You are now on PostCraft Pro. Daily generation limits are disabled and 2K visual upscaling is unlocked."
    );
    setTimeout(() => {
      setProSuccessMessage(null);
    }, 8000);
  };

  // Downgrade / Cancel Subscription
  const handleCancelSubscription = () => {
    const updated = setProStatus(false);
    setQuota(updated);
    if (user) {
      const updatedUser = { ...user, isPro: false };
      setUser(updatedUser);
      setStoredUser(updatedUser);
    }
    setProSuccessMessage("Subscription cancelled. Your account has returned to the Free Starter tier.");
    setTimeout(() => {
      setProSuccessMessage(null);
    }, 6000);
  };

  // Brand Kit handlers
  const handleSaveBrandKit = (newKit: BrandKit) => {
    setBrandKit(newKit);
    saveStoredBrandKit(newKit);
  };

  const handleToggleBrandKitEnabled = () => {
    const nextKit = { ...brandKit, enabled: !brandKit.enabled };
    setBrandKit(nextKit);
    saveStoredBrandKit(nextKit);
  };

  // Clear / delete history
  const handleClearHistory = () => {
    clearAllHistory();
    setHistory([]);
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = deleteHistoryItem(id);
    setHistory(updated);
    if (currentResult?.id === id) {
      setCurrentResult(updated[0] || null);
    }
  };

  // If on Landing Page view
  if (currentView === "landing") {
    return (
      <>
        <LandingPage
          onNavigate={handleNavigate}
          user={user}
          quota={quota}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onOpenProModal={() => setIsProModalOpen(true)}
          onSignOut={handleSignOut}
          brandKit={brandKit}
          onOpenBrandKitModal={() => setIsBrandKitModalOpen(true)}
          onOpenLoginModal={(topicParam, toneParam) => {
            setPendingGenerationParams({
              topic: topicParam || "Omnichannel Social Media Campaign",
              tone: toneParam || "Professional",
            });
            setIsLoginModalOpen(true);
          }}
          onTryGenerate={(topicParam, toneParam) => {
            setTopic(topicParam);
            if (toneParam) setTone(toneParam);
            handleGenerate(topicParam, toneParam);
          }}
        />
        <ProUpgradeModal
          isOpen={isProModalOpen}
          onClose={() => setIsProModalOpen(false)}
          isPro={quota.isPro}
          onUpgradeSuccess={handleUpgradeSuccess}
        />
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          pendingTopic={pendingGenerationParams?.topic || topic}
          pendingTone={pendingGenerationParams?.tone || tone}
          brandKit={brandKit}
        />
        <BrandKitModal
          isOpen={isBrandKitModalOpen}
          onClose={() => setIsBrandKitModalOpen(false)}
          brandKit={brandKit}
          onSave={handleSaveBrandKit}
        />
      </>
    );
  }

  // If on Login / Sign up view
  if (currentView === "login") {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onNavigate={handleNavigate}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  // Otherwise, render full Generator Studio
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-indigo-500 selection:text-white font-sans transition-colors">
      {/* Header */}
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        quota={quota}
        onOpenProModal={() => setIsProModalOpen(true)}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
        onOpenBrandKitModal={() => setIsBrandKitModalOpen(true)}
        brandKitEnabled={brandKit.enabled}
        historyCount={history.length}
        currentView={currentView}
        onNavigate={handleNavigate}
        user={user}
        onSignOut={handleSignOut}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Pro Upgrade Confirmation Banner */}
        {proSuccessMessage && (
          <div
            id="pro-success-banner"
            className="max-w-3xl mx-auto p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-indigo-500/15 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-3 text-sm shadow-sm animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500 text-white shrink-0">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-sm">Pro Status Activated for this Session</p>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  {proSuccessMessage}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setProSuccessMessage(null)}
              className="p-1 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/40"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Top Hero / Intro */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Simultaneous Multi-Platform AI Copywriting & Visuals
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Write once. Publish everywhere with tailored visuals.
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Turn any idea into perfectly formatted posts + native aspect ratio AI images for LinkedIn, Twitter/X, and Instagram.
          </p>
        </div>

        {/* Generator Form */}
        <div className="max-w-3xl mx-auto">
          <GeneratorForm
            topic={topic}
            setTopic={setTopic}
            tone={tone}
            setTone={setTone}
            contentFormat={contentFormat}
            setContentFormat={setContentFormat}
            threadLength={threadLength}
            setThreadLength={setThreadLength}
            targetAudience={targetAudience}
            setTargetAudience={setTargetAudience}
            callToAction={callToAction}
            setCallToAction={setCallToAction}
            imageResolution={imageResolution}
            setImageResolution={setImageResolution}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            canGenerate={canGenerate}
            onOpenProModal={() => setIsProModalOpen(true)}
            brandKit={brandKit}
            onOpenBrandKitModal={() => setIsBrandKitModalOpen(true)}
            onToggleBrandKitEnabled={handleToggleBrandKitEnabled}
            quota={quota}
          />
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-semibold">Generation encountered an issue: </strong>
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-xs font-semibold underline text-red-600 dark:text-red-400"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading Indicator with Animated Skeleton */}
        {isLoading && (
          <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center space-y-4 shadow-sm animate-pulse">
            <div className="inline-flex p-3 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Crafting Your Omnichannel Content & Visuals...
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Writing LinkedIn story, Twitter hook, Instagram caption, and generating 3 tailored AI images via Gemini.
              </p>
            </div>
            {/* Skeleton blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              <div className="h-24 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
              <div className="h-24 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
              <div className="h-24 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
            </div>
          </div>
        )}

        {/* Results Section */}
        {!isLoading && currentResult && (
          <div className="pt-2">
            <ResultsView
              result={currentResult}
              onRegeneratePlatform={handleRegeneratePlatform}
              onUpdatePlatformContent={handleUpdatePlatformContent}
              regeneratingPlatform={regeneratingPlatform}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800/80 py-6 text-center text-xs text-zinc-500 dark:text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>PostCraft AI &copy; 2026. Powered by Google Gemini.</span>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>LinkedIn (1200×627)</span>
            <span>·</span>
            <span>Twitter/X (1600×900)</span>
            <span>·</span>
            <span>Instagram (1080×1080)</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        onSelectResult={(item) => {
          setCurrentResult(item);
          setTopic(item.topic);
          setTone(item.tone);
          if (item.targetAudience) setTargetAudience(item.targetAudience);
          if (item.callToAction) setCallToAction(item.callToAction);
          if (item.brandKit) {
            setBrandKit(item.brandKit);
            saveStoredBrandKit(item.brandKit);
          }
        }}
        onClearHistory={handleClearHistory}
        onDeleteItem={handleDeleteHistoryItem}
      />

      <ProUpgradeModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        isPro={quota.isPro}
        quota={quota}
        subscription={quota.subscription}
        onUpgradeSuccess={handleUpgradeSuccess}
        onCancelSubscription={handleCancelSubscription}
      />

      <BrandKitModal
        isOpen={isBrandKitModalOpen}
        onClose={() => setIsBrandKitModalOpen(false)}
        brandKit={brandKit}
        onSave={handleSaveBrandKit}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        pendingTopic={pendingGenerationParams?.topic || topic}
        pendingTone={pendingGenerationParams?.tone || tone}
        brandKit={brandKit}
      />
    </div>
  );
}
