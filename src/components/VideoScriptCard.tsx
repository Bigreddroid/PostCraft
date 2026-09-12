import React, { useState, useEffect, useRef } from "react";
import {
  Video,
  Clapperboard,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  Download,
  Sparkles,
  Eye,
  Mic,
  FileText,
  Volume2,
  Tv,
  ArrowRight,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { VideoScript } from "../types";

interface VideoScriptCardProps {
  script: VideoScript;
  topic: string;
}

export const VideoScriptCard: React.FC<VideoScriptCardProps> = ({ script, topic }) => {
  const [activeMode, setActiveMode] = useState<"storyboard" | "teleprompter">("storyboard");
  const [copiedSpoken, setCopiedSpoken] = useState(false);
  const [copiedFull, setCopiedFull] = useState(false);

  // Teleprompter auto-scroll state
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(2); // 1 to 5
  const [fontSize, setFontSize] = useState<"md" | "lg" | "xl">("lg");
  const teleprompterRef = useRef<HTMLDivElement>(null);

  // Auto-scroll loop
  useEffect(() => {
    let animationFrame: number;
    if (isPlaying && teleprompterRef.current) {
      const scroll = () => {
        if (teleprompterRef.current) {
          teleprompterRef.current.scrollTop += scrollSpeed * 0.75;
          // Loop or stop if reached bottom
          if (
            teleprompterRef.current.scrollTop + teleprompterRef.current.clientHeight >=
            teleprompterRef.current.scrollHeight - 5
          ) {
            setIsPlaying(false);
          } else {
            animationFrame = requestAnimationFrame(scroll);
          }
        }
      };
      animationFrame = requestAnimationFrame(scroll);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, scrollSpeed]);

  const allSpokenText = [
    `HOOK:\n${script.hook}`,
    ...script.scenes.map((s) => `[${s.timestamp}] ${s.audioVoiceover}`),
    `OUTRO / CTA:\n${script.callToAction}`,
  ].join("\n\n");

  const fullStoryboardText = [
    `# 🎬 VIDEO / REEL SCRIPT: ${script.title || topic}`,
    `⏱ Duration: ${script.durationEstimate} | 📱 Platform: ${script.targetPlatform} | 🗣 Words: ${script.wordCount || 120}`,
    `\n## 🪝 0-3s SCROLL-STOPPING HOOK:`,
    script.hook,
    `\n## 🎥 SCENE-BY-SCENE STORYBOARD:`,
    ...script.scenes.map(
      (s) =>
        `### Scene ${s.sceneNumber} (${s.timestamp})\n- 👁 Visual Direction: ${s.visualDirection}\n- 🎙 Spoken Voiceover: "${s.audioVoiceover}"\n- 🔤 On-Screen Text: [${s.onScreenText}]`
    ),
    `\n## 📢 CALL TO ACTION:\n${script.callToAction}`,
  ].join("\n\n");

  const handleCopySpoken = async () => {
    try {
      await navigator.clipboard.writeText(allSpokenText);
      setCopiedSpoken(true);
      setTimeout(() => setCopiedSpoken(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyFull = async () => {
    try {
      await navigator.clipboard.writeText(fullStoryboardText);
      setCopiedFull(true);
      setTimeout(() => setCopiedFull(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([fullStoryboardText], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `video-script-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-violet-200 dark:border-violet-900/50 shadow-md overflow-hidden transition-all">
      {/* Top Banner Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-violet-900 via-indigo-900 to-purple-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-violet-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center text-violet-300 shadow-sm">
            <Clapperboard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-300">
                Viral Short-Form Script
              </span>
              <span className="px-2 py-0.2 rounded-full bg-violet-500/30 border border-violet-400/40 text-[10px] font-bold text-violet-200">
                Reels · TikTok · Shorts
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
              {script.title || topic}
            </h3>
          </div>
        </div>

        {/* Script Metrics */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-zinc-200 font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{script.durationEstimate || "45-60s"}</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-zinc-200 font-mono">
            <Mic className="w-3.5 h-3.5 text-emerald-400" />
            <span>~{script.wordCount || 125} words</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-zinc-200 font-mono">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>140 WPM Pacing</span>
          </span>
        </div>
      </div>

      {/* Mode Selector & Quick Actions */}
      <div className="px-4 sm:px-6 py-3 bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex p-1 rounded-xl bg-zinc-200/80 dark:bg-zinc-800/80 border border-zinc-300/60 dark:border-zinc-700/60 text-xs">
          <button
            type="button"
            onClick={() => setActiveMode("storyboard")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeMode === "storyboard"
                ? "bg-white dark:bg-zinc-900 text-violet-700 dark:text-violet-300 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Scene Storyboard</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("teleprompter")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeMode === "teleprompter"
                ? "bg-white dark:bg-zinc-900 text-violet-700 dark:text-violet-300 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Teleprompter / Voiceover</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopySpoken}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            {copiedSpoken ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSpoken ? "Spoken Copied!" : "Copy Voiceover"}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyFull}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            {copiedFull ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <FileText className="w-3.5 h-3.5" />}
            <span>{copiedFull ? "Script Copied!" : "Copy Full Script"}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadMarkdown}
            className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            title="Download as Markdown"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-4 sm:p-6">
        {/* SCENE STORYBOARD VIEW */}
        {activeMode === "storyboard" && (
          <div className="space-y-4">
            {/* Opening 0-3s Hook Callout */}
            <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-violet-700 dark:text-violet-300 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  0-3s Scroll-Stopping Hook
                </span>
                <span className="text-[10px] font-mono text-zinc-500">First 3 Seconds</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                "{script.hook}"
              </p>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                <span>💡 Director Tip: Make eye contact, deliver with sudden energy, and use bold visual motion.</span>
              </div>
            </div>

            {/* Scene-by-Scene Timeline */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Scene Breakdown ({script.scenes.length} Scenes)
              </div>

              {script.scenes.map((scene) => (
                <div
                  key={scene.sceneNumber}
                  className="p-3.5 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2 hover:border-violet-300 dark:hover:border-violet-800 transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-violet-600 text-white font-black text-xs flex items-center justify-center">
                        {scene.sceneNumber}
                      </span>
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        Scene {scene.sceneNumber}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/70 px-2 py-0.5 rounded border border-violet-200 dark:border-violet-800">
                      ⏱ {scene.timestamp}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                    {/* Visual Direction */}
                    <div className="md:col-span-4 p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700/60 space-y-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">
                        <Eye className="w-3 h-3 text-indigo-500" />
                        <span>Camera / Visual Cue</span>
                      </div>
                      <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                        {scene.visualDirection}
                      </p>
                      {scene.onScreenText && (
                        <div className="pt-1">
                          <span className="inline-block px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                            🔤 Text: "{scene.onScreenText}"
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Audio Spoken Script */}
                    <div className="md:col-span-8 p-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                        <Volume2 className="w-3 h-3" />
                        <span>Spoken Voiceover (Teleprompter)</span>
                      </div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-relaxed">
                        "{scene.audioVoiceover}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Outro Call To Action */}
            <div className="p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-zinc-900 dark:text-white">📢 Outro Call-To-Action:</span>
                <span className="text-zinc-600 dark:text-zinc-300 italic">"{script.callToAction}"</span>
              </div>
              <span className="text-[10px] text-zinc-400 shrink-0">Closing 3-5s</span>
            </div>
          </div>
        )}

        {/* TELEPROMPTER VIEW */}
        {activeMode === "teleprompter" && (
          <div className="space-y-4">
            {/* Teleprompter Control Toolbar */}
            <div className="p-3 rounded-xl bg-zinc-900 text-white flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold transition-all ${
                    isPlaying
                      ? "bg-amber-500 text-black hover:bg-amber-400"
                      : "bg-violet-600 text-white hover:bg-violet-500 shadow-sm"
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? "Pause Scroll" : "Start Auto-Scroll"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    if (teleprompterRef.current) teleprompterRef.current.scrollTop = 0;
                  }}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                  title="Reset to top"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Speed & Font Sizing */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-zinc-400">Speed:</span>
                  {[1, 2, 3, 4].map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => setScrollSpeed(spd)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        scrollSpeed === spd
                          ? "bg-violet-500 text-white"
                          : "bg-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 border-l border-zinc-700 pl-3">
                  <span className="text-[11px] text-zinc-400">Font:</span>
                  {(["md", "lg", "xl"] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFontSize(sz)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                        fontSize === sz
                          ? "bg-violet-500 text-white"
                          : "bg-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scrollable Teleprompter Box */}
            <div
              ref={teleprompterRef}
              className={`h-72 sm:h-96 overflow-y-auto p-6 rounded-2xl bg-black text-white font-sans border border-zinc-800 space-y-6 shadow-inner transition-all select-none ${
                fontSize === "md"
                  ? "text-base sm:text-lg leading-relaxed"
                  : fontSize === "lg"
                  ? "text-lg sm:text-xl leading-relaxed"
                  : "text-xl sm:text-2xl leading-loose font-semibold"
              }`}
            >
              {/* Teleprompter Hook */}
              <div className="p-4 rounded-xl bg-violet-950/80 border border-violet-500/40 text-violet-200">
                <span className="text-[11px] font-mono text-violet-400 uppercase tracking-widest block mb-1">
                  [HOOK · 0:00 - 0:03]
                </span>
                {script.hook}
              </div>

              {/* Teleprompter Scenes */}
              {script.scenes.map((scene) => (
                <div key={scene.sceneNumber} className="space-y-1">
                  <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block">
                    [SCENE {scene.sceneNumber} · {scene.timestamp}]
                  </span>
                  <p className="text-zinc-100 font-medium">
                    {scene.audioVoiceover}
                  </p>
                </div>
              ))}

              {/* Teleprompter Outro */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">
                  [CALL TO ACTION]
                </span>
                {script.callToAction}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
