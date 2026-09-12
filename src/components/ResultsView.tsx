import React, { useState } from "react";
import {
  Linkedin,
  Twitter,
  Instagram,
  LayoutGrid,
  Layers,
  Copy,
  Check,
  Download,
  Sparkles,
  Share2,
  Archive,
  Loader2,
  Palette,
  Clapperboard,
  Video,
  ImageIcon,
  Sliders,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Platform, GenerationResult, LinkedInPost, TwitterPost, InstagramPost } from "../types";
import { PlatformPostCard } from "./PlatformPostCard";
import { VideoScriptCard } from "./VideoScriptCard";
import { ImagePreviewStudio } from "./ImagePreviewStudio";
import { downloadBase64Image, exportResultAsZip } from "../utils/storage";

interface ResultsViewProps {
  result: GenerationResult;
  onRegeneratePlatform: (platform: Platform, type: "both" | "text" | "image") => Promise<void>;
  onUpdatePlatformContent: (platform: Platform, updatedData: any) => void;
  regeneratingPlatform: Platform | null;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  onRegeneratePlatform,
  onUpdatePlatformContent,
  regeneratingPlatform,
}) => {
  const [activeTab, setActiveTab] = useState<Platform | "script" | "studio">("linkedin");
  const [layoutMode, setLayoutMode] = useState<"tabs" | "grid">("grid");
  const [showStudioPanel, setShowStudioPanel] = useState<boolean>(true);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);

  const handleCopyAll = async () => {
    try {
      const formatted = `=== LINKEDIN ===
${result.linkedin.headline}

${result.linkedin.content}

=== TWITTER / X ===
${result.twitter.tweet}

=== INSTAGRAM ===
${result.instagram.caption}

${result.instagram.hashtags?.map((t) => (t.startsWith("#") ? t : `#${t}`)).join(" ")}`;

      await navigator.clipboard.writeText(formatted);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      console.error("Failed to copy all:", err);
    }
  };

  const handleDownloadAllImages = () => {
    if (result.linkedin.imageUrl) {
      downloadBase64Image(result.linkedin.imageUrl, `postcraft-linkedin-${Date.now()}.png`);
    }
    if (result.twitter.imageUrl) {
      setTimeout(() => {
        downloadBase64Image(result.twitter.imageUrl!, `postcraft-twitter-${Date.now()}.png`);
      }, 300);
    }
    if (result.instagram.imageUrl) {
      setTimeout(() => {
        downloadBase64Image(result.instagram.imageUrl!, `postcraft-instagram-${Date.now()}.png`);
      }, 600);
    }
  };

  const handleExportZip = async () => {
    setIsExportingZip(true);
    try {
      await exportResultAsZip(result);
    } catch (err) {
      console.error("Failed to export ZIP:", err);
    } finally {
      setIsExportingZip(false);
    }
  };

  const tabMeta: { id: Platform | "script" | "studio"; label: string; icon: any; color: string; badge?: string }[] = [
    { id: "linkedin", label: "LinkedIn", icon: Linkedin, color: "text-[#0A66C2]" },
    { id: "twitter", label: "Twitter / X", icon: Twitter, color: "text-zinc-900 dark:text-white" },
    { id: "instagram", label: "Instagram", icon: Instagram, color: "text-[#dc2743]" },
    { id: "studio", label: "Image Studio & Crop", icon: Sliders, color: "text-emerald-600 dark:text-emerald-400", badge: "Framing" },
    { id: "script", label: "Video / Reel Script", icon: Clapperboard, color: "text-violet-600 dark:text-violet-400", badge: "Studio" },
  ];

  return (
    <div id="results-view" className="space-y-4 animate-in fade-in duration-300">
      {/* Action bar above results */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Topic:
          </span>
          <span className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1 max-w-xs sm:max-w-md">
            "{result.topic}"
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40">
            {result.tone}
          </span>
          {result.brandKit?.enabled && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <Palette className="w-3 h-3" />
              <span>{result.brandKit.brandName || "Brand Kit"}</span>
            </span>
          )}
        </div>

        {/* Layout Mode & Global Batch Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap">
          {/* Toggle Image Studio Preview Drawer */}
          <button
            type="button"
            id="toggle-image-studio-btn"
            onClick={() => setShowStudioPanel(!showStudioPanel)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              showStudioPanel
                ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 shadow-xs"
                : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            }`}
            title="Toggle Image Preview & Crop Studio"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Image Studio</span>
            {showStudioPanel ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* View toggle (Tabs vs 3-col Grid) */}
          <div className="inline-flex rounded-lg p-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs">
            <button
              type="button"
              id="view-mode-grid"
              onClick={() => setLayoutMode("grid")}
              className={`p-1.5 rounded-md flex items-center gap-1 font-medium transition-all ${
                layoutMode === "grid"
                  ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
              title="Side-by-side grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Side-by-Side</span>
            </button>
            <button
              type="button"
              id="view-mode-tabs"
              onClick={() => setLayoutMode("tabs")}
              className={`p-1.5 rounded-md flex items-center gap-1 font-medium transition-all ${
                layoutMode === "tabs"
                  ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
              title="Focused tab view"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Platform Tabs</span>
            </button>
          </div>

          {/* Batch Copy All */}
          <button
            type="button"
            id="btn-copy-all"
            onClick={handleCopyAll}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 transition-colors"
            title="Copy all 3 generated posts to clipboard"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedAll ? "Copied All" : "Copy All"}</span>
          </button>

          {/* Export Full ZIP bundle */}
          <button
            type="button"
            id="btn-export-zip"
            onClick={handleExportZip}
            disabled={isExportingZip}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 flex items-center gap-1.5 transition-colors shadow-xs"
            title="Download complete campaign ZIP (copy files + HD images)"
          >
            {isExportingZip ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
            ) : (
              <Archive className="w-3.5 h-3.5 text-indigo-600" />
            )}
            <span className="hidden sm:inline">{isExportingZip ? "Zipping..." : "Export ZIP"}</span>
          </button>
        </div>
      </div>

      {/* Persistent / Expandable Image Preview & Framing Studio */}
      {showStudioPanel && (
        <ImagePreviewStudio
          result={result}
          onUpdatePlatformContent={onUpdatePlatformContent}
        />
      )}

      {/* Tabs navigation bar if in tab mode or on mobile */}
      {layoutMode === "tabs" && (
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-1.5 gap-1.5 shadow-xs">
          {tabMeta.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                id={`tab-select-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  isSelected
                    ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800/80 shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                }`}
              >
                <Icon className={`w-4 h-4 ${tab.color}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Content Rendering */}
      {layoutMode === "tabs" ? (
        <div className="w-full max-w-3xl mx-auto">
          {activeTab === "linkedin" && (
            <PlatformPostCard
              platform="linkedin"
              data={result.linkedin}
              topic={result.topic}
              tone={result.tone}
              onRegenerate={onRegeneratePlatform}
              onUpdateContent={onUpdatePlatformContent}
              isRegenerating={regeneratingPlatform === "linkedin"}
            />
          )}
          {activeTab === "twitter" && (
            <PlatformPostCard
              platform="twitter"
              data={result.twitter}
              topic={result.topic}
              tone={result.tone}
              onRegenerate={onRegeneratePlatform}
              onUpdateContent={onUpdatePlatformContent}
              isRegenerating={regeneratingPlatform === "twitter"}
            />
          )}
          {activeTab === "instagram" && (
            <PlatformPostCard
              platform="instagram"
              data={result.instagram}
              topic={result.topic}
              tone={result.tone}
              onRegenerate={onRegeneratePlatform}
              onUpdateContent={onUpdatePlatformContent}
              isRegenerating={regeneratingPlatform === "instagram"}
            />
          )}
          {activeTab === "studio" && (
            <ImagePreviewStudio
              result={result}
              onUpdatePlatformContent={onUpdatePlatformContent}
            />
          )}
          {activeTab === "script" && result.videoScript && (
            <VideoScriptCard script={result.videoScript} topic={result.topic} />
          )}
        </div>
      ) : (
        /* 3-Column Responsive Grid + Video Script Section */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
            <PlatformPostCard
              platform="linkedin"
              data={result.linkedin}
              topic={result.topic}
              tone={result.tone}
              onRegenerate={onRegeneratePlatform}
              onUpdateContent={onUpdatePlatformContent}
              isRegenerating={regeneratingPlatform === "linkedin"}
            />
            <PlatformPostCard
              platform="twitter"
              data={result.twitter}
              topic={result.topic}
              tone={result.tone}
              onRegenerate={onRegeneratePlatform}
              onUpdateContent={onUpdatePlatformContent}
              isRegenerating={regeneratingPlatform === "twitter"}
            />
            <PlatformPostCard
              platform="instagram"
              data={result.instagram}
              topic={result.topic}
              tone={result.tone}
              onRegenerate={onRegeneratePlatform}
              onUpdateContent={onUpdatePlatformContent}
              isRegenerating={regeneratingPlatform === "instagram"}
            />
          </div>

          {/* Full Multimedia Video Script Card */}
          {result.videoScript && (
            <div className="w-full">
              <VideoScriptCard script={result.videoScript} topic={result.topic} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
