import React, { useState } from "react";
import {
  Sparkles,
  Loader2,
  Wand2,
  Lightbulb,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Palette,
  Crown,
  CheckCircle2,
  Image as ImageIcon,
  Zap,
  ListOrdered,
  FileText,
  ShieldCheck,
  Clapperboard,
  Video,
} from "lucide-react";
import { Tone, BrandKit, UserQuota, ContentFormat } from "../types";

interface GeneratorFormProps {
  topic: string;
  setTopic: (val: string) => void;
  tone: Tone;
  setTone: (val: Tone) => void;
  contentFormat: ContentFormat;
  setContentFormat: (val: ContentFormat) => void;
  threadLength: number;
  setThreadLength: (val: number) => void;
  targetAudience: string;
  setTargetAudience: (val: string) => void;
  callToAction: string;
  setCallToAction: (val: string) => void;
  imageResolution: "512px" | "1K" | "2K";
  setImageResolution: (val: "512px" | "1K" | "2K") => void;
  onGenerate: () => void;
  isLoading: boolean;
  canGenerate: boolean;
  onOpenProModal: () => void;
  brandKit: BrandKit;
  onOpenBrandKitModal: () => void;
  onToggleBrandKitEnabled: () => void;
  quota: UserQuota;
}

const TONES: { label: Tone; desc: string; icon: string }[] = [
  { label: "Professional", desc: "Authoritative & insightful", icon: "💼" },
  { label: "Witty", desc: "Clever hooks & humor", icon: "✨" },
  { label: "Urgent", desc: "FOMO & action-driving", icon: "⚡" },
  { label: "Casual", desc: "Friendly & conversational", icon: "☕" },
  { label: "Inspirational", desc: "Uplifting & motivational", icon: "🚀" },
  { label: "Educational", desc: "Step-by-step & high-utility", icon: "📚" },
];

const EXAMPLE_TOPICS = [
  "Launching our new AI workspace feature that automates meeting notes",
  "Why remote work is here to stay and how leaders can adapt",
  "3 mistakes founders make when pricing their first SaaS product",
  "The psychology behind building daily micro-habits for productivity",
];

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  topic,
  setTopic,
  tone,
  setTone,
  contentFormat,
  setContentFormat,
  threadLength,
  setThreadLength,
  targetAudience,
  setTargetAudience,
  callToAction,
  setCallToAction,
  imageResolution,
  setImageResolution,
  onGenerate,
  isLoading,
  canGenerate,
  onOpenProModal,
  brandKit,
  onOpenBrandKitModal,
  onToggleBrandKitEnabled,
  quota,
}) => {
  const [showExamples, setShowExamples] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;
    if (!canGenerate) {
      onOpenProModal();
      return;
    }
    onGenerate();
  };

  const remaining = Math.max(0, quota.maxFree - quota.countToday);

  return (
    <div
      id="generator-form-container"
      className="w-full rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm p-4 sm:p-6 transition-all"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Input Header & Prompt Examples */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="topic-input"
              className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5"
            >
              <Wand2 className="w-4 h-4 text-indigo-500" />
              What would you like to post about?
            </label>
            <button
              type="button"
              onClick={() => setShowExamples(!showExamples)}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              {showExamples ? "Hide ideas" : "Idea prompts"}
            </button>
          </div>

          {/* Text Area */}
          <div className="relative">
            <textarea
              id="topic-input"
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Just closed our $2M seed round after 50 rejections. Here are the 3 key lessons I learned about pitch decks..."
              className="w-full px-4 py-3 text-sm sm:text-base rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-y"
              disabled={isLoading}
            />
            {topic.trim().length > 0 && (
              <span className="absolute bottom-2.5 right-3 text-[11px] text-zinc-400 dark:text-zinc-500">
                {topic.length} chars
              </span>
            )}
          </div>

          {/* Example prompt pills */}
          {showExamples && (
            <div className="mt-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-2 animate-in fade-in">
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 block">
                Click an example to test:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {EXAMPLE_TOPICS.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setTopic(ex);
                      setShowExamples(false);
                    }}
                    className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    "{ex}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Structure / Format Option */}
        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/40 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <ListOrdered className="w-3.5 h-3.5 text-indigo-500" />
                Content Format:
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Consistent Style & Error-Free
              </span>
            </div>

            {contentFormat === "thread" && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Parts/Slides:
                </span>
                <div className="inline-flex rounded-lg p-0.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs">
                  {[3, 5, 7].map((len) => (
                    <button
                      key={len}
                      type="button"
                      onClick={() => setThreadLength(len)}
                      className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                        threadLength === len
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      }`}
                    >
                      {len} Tweets / Slides
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setContentFormat("single")}
              className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                contentFormat === "single"
                  ? "border-indigo-600 bg-white dark:bg-zinc-900 text-indigo-950 dark:text-indigo-100 shadow-sm ring-1 ring-indigo-500"
                  : "border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300"
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 ${contentFormat === "single" ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-600" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}>
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-900 dark:text-white">Single Standalone Posts</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  1 long-form LinkedIn narrative + 1 punchy Twitter post (≤260 chars) + 1 Instagram caption.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setContentFormat("thread")}
              className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                contentFormat === "thread"
                  ? "border-indigo-600 bg-white dark:bg-zinc-900 text-indigo-950 dark:text-indigo-100 shadow-sm ring-1 ring-indigo-500"
                  : "border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300"
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 ${contentFormat === "thread" ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-600" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}>
                <ListOrdered className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-zinc-900 dark:text-white">Thread & Carousel</p>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                    Viral
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Connected {threadLength}-tweet Twitter thread + LinkedIn PDF carousel slides + Instagram cards.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setContentFormat("script")}
              className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                contentFormat === "script"
                  ? "border-violet-600 bg-white dark:bg-zinc-900 text-violet-950 dark:text-violet-100 shadow-sm ring-1 ring-violet-500"
                  : "border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300"
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 ${contentFormat === "script" ? "bg-violet-100 dark:bg-violet-950 text-violet-600" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}>
                <Clapperboard className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-zinc-900 dark:text-white">Video & Reel Script</p>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300">
                    New
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Scene-by-scene script (Reels / TikTok / Shorts) with visual cues, teleprompter voiceover & timestamps.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Tone Selector */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Select Tone of Voice:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {TONES.map((t) => {
              const isSelected = tone === t.label;
              return (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => setTone(t.label)}
                  disabled={isLoading}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 shadow-xs"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300 bg-zinc-50/40 dark:bg-zinc-900/40"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <span>{t.icon}</span>
                    <span>{t.label}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">
                    {t.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Brand Kit & Visual References Control Bar */}
        <div className="p-3 sm:p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center bg-white dark:bg-zinc-900 overflow-hidden shrink-0 shadow-2xs">
              {brandKit.logoUrl ? (
                <img
                  src={brandKit.logoUrl}
                  alt="Brand"
                  className="w-full h-full object-contain p-0.5"
                />
              ) : (
                <Palette className="w-4 h-4 text-indigo-500" />
              )}
              {brandKit.primaryColor && (
                <span
                  className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white dark:border-zinc-900"
                  style={{ backgroundColor: brandKit.primaryColor }}
                />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                  {brandKit.brandName ? brandKit.brandName : "Brand Kit & Reference Style"}
                </span>
                {brandKit.enabled ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    Inactive
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                {brandKit.visualStyle || "Default style"} · {brandKit.brandHandle || "Custom logo & moodboard"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={onToggleBrandKitEnabled}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                brandKit.enabled
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-transparent"
                  : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50"
              }`}
            >
              {brandKit.enabled ? "Enabled" : "Enable"}
            </button>

            <button
              type="button"
              onClick={onOpenBrandKitModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Edit Kit & Logo</span>
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Settings (Target Audience & CTA) */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 flex items-center gap-1.5 py-1"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Target Audience & Custom CTA (Optional)</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showAdvanced && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 animate-in fade-in">
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  id="target-audience-input"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. B2B SaaS founders, Marketing leads, Freelancers"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Call-to-Action (CTA)
                </label>
                <input
                  type="text"
                  id="call-to-action-input"
                  value={callToAction}
                  onChange={(e) => setCallToAction(e.target.value)}
                  placeholder="e.g. Sign up for waitlist, comment your thoughts, link in bio"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Quota & Pro Upgrade Notice */}
        {!quota.isPro && (
          <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                Free Starter Plan: <strong>{remaining} of {quota.maxFree}</strong> daily generations left.
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenProModal}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs active:scale-95 transition-all shrink-0"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Upgrade to Pro</span>
            </button>
          </div>
        )}

        {/* Image Size / Quality Selection & Generate Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              AI Visual Resolution:
            </span>
            <div className="inline-flex rounded-lg p-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs">
              {(["512px", "1K", "2K"] as const).map((res) => {
                const isProOnly = res === "2K";
                return (
                  <button
                    key={res}
                    type="button"
                    onClick={() => {
                      if (isProOnly && !quota.isPro) {
                        onOpenProModal();
                        return;
                      }
                      setImageResolution(res);
                    }}
                    disabled={isLoading}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                      imageResolution === res
                        ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                    }`}
                  >
                    <span>{res}</span>
                    {isProOnly && (
                      <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                        <Crown className="w-2.5 h-2.5" /> PRO
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="btn-generate-all"
            type="submit"
            disabled={isLoading || !topic.trim()}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white shadow-md transition-all ${
              isLoading || !topic.trim()
                ? "bg-zinc-300 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] shadow-indigo-500/25"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Crafting {contentFormat === "thread" ? `${threadLength}-Part Thread` : "Posts"} & Visuals...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>
                  {contentFormat === "thread"
                    ? `Generate ${threadLength}-Part Threads & Visuals`
                    : "Generate for LinkedIn, Twitter & IG"}
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
