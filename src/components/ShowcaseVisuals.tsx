import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Zap,
  Coffee,
  Sparkles,
  ArrowRight,
  Bookmark,
  Share2,
  Flame,
  Check,
  ShieldCheck,
  Award,
  BarChart2,
  Lightbulb,
  Rocket,
  Layers,
  Phone,
  Globe,
  ExternalLink,
  Target,
  FileText,
  Clock,
  DollarSign,
  Cpu,
  BadgeCheck,
  Heart,
} from "lucide-react";
import { PostCraftLogo } from "./PostCraftLogo";

interface VisualProps {
  className?: string;
  topic?: string;
  sampleIndex?: number;
}

// ======================================================================
// 1. LINKEDIN SHOWCASE VISUAL (Executive 16:9 Graphic - NO SLIDER)
// Authoritative thought-leadership graphic with clear corporate aesthetics
// ======================================================================
export const LinkedInShowcaseVisual: React.FC<VisualProps> = ({
  className = "",
  topic,
  sampleIndex = 0,
}) => {
  // Sample 1: Bootstrapping SaaS ($20k MRR)
  if (sampleIndex === 1) {
    return (
      <div
        className={`relative w-full min-h-[290px] rounded-2xl overflow-hidden bg-[#0A192F] text-white p-4 sm:p-5 flex flex-col justify-between select-none shadow-xl border border-sky-500/30 ${className}`}
      >
        <div className="absolute top-0 right-0 w-72 h-full bg-gradient-to-l from-sky-900/30 via-blue-950/20 to-transparent pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-[#0A66C2] text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-2.5 h-2.5" />
              B2B Executive Framework
            </span>
            <span className="text-[10px] text-sky-300 font-medium">90-Day Blueprint</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">16:9 Banner</span>
        </div>

        {/* Main Content Body */}
        <div className="relative z-10 my-auto py-2 grid grid-cols-12 gap-3 items-center">
          <div className="col-span-8 space-y-1.5">
            <span className="text-[9px] font-bold text-sky-400 uppercase tracking-widest bg-sky-950/80 px-2 py-0.5 rounded border border-sky-500/30 inline-block">
              CASE STUDY · ZERO SALES CALLS
            </span>
            <h3 className="text-sm sm:text-lg font-black text-white leading-snug">
              Bootstrapping Micro-SaaS to <span className="text-sky-400">$20,450 MRR</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed line-clamp-2">
              How a solo engineer achieved 94% gross margins by substituting sales calls with opinionated product speed.
            </p>
          </div>

          <div className="col-span-4 p-2.5 rounded-xl bg-black/40 border border-sky-500/40 text-center space-y-0.5 backdrop-blur-sm">
            <div className="text-[9px] text-zinc-400 font-bold uppercase">Run Rate</div>
            <div className="text-lg sm:text-xl font-black text-sky-400 font-mono">$20,450</div>
            <div className="text-[9px] text-emerald-400 font-semibold bg-emerald-950/60 py-0.2 px-1.5 rounded-full inline-block">
              +142% QoQ
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-zinc-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-zinc-300">
              <CheckCircle2 className="w-3 h-3 text-sky-400" /> 1 Solo Dev
            </span>
            <span className="flex items-center gap-1 text-zinc-300">
              <CheckCircle2 className="w-3 h-3 text-sky-400" /> $0 Ads
            </span>
          </div>
          <span>Published on LinkedIn</span>
        </div>
      </div>
    );
  }

  // Sample 2: Direct Trade Coffee Supply Chain
  if (sampleIndex === 2) {
    return (
      <div
        className={`relative w-full min-h-[290px] rounded-2xl overflow-hidden bg-[#1a140f] text-white p-4 sm:p-5 flex flex-col justify-between select-none shadow-xl border border-amber-600/30 ${className}`}
      >
        <div className="absolute top-0 right-0 w-72 h-full bg-gradient-to-l from-amber-900/30 via-orange-950/20 to-transparent pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2">
          <span className="px-2 py-0.5 rounded bg-amber-700 text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
            <Coffee className="w-2.5 h-2.5" />
            Supply Chain Disruption
          </span>
          <span className="text-[10px] font-mono text-amber-300">Huila, Colombia</span>
        </div>

        <div className="relative z-10 my-auto py-2 space-y-1.5">
          <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/40 inline-block">
            DIRECT TRADE VS. COMMODITY COFFEE
          </span>
          <h3 className="text-sm sm:text-lg font-black text-white leading-snug">
            Eliminating 4 Middlemen Increased Farmer Payout by <span className="text-amber-400">+48%</span>
          </h3>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2 rounded-lg bg-black/40 border border-white/10">
              <span className="text-[9px] text-zinc-400 block font-semibold">Commodity Route</span>
              <span className="text-sm sm:text-base font-bold text-zinc-300">$1.20 / lb</span>
            </div>
            <div className="p-2 rounded-lg bg-amber-950/50 border border-amber-500/40">
              <span className="text-[9px] text-amber-300 block font-semibold">Direct-Trade Model</span>
              <span className="text-sm sm:text-base font-black text-amber-400">$3.40 / lb</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-zinc-400">
          <span>Ethical Sourcing Case Study</span>
          <span className="text-amber-300">LinkedIn Article</span>
        </div>
      </div>
    );
  }

  // Sample 0 (Default): PostCraft AI Launch
  return (
    <div
      className={`relative w-full min-h-[290px] rounded-2xl overflow-hidden bg-[#0A1628] text-white p-4 sm:p-5 flex flex-col justify-between select-none shadow-xl border border-blue-500/30 ${className}`}
    >
      <div className="absolute top-0 right-0 w-72 h-full bg-gradient-to-l from-blue-900/30 via-indigo-950/20 to-transparent pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded bg-[#0A66C2] text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            Product Launch 2026
          </span>
          <span className="text-[10px] text-blue-300 font-medium">Content Architecture</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-400">16:9 Banner</span>
      </div>

      <div className="relative z-10 my-auto py-2 space-y-1.5">
        <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/30 inline-block">
          OMNICHANNEL STRATEGY
        </span>
        <h3 className="text-sm sm:text-lg font-black text-white leading-snug">
          Stop Writing for Individual Networks. Orchestrate with <span className="text-blue-400">PostCraft AI</span>.
        </h3>
        <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed">
          1 core prompt produces algorithm-tailored thought leadership for LinkedIn, hook threads for Twitter/X, and swipe carousels for Instagram.
        </p>
      </div>

      <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-zinc-400 font-mono">
        <span className="flex items-center gap-1 text-blue-300">
          <CheckCircle2 className="w-3 h-3 text-blue-400" /> Synchronized Brand Kit
        </span>
        <span>Executive Post Graphic</span>
      </div>
    </div>
  );
};

// ======================================================================
// 2. TWITTER / X SHOWCASE VISUAL (16:9 Infographic / Snake Diagram - NO SLIDER)
// High-density roadmap with sharp vector styling & viral headline cover
// ======================================================================
export const TwitterShowcaseVisual: React.FC<VisualProps> = ({
  className = "",
  topic,
  sampleIndex = 0,
}) => {
  // Sample 1: Bootstrapping SaaS 4-Step Roadmap
  if (sampleIndex === 1) {
    return (
      <div
        className={`relative w-full min-h-[290px] rounded-2xl overflow-hidden bg-black text-white p-4 sm:p-5 flex flex-col justify-between select-none shadow-xl border border-zinc-800 ${className}`}
      >
        <div className="relative z-10 flex items-center justify-between border-b border-zinc-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center font-bold text-[10px]">
              𝕏
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
              🔥 VIRAL PLAYBOOK · 1/5
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">16:9 Cover Banner</span>
        </div>

        {/* Attention-Grabbing Headline Cover */}
        <div className="relative z-10 my-auto py-1 space-y-2.5">
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-black text-white leading-snug">
              The 4-Step Playbook to <span className="text-emerald-400">$20k MRR</span> (Without 1 Sales Call)
            </h3>
            <p className="text-[10px] sm:text-[11px] text-zinc-400">
              Swipe through the 4 non-negotiable systems that turned code into pure recurring cashflow.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-0.5">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[8px] flex items-center justify-center">
                1
              </span>
              <h4 className="text-[10px] font-bold text-white">Niche Utility</h4>
              <p className="text-[9px] text-zinc-400">1 painful problem</p>
            </div>
            <div className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-0.5">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[8px] flex items-center justify-center">
                2
              </span>
              <h4 className="text-[10px] font-bold text-white">Build in Public</h4>
              <p className="text-[9px] text-zinc-400">Share revenue logs</p>
            </div>
            <div className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-0.5">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[8px] flex items-center justify-center">
                3
              </span>
              <h4 className="text-[10px] font-bold text-white">Zero Calls</h4>
              <p className="text-[9px] text-zinc-400">Self-serve checkout</p>
            </div>
            <div className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-0.5">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[8px] flex items-center justify-center">
                4
              </span>
              <h4 className="text-[10px] font-bold text-white">Scale SEO</h4>
              <p className="text-[9px] text-zinc-400">High-intent search</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-zinc-800 text-[10px] text-zinc-500 font-mono">
          <span>🧵 Thread Visual Attachment</span>
          <span className="text-zinc-300 font-semibold">@postcraft.official ✓</span>
        </div>
      </div>
    );
  }

  // Sample 2: Direct Trade Coffee Numbers
  if (sampleIndex === 2) {
    return (
      <div
        className={`relative w-full min-h-[290px] rounded-2xl overflow-hidden bg-black text-white p-4 sm:p-5 flex flex-col justify-between select-none shadow-xl border border-zinc-800 ${className}`}
      >
        <div className="relative z-10 flex items-center justify-between border-b border-zinc-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center font-bold text-[10px]">
              𝕏
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
              ⚡️ SUPPLY CHAIN AUDIT
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">16:9 Data Card</span>
        </div>

        <div className="relative z-10 my-auto py-1 space-y-2.5">
          <div>
            <h3 className="text-sm sm:text-base font-black text-white leading-snug">
              Why 90% of Coffee Profits Vanish Before Reaching the Farm ☕️
            </h3>
            <p className="text-[10px] sm:text-[11px] text-zinc-400">
              The breakdown of intermediary markups vs. direct-trade farmer payouts.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-red-500/30 space-y-0.5 text-center">
              <span className="text-[9px] text-red-400 font-bold uppercase">Middlemen</span>
              <div className="text-sm sm:text-base font-black text-white">4 Layers</div>
              <p className="text-[9px] text-zinc-400">Exporters, Brokers</p>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-0.5 text-center">
              <span className="text-[9px] text-zinc-400 font-bold uppercase">Old Payout</span>
              <div className="text-sm sm:text-base font-black text-zinc-300">$1.20 / lb</div>
              <p className="text-[9px] text-zinc-500">Sub-living wage</p>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-amber-500/40 space-y-0.5 text-center">
              <span className="text-[9px] text-amber-400 font-bold uppercase">Direct Trade</span>
              <div className="text-sm sm:text-base font-black text-amber-400">$3.40 / lb</div>
              <p className="text-[9px] text-amber-300/80">+183% Net</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-zinc-800 text-[10px] text-zinc-500 font-mono">
          <span>🧵 Attached to Tweet 1/5</span>
          <span className="text-amber-400 font-semibold">@postcraft.official ✓</span>
        </div>
      </div>
    );
  }

  // Sample 0 (Default): PostCraft AI 3-Step Flow
  return (
    <div
      className={`relative w-full min-h-[290px] rounded-2xl overflow-hidden bg-black text-white p-4 sm:p-5 flex flex-col justify-between select-none shadow-xl border border-zinc-800 ${className}`}
    >
      <div className="relative z-10 flex items-center justify-between border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center font-bold text-[10px]">
            𝕏
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/30">
            ⚡️ CREATOR SYSTEM 2026
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">16:9 Cover Banner</span>
      </div>

      <div className="relative z-10 my-auto py-1 space-y-2.5">
        <div>
          <h3 className="text-sm sm:text-base font-black text-white leading-snug">
            How to Turn 1 Prompt into <span className="text-indigo-400">3 Platform-Tailored Masterpieces</span>
          </h3>
          <p className="text-[10px] sm:text-[11px] text-zinc-400">
            LinkedIn executive authority, Twitter viral threads, and Instagram swipe decks in 10 seconds.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-0.5">
            <span className="text-[9px] font-mono font-bold text-indigo-400">01 · INPUT</span>
            <h4 className="text-[10px] font-bold text-white">Type 1 Idea</h4>
            <p className="text-[9px] text-zinc-400 leading-snug">Your raw thought</p>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-indigo-500/40 space-y-0.5 shadow-lg shadow-indigo-950/20">
            <span className="text-[9px] font-mono font-bold text-indigo-400">02 · GENERATE</span>
            <h4 className="text-[10px] font-bold text-white">3 Tailored Posts</h4>
            <p className="text-[9px] text-zinc-400 leading-snug">LI, X & IG formats</p>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-0.5">
            <span className="text-[9px] font-mono font-bold text-indigo-400">03 · EXPORT</span>
            <h4 className="text-[10px] font-bold text-white">1-Click ZIP</h4>
            <p className="text-[9px] text-zinc-400 leading-snug">HD text + graphics</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between pt-2 border-t border-zinc-800 text-[10px] text-zinc-500 font-mono">
        <span>🧵 Thread Infographic Attachment</span>
        <span className="text-indigo-400 font-semibold">@postcraft.official ✓</span>
      </div>
    </div>
  );
};

// ======================================================================
// 3. INSTAGRAM SHOWCASE VISUAL (THE ONLY INTERACTIVE SLIDING CAROUSEL)
// Multi-slide swipe cards with arrows, slide counter, and pagination dots
// ======================================================================
export const InstagramShowcaseVisual: React.FC<VisualProps> = ({
  className = "",
  topic,
  sampleIndex = 0,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const totalSlides = 3;

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleDoubleTap = () => {
    setLiked(true);
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 800);
  };

  const slidesData = [
    {
      badge: "SLIDE 1 · HOOK COVER",
      category: "⚡️ VIRAL SYSTEM",
      title: sampleIndex === 1 ? "How 1 Engineer Hit $20k MRR 🚀" : sampleIndex === 2 ? "Direct Trade vs. Coffee Middlemen ☕️" : "3 Channels. 1 Core Prompt. ✨",
      body: sampleIndex === 1 ? "Zero sales calls. Zero paid ads. The complete solopreneur leverage playbook." : sampleIndex === 2 ? "Why buying direct from Colombian farmers changes everything about coffee." : "Stop rewording posts manually. Automate tailored omnichannel creation with AI.",
      gradient: "from-purple-900/70 via-pink-950/60 to-black",
      glowColor: "bg-pink-500/30",
      accentPill: sampleIndex === 1 ? "$20,450/mo" : sampleIndex === 2 ? "+48% Payout" : "3-in-1 AI Sync",
    },
    {
      badge: "SLIDE 2 · THE FRAMEWORK",
      category: "📈 GROWTH ARCHITECTURE",
      title: sampleIndex === 1 ? "The 3 Principles of Speed ⚡️" : sampleIndex === 2 ? "48% Higher Farmer Income 📈" : "Native Formatting for Every Feed 🎯",
      body: sampleIndex === 1 ? "1. Single utility focus\n2. Transparent revenue metrics\n3. High-velocity changelogs" : sampleIndex === 2 ? "Cutting 4 intermediary broker layers delivers fresh beans and ethical profits." : "LinkedIn gets executive insights. Twitter gets punchy threads. Instagram gets aesthetic carousels.",
      gradient: "from-pink-900/70 via-rose-950/60 to-black",
      glowColor: "bg-rose-500/30",
      accentPill: sampleIndex === 1 ? "100% Code" : sampleIndex === 2 ? "4 Middlemen Cut" : "Algorithm-Tuned",
    },
    {
      badge: "SLIDE 3 · ACTION CTA",
      category: "💾 SAVE & IMPLEMENT",
      title: "Save This For Later 💾",
      body: "Tap the bookmark icon below to revisit this framework when planning your next campaign.\n\n👉 Follow @postcraft.official for daily breakdowns!",
      gradient: "from-rose-900/70 via-purple-950/60 to-black",
      glowColor: "bg-purple-500/30",
      accentPill: "Daily Blueprints",
    },
  ];

  const slide = slidesData[currentSlide];

  return (
    <div
      className={`relative w-full aspect-square max-w-[380px] mx-auto rounded-2xl overflow-hidden bg-black text-white p-5 sm:p-6 flex flex-col justify-between select-none shadow-2xl border border-pink-500/30 group ${className}`}
      onDoubleClick={handleDoubleTap}
    >
      {/* Dynamic Atmospheric Visual Layers */}
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} pointer-events-none transition-all duration-700`} />
      <div className={`absolute -top-12 -right-12 w-52 h-52 ${slide.glowColor} rounded-full blur-3xl pointer-events-none transition-all duration-700`} />
      <div className="absolute -bottom-12 -left-12 w-52 h-52 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Radial Grid / Ring */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

      {/* Top Bar with Slide Counter Badge (1/3) */}
      <div className="relative z-20 flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-pink-600/30 border border-pink-500/40 text-[10px] font-black uppercase tracking-wider text-pink-300">
            {slide.badge}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-bold text-zinc-300 backdrop-blur-md">
            {slide.accentPill}
          </span>
        </div>
        <div className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-white shadow-md">
          {currentSlide + 1}/{totalSlides}
        </div>
      </div>

      {/* Chevron Navigation Controls */}
      {currentSlide > 0 && (
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/75 hover:bg-black text-white backdrop-blur-md border border-white/20 shadow-lg transition-transform active:scale-95"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {currentSlide < totalSlides - 1 && (
        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/75 hover:bg-black text-white backdrop-blur-md border border-white/20 shadow-lg transition-transform active:scale-95"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Double Tap Heart Burst */}
      {showHeartBurst && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none animate-in zoom-in-50 duration-300">
          <Heart className="w-20 h-20 fill-rose-500 text-rose-500 drop-shadow-2xl animate-bounce" />
        </div>
      )}

      {/* Main Slide Content Card */}
      <div className="relative z-10 my-auto py-2 space-y-2.5 p-3.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm shadow-lg">
        <div className="text-[9px] font-mono font-bold text-pink-400 uppercase tracking-wider">
          {slide.category}
        </div>
        <h3 className="text-base sm:text-lg font-black text-white leading-snug">
          {slide.title}
        </h3>
        <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium whitespace-pre-line">
          {slide.body}
        </p>
      </div>

      {/* Footer with Pagination Dots & Swipe Hint */}
      <div className="relative z-20 flex items-center justify-between border-t border-white/10 pt-2 text-[10px]">
        <span className="text-zinc-400 font-mono">@postcraft.official</span>

        {/* Pagination Dots */}
        <div className="flex items-center gap-1.5">
          {slidesData.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`rounded-full transition-all ${
                currentSlide === idx ? "w-3.5 h-2 bg-pink-500 rounded-full" : "w-1.5 h-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          className="font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1"
        >
          <span>Swipe</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
