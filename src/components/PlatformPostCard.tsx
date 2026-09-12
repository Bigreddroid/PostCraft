import React, { useState } from "react";
import {
  Copy,
  Check,
  Download,
  RefreshCw,
  Linkedin,
  Twitter,
  Instagram,
  ImageIcon,
  Sparkles,
  AlertCircle,
  Hash,
  Edit3,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ListOrdered,
  MessageSquare,
  ShieldCheck,
  Layers,
  Heart,
  MessageCircle,
  Repeat2,
  Send,
  Bookmark,
  Share2,
  MoreHorizontal,
  Maximize2,
  X,
  ThumbsUp,
  Lightbulb,
  Award,
  Globe,
  Check as CheckIcon,
  BadgeCheck,
} from "lucide-react";
import { Platform, LinkedInPost, TwitterPost, InstagramPost, ImprovementAction, Tone } from "../types";
import { downloadBase64Image } from "../utils/storage";

interface PlatformPostCardProps {
  platform: Platform;
  data: LinkedInPost | TwitterPost | InstagramPost;
  topic: string;
  tone: Tone;
  onRegenerate: (platform: Platform, type: "both" | "text" | "image") => Promise<void>;
  onUpdateContent: (platform: Platform, updatedData: any) => void;
  isRegenerating: boolean;
}

export const PlatformPostCard: React.FC<PlatformPostCardProps> = ({
  platform,
  data,
  topic,
  tone,
  onRegenerate,
  onUpdateContent,
  isRegenerating,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showImproveMenu, setShowImproveMenu] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [customInstruction, setCustomInstruction] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Platform Booleans
  const isLinkedIn = platform === "linkedin";
  const isTwitter = platform === "twitter";
  const isInstagram = platform === "instagram";

  // LinkedIn Specific State
  const linkedinData = isLinkedIn ? (data as LinkedInPost) : null;
  const [isLinkedInExpanded, setIsLinkedInExpanded] = useState(false);
  const [likedLinkedIn, setLikedLinkedIn] = useState(false);

  // Twitter Specific State
  const twitterData = isTwitter ? (data as TwitterPost) : null;
  const hasTwitterThread = Boolean(twitterData?.thread && twitterData.thread.length > 0);
  const [twitterFormat, setTwitterFormat] = useState<"thread" | "single">(
    hasTwitterThread ? "thread" : "single"
  );
  const [likedTwitter, setLikedTwitter] = useState(false);
  const [retweetedTwitter, setRetweetedTwitter] = useState(false);

  // Instagram Specific State (ONLY Instagram has sliding carousel)
  const instaData = isInstagram ? (data as InstagramPost) : null;
  const hasInstaCarousel = Boolean(instaData?.carouselSlides && instaData.carouselSlides.length > 0);
  const [activeIgSlideIndex, setActiveIgSlideIndex] = useState(0);
  const [isIgExpanded, setIsIgExpanded] = useState(false);
  const [likedInstagram, setLikedInstagram] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [instaRatio, setInstaRatio] = useState<"1:1" | "4:5">("1:1");
  const [instaViewMode, setInstaViewMode] = useState<"carousel" | "image">("carousel");
  const [showCoverHeader, setShowCoverHeader] = useState(true);

  // Copy helpers
  let fullTextToCopy = "";
  if (isLinkedIn) {
    fullTextToCopy = `${linkedinData?.headline ? `${linkedinData.headline}\n\n` : ""}${linkedinData?.content || ""}`;
  } else if (isTwitter) {
    if (twitterFormat === "thread" && twitterData?.thread && twitterData.thread.length > 0) {
      fullTextToCopy = twitterData.thread.join("\n\n---\n\n");
    } else {
      fullTextToCopy = twitterData?.tweet || "";
    }
  } else if (isInstagram) {
    if (hasInstaCarousel && instaData?.carouselSlides) {
      const slidesText = instaData.carouselSlides
        .map((s) => `[Slide ${s.slideNumber}: ${s.title}]\n${s.body}`)
        .join("\n\n---\n\n");
      const tagString = instaData?.hashtags
        ? instaData.hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ")
        : "";
      fullTextToCopy = `CAROUSEL SLIDES:\n${slidesText}\n\nCAPTION:\n${instaData?.caption || ""}\n\n${tagString}`;
    } else {
      const tagString = instaData?.hashtags
        ? instaData.hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ")
        : "";
      fullTextToCopy = `${instaData?.caption || ""}\n\n${tagString}`;
    }
  }

  const handleCopy = async (customText?: string, label: string = "Copied!") => {
    try {
      await navigator.clipboard.writeText(customText || fullTextToCopy);
      setCopied(true);
      setCopiedLabel(label);
      setTimeout(() => {
        setCopied(false);
        setCopiedLabel(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownloadImage = () => {
    if (!data.imageUrl) return;
    const filename = `postcraft-${platform}-${Date.now()}.png`;
    downloadBase64Image(data.imageUrl, filename);
  };

  const handleDoubleTapIg = () => {
    setLikedInstagram(true);
    setShowHeartAnimation(true);
    setTimeout(() => setShowHeartAnimation(false), 800);
  };

  // AI Post Improvement
  const handleImprove = async (action: ImprovementAction | "custom") => {
    setIsImproving(true);
    setShowImproveMenu(false);
    setShowCustomInput(false);

    try {
      let currentContent = "";
      let currentHeadline = "";

      if (isLinkedIn) {
        currentContent = (data as LinkedInPost).content;
        currentHeadline = (data as LinkedInPost).headline;
      } else if (isTwitter) {
        currentContent = (data as TwitterPost).tweet;
      } else if (isInstagram) {
        currentContent = (data as InstagramPost).caption;
      }

      const response = await fetch("/api/improve-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          currentContent,
          currentHeadline,
          action: action === "custom" ? undefined : action,
          customInstruction: action === "custom" ? customInstruction : undefined,
          topic,
          tone,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to improve post");
      }

      const res = await response.json();
      if (res.data) {
        if (isLinkedIn) {
          onUpdateContent("linkedin", {
            ...data,
            headline: res.data.headline || (data as LinkedInPost).headline,
            content: res.data.content || (data as LinkedInPost).content,
          });
        } else if (isTwitter) {
          onUpdateContent("twitter", {
            ...data,
            hook: res.data.hook || (data as TwitterPost).hook,
            tweet: res.data.tweet || (data as TwitterPost).tweet,
          });
        } else if (isInstagram) {
          onUpdateContent("instagram", {
            ...data,
            caption: res.data.caption || (data as InstagramPost).caption,
            hashtags: res.data.hashtags || (data as InstagramPost).hashtags,
          });
        }
      }
    } catch (err) {
      console.error("Improvement error:", err);
    } finally {
      setIsImproving(false);
      setCustomInstruction("");
    }
  };

  // Platform Metadata
  const platformMeta = {
    linkedin: {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-[#0A66C2] text-white",
      badge: "Thought Leadership",
      aspectRatioText: "16:9 Landscape Banner",
    },
    twitter: {
      name: "Twitter / X",
      icon: Twitter,
      color: "bg-black dark:bg-zinc-800 text-white",
      badge: "Punchy Hook & Thread",
      aspectRatioText: "16:9 Infographic",
    },
    instagram: {
      name: "Instagram",
      icon: Instagram,
      color: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white",
      badge: "Swipe Carousel & Visuals",
      aspectRatioText: "1:1 Square Deck",
    },
  }[platform];

  const IconComponent = platformMeta.icon;

  // Counters
  const tweetCharCount = isTwitter ? (data as TwitterPost).tweet?.length || 0 : 0;
  const isOverLimit = isTwitter && tweetCharCount > 260;
  const linkedInWordCount = isLinkedIn
    ? ((data as LinkedInPost).content || "").split(/\s+/).filter(Boolean).length
    : 0;
  const instaTagCount = isInstagram ? ((data as InstagramPost).hashtags || []).length : 0;

  return (
    <div
      id={`card-${platform}`}
      className="flex flex-col h-full rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden transition-all hover:shadow-md"
    >
      {/* Platform Control Bar */}
      <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/40">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl shadow-xs ${platformMeta.color}`}>
            <IconComponent className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                {platformMeta.name}
              </h3>
              {isTwitter && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isOverLimit
                      ? "bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400"
                      : tweetCharCount > 240
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                      : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                  }`}
                >
                  {tweetCharCount}/260
                </span>
              )}
              {isLinkedIn && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
                  {linkedInWordCount} words
                </span>
              )}
              {isInstagram && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300">
                  {hasInstaCarousel ? `${instaData?.carouselSlides?.length || 5} Cards Carousel` : `${instaTagCount} tags`}
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {platformMeta.badge} · {platformMeta.aspectRatioText}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            id={`btn-edit-${platform}`}
            onClick={() => setIsEditing(!isEditing)}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              isEditing
                ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300"
                : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
            }`}
            title={isEditing ? "Save edits" : "Edit text"}
          >
            {isEditing ? <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isEditing ? "Save" : "Edit"}</span>
          </button>

          <button
            type="button"
            id={`btn-regen-${platform}`}
            onClick={() => onRegenerate(platform, "both")}
            disabled={isRegenerating || isImproving}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs flex items-center gap-1 transition-colors"
            title="Regenerate this platform"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin text-indigo-500" : ""}`} />
            <span className="hidden sm:inline">Regen</span>
          </button>

          <button
            type="button"
            id={`btn-copy-${platform}`}
            onClick={() => handleCopy()}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              copied
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs active:scale-95"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{copiedLabel || "Copied!"}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Body with Authentic Native Previews */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* AI Improvement Dropdown Menu */}
          <div className="relative">
            <div className="flex items-center justify-between">
              <button
                type="button"
                id={`btn-improve-${platform}`}
                onClick={() => setShowImproveMenu(!showImproveMenu)}
                disabled={isImproving}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 transition-all"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isImproving ? "animate-spin text-amber-500" : "text-indigo-500"}`} />
                <span>{isImproving ? "Refining with AI..." : "Polish with AI"}</span>
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </button>

              {isEditing && (
                <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                  Editing Active
                </span>
              )}
            </div>

            {showImproveMenu && (
              <div className="absolute left-0 top-full mt-1.5 w-64 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl z-20 space-y-1">
                <button
                  type="button"
                  onClick={() => handleImprove("make_punchier")}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-between"
                >
                  <span>⚡ Make it punchier</span>
                  <span className="text-[10px] text-zinc-400">High impact</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleImprove("stronger_hook")}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-between"
                >
                  <span>🪝 Stronger opening hook</span>
                  <span className="text-[10px] text-zinc-400">Viral</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleImprove("shorten")}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-between"
                >
                  <span>✂️ Shorten & trim fluff</span>
                  <span className="text-[10px] text-zinc-400">Concise</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleImprove("add_emojis")}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-between"
                >
                  <span>🎨 Add tasteful emojis</span>
                  <span className="text-[10px] text-zinc-400">Visual</span>
                </button>
                <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomInput(true);
                      setShowImproveMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                  >
                    Custom instruction...
                  </button>
                </div>
              </div>
            )}

            {showCustomInput && (
              <div className="mt-2 p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center gap-2">
                <input
                  type="text"
                  value={customInstruction}
                  onChange={(e) => setCustomInstruction(e.target.value)}
                  placeholder="e.g. Add actionable framework takeaways"
                  className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                />
                <button
                  type="button"
                  onClick={() => handleImprove("custom")}
                  className="px-2.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomInput(false)}
                  className="text-xs text-zinc-500 hover:text-zinc-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* 1. LINKEDIN: AUTHENTIC FEED POST WITH AUTHOR & 16:9 BANNER */}
          {/* ========================================================= */}
          {isLinkedIn && (
            <div className="space-y-3">
              {/* Authentic LinkedIn Post Card Frame */}
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 shadow-xs space-y-3">
                {/* LinkedIn Author Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0A66C2] to-sky-400 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      LI
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                          Thought Leader
                        </span>
                        <span className="text-[11px] text-zinc-400">• 1st</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                        Founder & Social Architect · Scaling B2B Influence
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                        <span>2h</span>
                        <span>•</span>
                        <Globe className="w-2.5 h-2.5" />
                        <span>• Edited</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-xs font-semibold text-[#0A66C2] hover:bg-blue-50 dark:hover:bg-blue-950/50 px-2.5 py-1 rounded-full border border-[#0A66C2]/30 transition-colors"
                  >
                    + Follow
                  </button>
                </div>

                {/* Post Content */}
                {isEditing ? (
                  <div className="space-y-2 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-500 mb-1">
                        Executive Headline / Hook:
                      </label>
                      <input
                        type="text"
                        value={(data as LinkedInPost).headline}
                        onChange={(e) =>
                          onUpdateContent("linkedin", { ...data, headline: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-500 mb-1">
                        Post Body (Structured Storytelling):
                      </label>
                      <textarea
                        rows={8}
                        value={(data as LinkedInPost).content}
                        onChange={(e) =>
                          onUpdateContent("linkedin", { ...data, content: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    {(data as LinkedInPost).headline && (
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                        {(data as LinkedInPost).headline}
                      </p>
                    )}

                    <div className="relative">
                      <p
                        className={`text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-line ${
                          !isLinkedInExpanded ? "line-clamp-4" : ""
                        }`}
                      >
                        {(data as LinkedInPost).content}
                      </p>
                      {((data as LinkedInPost).content || "").length > 180 && (
                        <button
                          type="button"
                          onClick={() => setIsLinkedInExpanded(!isLinkedInExpanded)}
                          className="text-xs font-bold text-[#0A66C2] hover:underline mt-1 inline-block"
                        >
                          {isLinkedInExpanded ? "see less" : "...see more"}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* LinkedIn Featured Image (Un-cropped 16:9) */}
                <div className="pt-2">
                  <div className="relative rounded-xl overflow-hidden bg-zinc-950 border border-zinc-200 dark:border-zinc-800 group">
                    {data.imageUrl ? (
                      <div className="relative aspect-[16/9] w-full flex items-center justify-center">
                        <img
                          src={data.imageUrl}
                          alt={`LinkedIn banner for ${topic}`}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          type="button"
                          onClick={() => setIsImageModalOpen(true)}
                          className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shadow-md"
                          title="View Full Resolution"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-medium">Zoom</span>
                        </button>
                      </div>
                    ) : (
                      <div className="aspect-[16/9] flex items-center justify-center p-4 text-zinc-400">
                        <Sparkles className="w-5 h-5 animate-pulse text-indigo-500 mr-2" />
                        <span className="text-xs">Generating 16:9 LinkedIn Executive Visual...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* LinkedIn Engagement & Reaction Bar */}
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-1">
                      <span className="flex -space-x-1">
                        <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[9px] text-white">👍</span>
                        <span className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-[9px] text-white">💡</span>
                        <span className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center text-[9px] text-white">❤️</span>
                      </span>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300 ml-1">
                        {likedLinkedIn ? "You and 432 others" : "432"}
                      </span>
                    </div>
                    <span>38 comments · 14 reposts</span>
                  </div>

                  <div className="grid grid-cols-4 gap-1 pt-1 border-t border-zinc-100 dark:border-zinc-800/60 text-xs">
                    <button
                      type="button"
                      onClick={() => setLikedLinkedIn(!likedLinkedIn)}
                      className={`py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        likedLinkedIn ? "text-[#0A66C2] bg-blue-50 dark:bg-blue-950/40" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Like</span>
                    </button>
                    <button
                      type="button"
                      className="py-1.5 rounded-lg font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Comment</span>
                    </button>
                    <button
                      type="button"
                      className="py-1.5 rounded-lg font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-1.5"
                    >
                      <Repeat2 className="w-3.5 h-3.5" />
                      <span>Repost</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy()}
                      className="py-1.5 rounded-lg font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. TWITTER / X: AUTHENTIC THREAD TIMELINE (CONNECTED) OR SINGLE TWEET    */}
          {/* ========================================================================= */}
          {isTwitter && (
            <div className="space-y-3">
              {/* Thread Format Toggle */}
              {hasTwitterThread && (
                <div className="flex items-center justify-between pb-1 text-xs">
                  <div className="inline-flex rounded-lg p-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                    <button
                      type="button"
                      onClick={() => setTwitterFormat("thread")}
                      className={`px-3 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 ${
                        twitterFormat === "thread"
                          ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
                          : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                      }`}
                    >
                      <ListOrdered className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Connected Thread ({twitterData?.thread?.length || 5} Tweets)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTwitterFormat("single")}
                      className={`px-3 py-1 rounded-md font-bold transition-all ${
                        twitterFormat === "single"
                          ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs"
                          : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                      }`}
                    >
                      Single Tweet
                    </button>
                  </div>

                  {twitterFormat === "thread" && (
                    <button
                      type="button"
                      onClick={() => handleCopy(fullTextToCopy, "Full Thread Copied!")}
                      className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy Thread
                    </button>
                  )}
                </div>
              )}

              {/* THREAD MODE: Connected Vertical Timeline (NO sliding carousel!) */}
              {twitterFormat === "thread" && twitterData?.thread && twitterData.thread.length > 0 ? (
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-0">
                  <div className="relative pl-7 space-y-4 before:absolute before:left-3 before:top-4 before:bottom-6 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
                    {twitterData.thread.map((tweetText, idx) => {
                      const charLen = tweetText.length;
                      const isOver = charLen > 260;
                      const isFirst = idx === 0;
                      const isLast = idx === twitterData.thread!.length - 1;

                      return (
                        <div key={idx} className="relative group">
                          {/* Thread Index Node */}
                          <span className="absolute -left-7 top-1 w-6 h-6 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[10px] font-black flex items-center justify-center ring-4 ring-white dark:ring-zinc-950 shadow-xs z-10">
                            {idx + 1}
                          </span>

                          <div className="p-3.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 space-y-2 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                            {/* Tweet Header */}
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-zinc-900 dark:text-zinc-100">PostCraft</span>
                                <BadgeCheck className="w-3.5 h-3.5 text-sky-500" />
                                <span className="text-[11px] text-zinc-400">@postcraft · {isFirst ? "Hook" : isLast ? "CTA" : "Insight"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                    isOver
                                      ? "bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400"
                                      : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                                  }`}
                                >
                                  {charLen}/260
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(tweetText, `Tweet #${idx + 1} Copied`)}
                                  className="text-zinc-400 hover:text-indigo-600 transition-colors p-0.5"
                                  title="Copy this single tweet"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Tweet Text */}
                            {isEditing ? (
                              <textarea
                                rows={3}
                                value={tweetText}
                                onChange={(e) => {
                                  const updated = [...twitterData.thread!];
                                  updated[idx] = e.target.value;
                                  onUpdateContent("twitter", { ...data, thread: updated });
                                }}
                                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                              />
                            ) : (
                              <p className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 leading-relaxed whitespace-pre-line font-normal">
                                {tweetText}
                              </p>
                            )}

                            {/* Attach visual on the first tweet */}
                            {isFirst && data.imageUrl && (
                              <div className="pt-2">
                                <div className="relative rounded-xl overflow-hidden bg-zinc-950 border border-zinc-200 dark:border-zinc-800 group aspect-[16/9] w-full flex items-center justify-center shadow-md">
                                  <img
                                    src={data.imageUrl}
                                    alt={`Twitter visual for ${topic}`}
                                    className="w-full h-full object-contain"
                                    referrerPolicy="no-referrer"
                                  />

                                  {/* Branded Cover Header Bar */}
                                  <div className="absolute top-0 inset-x-0 p-2 sm:p-2.5 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between text-white z-10 pointer-events-none">
                                    <div className="flex items-center gap-1.5 overflow-hidden">
                                      <span className="px-2 py-0.5 rounded bg-sky-500/30 border border-sky-400/40 text-[9px] font-black uppercase tracking-wider text-sky-300">
                                        ⚡️ COVER
                                      </span>
                                      <span className="text-[10px] font-bold text-white drop-shadow truncate max-w-[200px] sm:max-w-[280px]">
                                        {twitterData?.hook || topic}
                                      </span>
                                    </div>
                                    <span className="text-[9px] font-mono text-zinc-300 bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded border border-white/10 shrink-0">
                                      @postcraft.official ✓
                                    </span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => setIsImageModalOpen(true)}
                                    className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shadow-md z-10"
                                  >
                                    <Maximize2 className="w-3.5 h-3.5" />
                                    <span className="text-[10px]">Zoom</span>
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Mini action bar */}
                            <div className="flex items-center justify-between pt-1 text-zinc-400 text-[11px]">
                              <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> 24</span>
                              <span className="flex items-center gap-1"><Repeat2 className="w-3 h-3" /> 86</span>
                              <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> 312</span>
                              <span className="flex items-center gap-1"><Bookmark className="w-3 h-3" /></span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* SINGLE TWEET PREVIEW */
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs">
                        𝕏
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">PostCraft Creator</span>
                          <BadgeCheck className="w-3.5 h-3.5 text-sky-500" />
                        </div>
                        <span className="text-[11px] text-zinc-400">@postcraft · 1h</span>
                      </div>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-zinc-400" />
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-500 mb-1">Hook:</label>
                        <input
                          type="text"
                          value={(data as TwitterPost).hook}
                          onChange={(e) => onUpdateContent("twitter", { ...data, hook: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-500 mb-1">Tweet Body (≤260 chars):</label>
                        <textarea
                          rows={4}
                          value={(data as TwitterPost).tweet}
                          onChange={(e) => onUpdateContent("twitter", { ...data, tweet: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {(data as TwitterPost).hook && (
                        <p className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                          {(data as TwitterPost).hook}
                        </p>
                      )}
                      <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-line font-normal">
                        {(data as TwitterPost).tweet}
                      </p>
                    </div>
                  )}

                  {/* 16:9 Landscape Graphic */}
                  {data.imageUrl && (
                    <div className="relative rounded-xl overflow-hidden bg-zinc-950 border border-zinc-200 dark:border-zinc-800 group aspect-[16/9] w-full flex items-center justify-center shadow-md">
                      <img
                        src={data.imageUrl}
                        alt={`Twitter visual for ${topic}`}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />

                      {/* Branded Cover Header Bar */}
                      <div className="absolute top-0 inset-x-0 p-2 sm:p-2.5 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between text-white z-10 pointer-events-none">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <span className="px-2 py-0.5 rounded bg-sky-500/30 border border-sky-400/40 text-[9px] font-black uppercase tracking-wider text-sky-300">
                            ⚡️ VIRAL COVER
                          </span>
                          <span className="text-[10px] font-bold text-white drop-shadow truncate max-w-[200px] sm:max-w-[280px]">
                            {(data as TwitterPost).hook || topic}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-300 bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded border border-white/10 shrink-0">
                          @postcraft.official ✓
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsImageModalOpen(true)}
                        className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shadow-md z-10"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Zoom</span>
                      </button>
                    </div>
                  )}

                  {/* Twitter Engagement Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-500">
                    <button type="button" className="flex items-center gap-1 hover:text-sky-500 transition-colors">
                      <MessageCircle className="w-4 h-4" /> 38
                    </button>
                    <button
                      type="button"
                      onClick={() => setRetweetedTwitter(!retweetedTwitter)}
                      className={`flex items-center gap-1 hover:text-emerald-500 transition-colors ${retweetedTwitter ? "text-emerald-500" : ""}`}
                    >
                      <Repeat2 className="w-4 h-4" /> 142
                    </button>
                    <button
                      type="button"
                      onClick={() => setLikedTwitter(!likedTwitter)}
                      className={`flex items-center gap-1 hover:text-rose-500 transition-colors ${likedTwitter ? "text-rose-500" : ""}`}
                    >
                      <Heart className={`w-4 h-4 ${likedTwitter ? "fill-rose-500 text-rose-500" : ""}`} /> 890
                    </button>
                    <button type="button" className="flex items-center gap-1 hover:text-sky-500 transition-colors">
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => handleCopy()} className="flex items-center gap-1 hover:text-indigo-500 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. INSTAGRAM: SIGNATURE SWIPE CAROUSEL (ONLY INSTAGRAM HAS CAROUSEL POST) */}
          {/* ========================================================================= */}
          {isInstagram && (
            <div className="space-y-3">
              {/* Authentic Instagram Mobile Card Frame */}
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-xs space-y-0">
                {/* Instagram Profile Header with Aspect Ratio Selector */}
                <div className="p-3 sm:p-3.5 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80">
                  <div className="flex items-center gap-2.5">
                    {/* Story Gradient Ring */}
                    <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border-2 border-white dark:border-zinc-900 flex items-center justify-center font-bold text-[10px] text-pink-600">
                        IG
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">postcraft.official</span>
                        <BadgeCheck className="w-3 h-3 text-sky-500" />
                      </div>
                      <p className="text-[10px] text-zinc-400">Original Audio · Silicon Valley, CA</p>
                    </div>
                  </div>

                  {/* Instagram View & Ratio Controls */}
                  <div className="flex items-center gap-2">
                    {/* View Switcher (Carousel vs Graphic) if both exist */}
                    {hasInstaCarousel && data.imageUrl && (
                      <div className="inline-flex rounded-lg bg-zinc-100 dark:bg-zinc-900 p-0.5 border border-zinc-200 dark:border-zinc-800 text-[10px] font-semibold">
                        <button
                          type="button"
                          onClick={() => setInstaViewMode("carousel")}
                          className={`px-2 py-0.5 rounded-md transition-all ${
                            instaViewMode === "carousel"
                              ? "bg-white dark:bg-zinc-800 text-pink-600 dark:text-pink-400 shadow-xs font-bold"
                              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                          }`}
                        >
                          📱 Slides ({instaData?.carouselSlides?.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setInstaViewMode("image")}
                          className={`px-2 py-0.5 rounded-md transition-all ${
                            instaViewMode === "image"
                              ? "bg-white dark:bg-zinc-800 text-pink-600 dark:text-pink-400 shadow-xs font-bold"
                              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                          }`}
                        >
                          🖼️ Graphic
                        </button>
                      </div>
                    )}

                    {/* Ratio Selector Pill (1:1 Square vs 4:5 Portrait) */}
                    <div className="inline-flex rounded-lg bg-zinc-100 dark:bg-zinc-900 p-0.5 border border-zinc-200 dark:border-zinc-800 text-[10px] font-semibold">
                      <button
                        type="button"
                        onClick={() => setInstaRatio("1:1")}
                        className={`px-2 py-0.5 rounded-md transition-all ${
                          instaRatio === "1:1"
                            ? "bg-white dark:bg-zinc-800 text-pink-600 dark:text-pink-400 shadow-xs font-bold"
                            : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                        }`}
                        title="1:1 Square (1080x1080 standard)"
                      >
                        1:1
                      </button>
                      <button
                        type="button"
                        onClick={() => setInstaRatio("4:5")}
                        className={`px-2 py-0.5 rounded-md transition-all ${
                          instaRatio === "4:5"
                            ? "bg-white dark:bg-zinc-800 text-pink-600 dark:text-pink-400 shadow-xs font-bold"
                            : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                        }`}
                        title="4:5 Portrait (1080x1350 feed expand)"
                      >
                        4:5
                      </button>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-zinc-400" />
                  </div>
                </div>

                {/* SIGNATURE INSTAGRAM VISUAL DISPLAY */}
                {hasInstaCarousel && instaData?.carouselSlides && instaData.carouselSlides.length > 0 && instaViewMode === "carousel" ? (
                  <div className="relative bg-zinc-950 select-none overflow-hidden" onDoubleClick={handleDoubleTapIg}>
                    {/* Top Floating Slide Counter (e.g. 1/5) */}
                    <div className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-white shadow-md">
                      {activeIgSlideIndex + 1}/{instaData.carouselSlides.length}
                    </div>

                    {/* Left / Right Chevron Controls */}
                    {activeIgSlideIndex > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveIgSlideIndex((prev) => Math.max(0, prev - 1));
                        }}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/70 hover:bg-black text-white backdrop-blur-sm border border-white/20 shadow-lg transition-transform active:scale-95"
                        aria-label="Previous Slide"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )}

                    {activeIgSlideIndex < instaData.carouselSlides.length - 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveIgSlideIndex((prev) =>
                            Math.min(instaData.carouselSlides!.length - 1, prev + 1)
                          );
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/70 hover:bg-black text-white backdrop-blur-sm border border-white/20 shadow-lg transition-transform active:scale-95"
                        aria-label="Next Slide"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}

                    {/* Double-tap heart animation overlay */}
                    {showHeartAnimation && (
                      <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none animate-in zoom-in-50 duration-300">
                        <Heart className="w-20 h-20 fill-rose-500 text-rose-500 drop-shadow-2xl animate-bounce" />
                      </div>
                    )}

                    {/* Active Carousel Slide Content View */}
                    {(() => {
                      const slide =
                        instaData.carouselSlides[activeIgSlideIndex] ||
                        instaData.carouselSlides[0];
                      return (
                        <div
                          className={`w-full relative flex flex-col justify-between p-5 sm:p-7 text-white overflow-hidden bg-gradient-to-br from-zinc-950 via-[#13071b] to-purple-950/70 ${
                            instaRatio === "4:5" ? "aspect-[4/5]" : "aspect-square"
                          }`}
                        >
                          {/* Background Artwork Texture if generated */}
                          {data.imageUrl && (
                            <img
                              src={data.imageUrl}
                              alt=""
                              className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-[2px] scale-105 pointer-events-none"
                            />
                          )}

                          {/* Dynamic Atmospheric Ambient Lighting */}
                          <div className="absolute -top-12 -right-12 w-52 h-52 bg-pink-600/25 rounded-full blur-3xl pointer-events-none" />
                          <div className="absolute -bottom-12 -left-12 w-52 h-52 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
                          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-30" />

                          {/* Slide Top Badge */}
                          <div className="relative z-10 flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-full bg-pink-600/35 border border-pink-500/50 text-[10px] font-black uppercase tracking-wider text-pink-300 backdrop-blur-md">
                              {activeIgSlideIndex === 0
                                ? "⚡️ HOOK COVER"
                                : activeIgSlideIndex === instaData.carouselSlides.length - 1
                                ? "🚀 ACTION CTA"
                                : `STEP ${slide.slideNumber}`}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-mono bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
                              {instaRatio === "4:5" ? "4:5 Portrait" : "1:1 Square"} · Swipe ➔
                            </span>
                          </div>

                          {/* Frosted Glass Content Card */}
                          <div className="relative z-10 my-auto space-y-2.5 p-4 sm:p-5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 shadow-2xl">
                            <h4 className="text-base sm:text-lg font-black text-white leading-snug">
                              {slide.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium whitespace-pre-line">
                              {slide.body}
                            </p>
                          </div>

                          {/* Slide Footer */}
                          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-2.5 text-[10px] text-zinc-400 font-mono">
                            <span className="font-semibold text-zinc-300">@postcraft.official</span>
                            <span className="text-pink-400 font-semibold">Save & Share 💾</span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Bottom Pagination Dots */}
                    <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                      {instaData.carouselSlides.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveIgSlideIndex(idx)}
                          className={`rounded-full transition-all ${
                            activeIgSlideIndex === idx
                              ? "w-3 h-2 bg-pink-500 rounded-full"
                              : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Single Image / Graphic Instagram Post */
                  <div
                    className={`relative bg-zinc-950 w-full flex items-center justify-center group select-none overflow-hidden ${
                      instaRatio === "4:5" ? "aspect-[4/5]" : "aspect-square"
                    }`}
                    onDoubleClick={handleDoubleTapIg}
                  >
                    {/* Double-tap heart animation overlay */}
                    {showHeartAnimation && (
                      <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none animate-in zoom-in-50 duration-300">
                        <Heart className="w-20 h-20 fill-rose-500 text-rose-500 drop-shadow-2xl animate-bounce" />
                      </div>
                    )}

                    {data.imageUrl ? (
                      <>
                        <img
                          src={data.imageUrl}
                          alt={`Instagram graphic for ${topic}`}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />

                        {/* Top Branding Overlay Pill */}
                        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white shadow-md flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                          <span>{instaRatio === "4:5" ? "4:5 Portrait" : "1:1 Square"}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsImageModalOpen(true)}
                          className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/75 hover:bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shadow-md z-10"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Zoom</span>
                        </button>
                      </>
                    ) : (
                      <div className="p-4 text-center text-zinc-400">
                        <Sparkles className="w-6 h-6 animate-pulse text-pink-500 mx-auto mb-1" />
                        <span className="text-xs">
                          Generating {instaRatio === "4:5" ? "4:5 Portrait" : "1:1 Square"} Instagram Graphic...
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Instagram Action Icons */}
                <div className="p-3 sm:p-3.5 space-y-2 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setLikedInstagram(!likedInstagram)}
                        className="transition-transform active:scale-125"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            likedInstagram ? "fill-rose-500 text-rose-500" : "text-zinc-700 dark:text-zinc-200"
                          }`}
                        />
                      </button>
                      <MessageCircle className="w-5 h-5 text-zinc-700 dark:text-zinc-200" />
                      <Send className="w-5 h-5 text-zinc-700 dark:text-zinc-200" />
                    </div>
                    <Bookmark className="w-5 h-5 text-zinc-700 dark:text-zinc-200" />
                  </div>

                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {likedInstagram ? "Liked by you and 2,419 others" : "Liked by sarah_v and 2,418 others"}
                  </p>

                  {/* Caption & Hashtags */}
                  {isEditing ? (
                    <div className="space-y-2 pt-1">
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-500 mb-1">Caption:</label>
                        <textarea
                          rows={4}
                          value={(data as InstagramPost).caption}
                          onChange={(e) => onUpdateContent("instagram", { ...data, caption: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-500 mb-1">Hashtags:</label>
                        <input
                          type="text"
                          value={((data as InstagramPost).hashtags || []).join(" ")}
                          onChange={(e) =>
                            onUpdateContent("instagram", {
                              ...data,
                              hashtags: e.target.value.split(/[,\s]+/).map((t) => t.replace(/^#/, "")).filter(Boolean),
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5 pt-1">
                      <p className={`text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-line ${!isIgExpanded ? "line-clamp-2" : ""}`}>
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 mr-1.5">postcraft.official</span>
                        {(data as InstagramPost).caption}
                      </p>
                      {((data as InstagramPost).caption || "").length > 100 && (
                        <button
                          type="button"
                          onClick={() => setIsIgExpanded(!isIgExpanded)}
                          className="text-xs font-semibold text-zinc-400 hover:text-zinc-600 block"
                        >
                          {isIgExpanded ? "less" : "more"}
                        </button>
                      )}

                      {/* Hashtags */}
                      {(data as InstagramPost).hashtags && (data as InstagramPost).hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {(data as InstagramPost).hashtags.map((tag, idx) => {
                            const formatted = tag.startsWith("#") ? tag : `#${tag}`;
                            return (
                              <span
                                key={idx}
                                className="text-[11px] font-medium text-blue-600 dark:text-sky-400 hover:underline cursor-pointer"
                              >
                                {formatted}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Utility Bar: Prompt Hint & Actions */}
        <div className="pt-2 flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-1 truncate max-w-[70%]" title={data.imagePrompt}>
            <ImageIcon className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
            <span className="truncate text-[11px] italic">Art Prompt: {data.imagePrompt || "Optimized platform layout"}</span>
          </div>

          {data.imageUrl && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => onRegenerate(platform, "image")}
                disabled={isRegenerating || isImproving}
                className="text-[11px] text-zinc-500 hover:text-indigo-600 px-1.5 py-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isRegenerating ? "animate-spin" : ""}`} />
                <span>Re-roll Art</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadImage}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline px-1.5 py-0.5 rounded flex items-center gap-0.5"
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FULL-RESOLUTION LIGHTBOX MODAL (Zero Cropping) */}
      {isImageModalOpen && data.imageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] w-full bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-700 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm uppercase tracking-wider">{platformMeta.name} High-Res Graphic</span>
                <span className="text-xs text-zinc-400">({platformMeta.aspectRatioText})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadImage}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Image Preview Box (100% Un-cropped) */}
            <div className="flex-1 p-4 sm:p-8 flex items-center justify-center bg-black overflow-auto">
              <img
                src={data.imageUrl}
                alt={`${platform} full preview`}
                className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Modal Footer with Prompt */}
            {data.imagePrompt && (
              <div className="p-3 bg-zinc-950 border-t border-zinc-800 text-xs text-zinc-400">
                <span className="font-semibold text-zinc-300">Image Generation Prompt: </span>
                <span>{data.imagePrompt}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
