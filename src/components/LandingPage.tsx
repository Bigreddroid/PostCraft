import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Linkedin,
  Twitter,
  Instagram,
  Zap,
  Crown,
  Download,
  Edit3,
  Sliders,
  History,
  Layers,
  ChevronDown,
  Sun,
  Moon,
  ExternalLink,
  Shield,
  Star,
  Flame,
  Check,
  Palette,
  FolderDown,
  Lock,
  RefreshCw,
  Copy,
  Eye,
} from "lucide-react";
import { AppView, UserProfile, UserQuota, BrandKit, Tone } from "../types";
import { PostCraftLogo } from "./PostCraftLogo";
import {
  LinkedInShowcaseVisual,
  TwitterShowcaseVisual,
  InstagramShowcaseVisual,
} from "./ShowcaseVisuals";

interface LandingPageProps {
  onNavigate: (view: AppView) => void;
  user: UserProfile | null;
  quota: UserQuota;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onOpenProModal: () => void;
  onSignOut: () => void;
  onTryGenerate?: (topic: string, tone?: Tone) => void;
  onOpenLoginModal?: (topic?: string, tone?: Tone) => void;
  onOpenBrandKitModal?: () => void;
  brandKit?: BrandKit;
}

interface DemoSample {
  topic: string;
  category: string;
  linkedin: {
    headline: string;
    body: string;
    image: string;
  };
  twitter: {
    hook: string;
    tweet: string;
    image: string;
  };
  instagram: {
    caption: string;
    hashtags: string[];
    image: string;
  };
}

const DEMO_SAMPLES: DemoSample[] = [
  {
    topic: "Launching PostCraft AI: Autonomous Omnichannel Socials",
    category: "AI & Content Architecture",
    linkedin: {
      headline: "Why top creators stopped writing for individual social networks in 2026",
      body: "Repurposing content manually drains 15+ hours every week. Founders try to paste the same paragraph everywhere—and get penalized by every algorithm.\n\nToday, we are launching PostCraft AI.\n\n1 prompt automatically generates:\n1. Structured thought leadership for LinkedIn (16:9 visual included)\n2. High-converting hook threads for Twitter/X\n3. Visually immersive storytelling & curated hashtags for Instagram\n\nAll synchronized with brand colors and ready for 1-click ZIP export.",
      image: "/assets/postcraft-linkedin.svg",
    },
    twitter: {
      hook: "Writing separate posts for LinkedIn, Twitter, and Instagram is a huge time sink. Here is the modern workflow: 🧵⚡️",
      tweet: "1. Type your core idea once into PostCraft AI\n2. Get 3 algorithm-optimized posts in 3.2 seconds\n3. Auto-generate matching 16:9 & 1:1 visuals\n4. Download the full campaign ZIP\n\nScale your personal brand without burning out.",
      image: "/assets/postcraft-twitter.svg",
    },
    instagram: {
      caption: "Turn 1 core thought into multi-channel influence in seconds. ✨ PostCraft AI automates format adaptation, tone steering, and high-impact visual generation so you can focus on building, not formatting.\n\nSwipe to see the LinkedIn & Twitter equivalents! 👉",
      hashtags: ["#postcraftai", "#contentcreation", "#founders", "#marketingautomation", "#socialmediatips", "#creatorstudio"],
      image: "/assets/postcraft-instagram.svg",
    },
  },
  {
    topic: "Bootstrapping Micro-SaaS to $20k MRR",
    category: "Growth & SaaS",
    linkedin: {
      headline: "How we scaled to $20,000 MRR with 0 sales calls and 1 engineer",
      body: "We stopped competing on enterprise feature checklists and focused on single-utility speed.\n\nKey growth drivers:\n- Opinionated defaults over infinite configurations\n- Public changelogs that turned users into evangelists\n- Programmatic SEO pages that captured high-intent search\n\nSimplicity scales faster than complexity.",
      image: "/assets/postcraft-linkedin.svg",
    },
    twitter: {
      hook: "0 sales calls. 1 solo founder. $20k monthly recurring revenue. Here is the exact blueprint: 📈",
      tweet: "1. Ship an opinionated tool solving 1 painful problem\n2. Share weekly revenue numbers transparently\n3. Turn support tickets into immediate product improvements\n\nFocus beats feature bloat every single time.",
      image: "/assets/postcraft-twitter.svg",
    },
    instagram: {
      caption: "Proof that you don't need a 20-person team to build a high-margin digital business. ⚡️ Focus on high leverage, clean UI, and solving one problem 10x better than bloated software.\n\nDouble tap if you're building something of your own this year! 🚀",
      hashtags: ["#microsaas", "#solopreneur", "#indiehackers", "#softwaredeveloper", "#remotework"],
      image: "/assets/postcraft-instagram.svg",
    },
  },
  {
    topic: "Sustainable Coffee Sourcing & Ethical Roasting",
    category: "E-Commerce & Brands",
    linkedin: {
      headline: "How Direct-Trade Supply Chains are Disrupting Traditional Retail",
      body: "Fair trade was a good start. Direct trade is the future.\n\nBy cutting out 4 intermediaries and purchasing directly from high-altitude micro-farms in Colombia, we increased farmer margins by 48% while maintaining supreme bean freshness.\n\nHere is what every consumer brand can learn about building an authentic, ethical supply chain.",
      image: "/assets/postcraft-linkedin.svg",
    },
    twitter: {
      hook: "We eliminated 4 middlemen between coffee farmers and your morning cup. The numbers shocked us: ☕️",
      tweet: "Traditional supply chain: Farmers make ~$1.20/lb.\nDirect-trade model: Farmers earn $3.40/lb + reinvest in local soil health.\n\nBetter coffee, ethical profits, real transparency.",
      image: "/assets/postcraft-twitter.svg",
    },
    instagram: {
      caption: "Every morning ritual has a story behind the roast. ☕️🌿 Direct trade isn't just a label on our bag—it's a promise that every harvest supports generational farming families in Huila, Colombia.\n\nSmell the difference. Taste the integrity.",
      hashtags: ["#specialtycoffee", "#directtrade", "#ethicalbrands", "#coffeeculture", "#sustainableliving"],
      image: "/assets/postcraft-instagram.svg",
    },
  },
];

const FAQS = [
  {
    q: "How does PostCraft AI optimize content differently for each platform?",
    a: "LinkedIn values structured thought leadership, readable spacing, and strong career/business takeaways. Twitter/X prioritizes punchy hooks, high readability, and conversational threads. Instagram focuses on emotive captions, swipe-friendly callouts, and curated hashtags. PostCraft coordinates all three formats simultaneously from a single core prompt.",
  },
  {
    q: "Are the AI images customized with the correct aspect ratios?",
    a: "Yes! PostCraft automatically instructs Gemini's Imagen visual engine to render 16:9 landscape aspect ratios for LinkedIn and Twitter/X, and 1:1 square compositions for Instagram. Pro users can generate in up to 2K resolution.",
  },
  {
    q: "Can I edit and refine the copy before publishing?",
    a: "Absolutely. Every card features live inline editing, copy-to-clipboard buttons, and a built-in AI assistant offering one-click enhancements (e.g. 'Make it punchier', 'Stronger hook', 'Shorten fluff', or custom prompts).",
  },
  {
    q: "How does the Campaign ZIP Export work?",
    a: "With a single click, PostCraft compiles all 3 posts into beautifully formatted Markdown/text files and pairs them with high-resolution visual image assets into a neat .zip archive ready for scheduling.",
  },
  {
    q: "Do I need an account to test PostCraft AI?",
    a: "No! You can jump straight into the Generator Studio with 5 free daily generations right now. Creating an account or signing in allows you to save history and track quotas across devices.",
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  user,
  quota,
  theme,
  onToggleTheme,
  onOpenProModal,
  onSignOut,
  onTryGenerate,
  onOpenLoginModal,
  onOpenBrandKitModal,
  brandKit,
}) => {
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);
  const [activePlatformTab, setActivePlatformTab] = useState<"linkedin" | "twitter" | "instagram">("linkedin");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Interactive Hero Campaign generator state
  const [heroTopic, setHeroTopic] = useState("Launching our autonomous AI agent that automates omnichannel social growth and tailored 3D graphics");
  const [heroTone, setHeroTone] = useState<Tone>("Professional");
  const [heroSampleIndex, setHeroSampleIndex] = useState(0);

  const handleHeroGenerateClick = () => {
    if (!user) {
      if (onOpenLoginModal) {
        onOpenLoginModal(heroTopic, heroTone);
      } else {
        onNavigate("login");
      }
    } else {
      if (onTryGenerate) {
        onTryGenerate(heroTopic, heroTone);
      } else {
        onNavigate("generator");
      }
    }
  };

  const currentSample = DEMO_SAMPLES[activeSampleIndex];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/85 dark:bg-zinc-950/85 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate("landing")}>
            <PostCraftLogo variant="horizontal" size="md" showTagline={false} />
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              Studio v2.4
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            <a href="#features" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#demo" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Live Showcase
            </a>
            <a href="#pricing" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Switcher */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg border bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
            </button>

            {/* Auth / Profile Actions */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover border border-indigo-500/40"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 max-w-[100px] truncate">
                    {user.name}
                  </span>
                </div>

                <button
                  onClick={() => onNavigate("generator")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/25 transition-all"
                >
                  <span>Open Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate("login")}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Sign In
                </button>

                <button
                  onClick={() => onNavigate("generator")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-sm shadow-indigo-600/20 active:scale-95 transition-all"
                >
                  <span>Launch Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/10 via-violet-500/10 to-amber-500/10 blur-3xl pointer-events-none -z-10 rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 shadow-sm mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span>Turn 1 Core Idea into 3 Viral Formats with Matching Social Visuals</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.15] sm:leading-[1.12]">
            One Prompt.{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 bg-clip-text text-transparent">
              Every Social Channel.
            </span>
            <br />
            Synchronized in Seconds.
          </h1>

          {/* Subtitle */}
          <p className="mt-5 max-w-2xl mx-auto text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Stop rewording the same post manually. PostCraft AI orchestrates algorithm-tailored thought leadership
            for <strong className="text-zinc-800 dark:text-zinc-200">LinkedIn</strong>, punchy hooks for{" "}
            <strong className="text-zinc-800 dark:text-zinc-200">Twitter/X</strong>, visual storytelling for{" "}
            <strong className="text-zinc-800 dark:text-zinc-200">Instagram</strong>, and full <strong className="text-zinc-800 dark:text-zinc-200">Video & Reel Scripts</strong> with teleprompter pacing.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate("generator")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/25 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Generating Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {!user && (
              <button
                onClick={() => onNavigate("login")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 transition-colors"
              >
                <span>Create Account / Sign In</span>
              </button>
            )}

            <a
              href="#demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <span>See Live Sample</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Feature Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>5 Free Generations Daily</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>1-Click ZIP Campaign Export</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Powered by Gemini 2.5</span>
            </div>
          </div>

          {/* Interactive Omnichannel Studio Showcase Hero Component */}
          <div className="mt-12 sm:mt-16 text-left max-w-5xl mx-auto">
            {/* Top Prompt Tryout Sandbox */}
            <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-3xl border border-indigo-200/80 dark:border-indigo-900/60 shadow-2xl p-4 sm:p-6 mb-4 ring-1 ring-black/5 dark:ring-white/5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-500/15 to-violet-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    Interactive Studio Sandbox
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline">
                    Try entering your idea below:
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {brandKit?.enabled ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800/60">
                      <Palette className="w-3 h-3" /> Brand Kit: {brandKit.brandName || "Active"}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenBrandKitModal?.()}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 font-medium transition-colors"
                    >
                      <Palette className="w-3 h-3" /> Connect Brand Kit
                    </button>
                  )}

                  {quota.isPro ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30">
                      <Crown className="w-3 h-3" /> PRO Active
                    </span>
                  ) : (
                    <span className="text-zinc-500 font-medium">
                      {Math.max(0, quota.maxFree - quota.countToday)} free left
                    </span>
                  )}
                </div>
              </div>

              {/* Topic Input Field */}
              <div className="relative">
                <textarea
                  rows={2}
                  value={heroTopic}
                  onChange={(e) => setHeroTopic(e.target.value)}
                  placeholder="Describe your announcement, lesson, launch, or product story..."
                  className="w-full text-xs sm:text-sm p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none shadow-inner"
                />
              </div>

              {/* Quick Trending Topics */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">Trending prompts:</span>
                {[
                  { text: "✨ Autonomous AI Agents for Customer Growth", idx: 0 },
                  { text: "🚀 Bootstrapped Micro-SaaS to $20k MRR", idx: 1 },
                  { text: "🌿 Sustainable Direct-Trade Brand Launch", idx: 2 },
                ].map((preset) => (
                  <button
                    key={preset.text}
                    type="button"
                    onClick={() => {
                      setHeroTopic(preset.text.replace(/^[^\s]+\s/, ""));
                      setHeroSampleIndex(preset.idx);
                    }}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all ${
                      heroSampleIndex === preset.idx
                        ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 font-semibold"
                        : "bg-zinc-100 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 border-zinc-200 dark:border-zinc-700/50"
                    }`}
                  >
                    {preset.text}
                  </button>
                ))}
              </div>

              {/* Controls & Generate Trigger Button */}
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mr-1">Tone:</span>
                  {(["Professional", "Witty", "Urgent", "Casual", "Inspirational"] as Tone[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setHeroTone(t)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        heroTone === t
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  id="btn-hero-generate"
                  onClick={handleHeroGenerateClick}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/30 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate 3-Platform Campaign</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Showcase / Demo Preview */}
      <section id="demo" className="py-16 bg-zinc-50/70 dark:bg-zinc-900/40 border-y border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
              Live Preview
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
              One Input. Three Specialized Channels.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Select a sample campaign below to see how PostCraft adapts tone, copy length, hashtags, and image aspect
              ratios natively.
            </p>

            {/* Sample Selector Tabs */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-zinc-200/80 dark:bg-zinc-800/80 border border-zinc-300/60 dark:border-zinc-700/60 mt-5">
              {DEMO_SAMPLES.map((sample, idx) => (
                <button
                  key={sample.topic}
                  onClick={() => setActiveSampleIndex(idx)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeSampleIndex === idx
                      ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  <span className="opacity-60 mr-1.5">{sample.category}:</span>
                  <span>{sample.topic}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Platform Showcase Box */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
            {/* Top platform bar */}
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-6 py-3 bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePlatformTab("linkedin")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activePlatformTab === "linkedin"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn (16:9)</span>
                </button>

                <button
                  onClick={() => setActivePlatformTab("twitter")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activePlatformTab === "twitter"
                      ? "bg-sky-600 text-white shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Twitter className="w-3.5 h-3.5" />
                  <span>Twitter / X (16:9)</span>
                </button>

                <button
                  onClick={() => setActivePlatformTab("instagram")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activePlatformTab === "instagram"
                      ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram (1:1)</span>
                </button>
              </div>

              <button
                onClick={() => onNavigate("generator")}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <span>Generate Your Own Topic</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Platform Content Display */}
            <div className="p-4 sm:p-7">
              {activePlatformTab === "linkedin" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  <div className="space-y-3.5">
                    {/* LinkedIn Authentic Author Header matching reference imagesa.jpeg */}
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                          IN
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                              PostCraft Creator
                            </span>
                            <span className="text-[10px] text-zinc-400 font-normal">• 1st</span>
                          </div>
                          <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            Omnichannel Social Architect & Founder · 2d · 🌐
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                        + Follow
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-snug">
                      "{currentSample.linkedin.headline}"
                    </h3>

                    <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                      {currentSample.linkedin.body}
                    </div>

                    {/* LinkedIn Authentic Reaction Counts & Buttons matching reference imagesa.jpeg */}
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                        <div className="flex items-center gap-1">
                          <span className="flex -space-x-1">
                            <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px]">👍</span>
                            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px]">💡</span>
                            <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[9px]">👏</span>
                          </span>
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300 ml-1">1,420</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span>84 comments</span>
                          <span>·</span>
                          <span>39 reposts</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-1 pt-1 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 text-center">
                        <div className="py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                          <span>👍 Like</span>
                        </div>
                        <div className="py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                          <span>💬 Comment</span>
                        </div>
                        <div className="py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                          <span>🔁 Repost</span>
                        </div>
                        <div className="py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                          <span>🚀 Send</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <LinkedInShowcaseVisual topic={currentSample.topic} sampleIndex={activeSampleIndex} />
                    <p className="text-[11px] text-zinc-400 text-center font-medium">
                      16:9 Executive Thought-Leadership Banner · Formatted for LinkedIn feed
                    </p>
                  </div>
                </div>
              )}

              {activePlatformTab === "twitter" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  <div className="space-y-3.5">
                    {/* Twitter/X Verified Author Header matching reference imagesb.png */}
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-black text-sm">
                          𝕏
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                              PostCraft AI
                            </span>
                            <span className="text-sky-500 font-bold text-xs" title="Verified Account">✓</span>
                          </div>
                          <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            @postcraft_ai
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="px-3 py-1 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-bold hover:opacity-90 transition-opacity"
                      >
                        Follow
                      </button>
                    </div>

                    <div className="p-3.5 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/50">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-1">
                        High-Converting Opening Hook
                      </span>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {currentSample.twitter.hook}
                      </p>
                    </div>

                    <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                      {currentSample.twitter.tweet}
                    </div>

                    {/* Twitter/X Tweet Engagement Actions matching reference imagesb.png */}
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 px-2">
                      <span className="hover:text-sky-500 cursor-pointer flex items-center gap-1">
                        💬 142
                      </span>
                      <span className="hover:text-emerald-500 cursor-pointer flex items-center gap-1">
                        🔁 389
                      </span>
                      <span className="hover:text-rose-500 cursor-pointer flex items-center gap-1">
                        ❤️ 1,890
                      </span>
                      <span className="hover:text-sky-500 cursor-pointer flex items-center gap-1">
                        📊 48.2K
                      </span>
                      <span className="hover:text-sky-500 cursor-pointer flex items-center gap-1">
                        🔖 Bookmark
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <TwitterShowcaseVisual topic={currentSample.topic} sampleIndex={activeSampleIndex} />
                    <p className="text-[11px] text-zinc-400 text-center font-medium">
                      16:9 High-Density Thread Infographic · Clean vector data architecture
                    </p>
                  </div>
                </div>
              )}

              {activePlatformTab === "instagram" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  <div className="space-y-3.5">
                    {/* Instagram Author Header matching reference images.jpeg */}
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600">
                          <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center font-bold text-xs text-zinc-900 dark:text-white">
                            IG
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                              postcraft.official
                            </span>
                            <span className="text-pink-500 text-xs">●</span>
                          </div>
                          <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            Original Audio · Sponsored
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-pink-600 dark:text-pink-400 cursor-pointer">
                        Follow
                      </span>
                    </div>

                    <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                      {currentSample.instagram.caption}
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-zinc-500 block mb-1.5">
                        Targeted Smart Hashtags:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentSample.instagram.hashtags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-900/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Instagram Bottom Action Bar */}
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 px-1">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">❤️ 2.4k</span>
                        <span className="flex items-center gap-1">💬 189</span>
                        <span className="flex items-center gap-1">✈️ Share</span>
                      </div>
                      <span>🔖 Save</span>
                    </div>
                  </div>

                  <div className="space-y-2 flex flex-col items-center justify-center w-full">
                    <InstagramShowcaseVisual topic={currentSample.topic} sampleIndex={activeSampleIndex} />
                    <p className="text-[11px] text-zinc-400 text-center font-medium">
                      1:1 Square Multi-Card Carousel · Exclusive Instagram format with pagination
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom CTA within showcase */}
            <div className="bg-zinc-50 dark:bg-zinc-950/70 border-t border-zinc-200 dark:border-zinc-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                Want to generate this for your own startup or client brand?
              </div>
              <button
                onClick={() => onNavigate("generator")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all"
              >
                <span>Open Generator Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
              Engineered For Results
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-1">
              Everything You Need to Dominate Feeds
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Built specifically for founders, ghostwriters, and marketing teams who refuse to post generic copy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 - Brand Kit */}
            <div className="p-6 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/40 to-white dark:from-indigo-950/20 dark:to-zinc-900/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Palette className="w-5 h-5" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 mb-2">
                New Update
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
                Brand Kit & Visual References
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Upload your company logo, set primary & accent hex colors, pick from 5 aesthetic visual styles (3D Isometric, Minimalist, Cybertech), and automatically watermark every image generated.
              </p>
            </div>

            {/* Feature 2 - 10-Item History */}
            <div className="p-6 rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-gradient-to-b from-purple-50/40 to-white dark:from-purple-950/20 dark:to-zinc-900/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <History className="w-5 h-5" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 mb-2">
                New Update
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
                Persistent 10-Item Local History
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Every generated campaign is safely saved to local storage with original prompt, tone, copy, and images. Revisit, restore with 1 click, or compare performance across sessions.
              </p>
            </div>

            {/* Feature 3 - Pro Upgrade */}
            <div className="p-6 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-gradient-to-b from-amber-50/40 to-white dark:from-amber-950/20 dark:to-zinc-900/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <Crown className="w-5 h-5" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 mb-2">
                Pro Creator Plan
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
                Unlimited Pro Generations
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Remove the daily 5-generation limit with Pro membership. Unlock unlimited runs, priority Gemini Flash speed, and ultra-high-definition 2K visual resolution.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
                Multi-Platform Voice Tuning
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                LinkedIn gets structured thought leadership with line spacing. Twitter gets punchy hooks and threads.
                Instagram gets storytelling captions with high-reach hashtags.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-4">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
                1-Click Campaign ZIP Export
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Package complete multi-platform campaigns with all text copies in clean markdown and rendered images
                into a single downloadable zip file for instant scheduling.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mb-4">
                <Edit3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
                In-Place Editing & AI Polisher
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Edit text right inside the card, or use the 1-click AI Polisher to make copy punchier, inject stronger
                hooks, trim fluff, or expand storytelling effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-zinc-50/60 dark:bg-zinc-900/40 border-y border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
              Streamlined Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
              From Thought to Publication in 3 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-md shadow-indigo-600/30">
                1
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">Input Your Core Concept</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Type your topic, choose your tone (Professional, Witty, Urgent, Casual, etc.), and optionally designate
                your target audience and call-to-action.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-md shadow-violet-600/30">
                2
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">Gemini Generates & Formats</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                PostCraft crafts native copy tailored to each channel's algorithm while prompting Imagen to render
                matching 16:9 and 1:1 image assets in parallel.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white font-black text-lg flex items-center justify-center mb-4 shadow-md shadow-amber-500/30">
                3
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">Refine, Copy, or ZIP</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Polish hooks inline, copy posts with one click, or export the entire campaign as an organized ZIP bundle
                ready to schedule into Buffer or Hootsuite.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
              Simple & Transparent
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-1">
              Start Free. Upgrade for Limitless Scale.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              No hidden fees or surprise usage charges. Everything you need to supercharge your content creation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Free Tier */}
            <div className="p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Starter Creator</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    Free Forever
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-zinc-900 dark:text-white">$0</span>
                  <span className="text-xs text-zinc-500">/ month</span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                  Ideal for testing the waters and exploring synchronized social generation.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>5 full campaign generations per day</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Synchronized LinkedIn, Twitter/X & Instagram copy</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Standard 512px AI visual generation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Inline post editing & clipboard copy</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Local campaign history</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onNavigate("generator")}
                className="w-full mt-8 py-3 px-4 rounded-xl text-xs font-bold border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-750 text-zinc-900 dark:text-zinc-100 transition-colors"
              >
                Launch Free Studio
              </button>
            </div>

            {/* Pro Tier */}
            <div className="p-8 rounded-3xl border-2 border-indigo-600 dark:border-indigo-500 bg-white dark:bg-zinc-900 shadow-xl relative flex flex-col justify-between">
              <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md">
                MOST POPULAR
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Pro Creator</h3>
                    <Crown className="w-4 h-4 text-amber-500" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-zinc-900 dark:text-white">$19</span>
                  <span className="text-xs text-zinc-500">/ month</span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                  For serious founders, consultants, and marketing agencies creating weekly content.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-center gap-2 font-semibold text-indigo-600 dark:text-indigo-400">
                    <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>Unlimited daily campaign generations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Ultra-crisp 1K & 2K resolution image upscaling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Full 1-Click Campaign ZIP bundle download</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>AI Post Polisher ('Punchier', 'Stronger Hook', 'Trim Fluff')</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Audience Persona and Call-to-Action steering</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Priority Gemini 2.5 Flash token processing</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onOpenProModal}
                className="w-full mt-8 py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-600/30 active:scale-95 transition-all"
              >
                {quota.isPro ? "You are currently on Pro!" : "Upgrade to Pro"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-zinc-50/60 dark:bg-zinc-900/40 border-y border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
              Loved by Creators
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
              Real Impact on Social Reach
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                  "PostCraft AI completely replaced my 3-step drafting routine. Being able to get the LinkedIn thought
                  piece and the Twitter thread at once with matching visuals cut my ghostwriting time in half."
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Elena Vance"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-white">Elena Vance</div>
                  <div className="text-[11px] text-zinc-400">B2B SaaS Growth Consultant</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                  "The aspect ratio handling is pure genius. 16:9 for X and 1:1 for IG automatically. And the ZIP
                  export button means our social intern can schedule a week of posts in 15 minutes."
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Marcus Thorne"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-white">Marcus Thorne</div>
                  <div className="text-[11px] text-zinc-400">Agency Founder @ ReachForge</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                  "The 'Make it punchier' AI polish action is my secret weapon. It instantly strips out fluff and turns
                  mediocre drafts into attention-grabbing hooks."
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                  alt="Chloe Chen"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-white">Chloe Chen</div>
                  <div className="text-[11px] text-zinc-400">Tech Influencer & Creator</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
              Questions & Answers
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900/60 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? "rotate-180 text-indigo-500" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/80 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action Banner */}
      <section className="py-16 bg-gradient-to-tr from-indigo-900 via-indigo-950 to-zinc-950 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-5 border border-white/20">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Supercharge Your Social Media Presence?
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
            Generate your first synchronized campaign in 10 seconds. Free forever, no setup required.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate("generator")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-white text-indigo-950 hover:bg-zinc-100 shadow-xl shadow-black/30 transition-all active:scale-95"
            >
              <span>Launch Studio Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {!user && (
              <button
                onClick={() => onNavigate("login")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border border-white/30 hover:bg-white/10 text-white transition-all"
              >
                <span>Create an Account</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-10 bg-white dark:bg-zinc-950 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <PostCraftLogo variant="horizontal" size="sm" showTagline={true} />
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate("landing")} className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Home
            </button>
            <button onClick={() => onNavigate("generator")} className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Generator Studio
            </button>
            <button onClick={() => onNavigate("login")} className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Sign In
            </button>
            <button onClick={onOpenProModal} className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Pro Features
            </button>
          </div>

          <div>
            © {new Date().getFullYear()} PostCraft AI. Built with Google AI Studio.
          </div>
        </div>
      </footer>
    </div>
  );
};
