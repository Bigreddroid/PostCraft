import React, { useState, useRef, useEffect } from "react";
import {
  Maximize2,
  Crop,
  RotateCw,
  FlipHorizontal,
  ZoomIn,
  ZoomOut,
  Download,
  Check,
  RefreshCw,
  Sparkles,
  Sliders,
  Eye,
  Grid3X3,
  ShieldCheck,
  ChevronRight,
  Linkedin,
  Twitter,
  Instagram,
  ImageIcon,
} from "lucide-react";
import { Platform, GenerationResult, LinkedInPost, TwitterPost, InstagramPost } from "../types";
import { downloadBase64Image } from "../utils/storage";

interface ImagePreviewStudioProps {
  result: GenerationResult;
  onUpdatePlatformContent: (platform: Platform, updatedData: any) => void;
}

type AspectRatioPreset = "16:9" | "1:1" | "4:5" | "9:16" | "4:3" | "original";

interface PlatformImageMeta {
  platform: Platform;
  name: string;
  recommendedRatio: string;
  icon: any;
  color: string;
  badgeColor: string;
  data: LinkedInPost | TwitterPost | InstagramPost;
  imageUrl?: string;
}

export const ImagePreviewStudio: React.FC<ImagePreviewStudioProps> = ({
  result,
  onUpdatePlatformContent,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("linkedin");
  const [aspectRatio, setAspectRatio] = useState<AspectRatioPreset>("16:9");
  const [zoom, setZoom] = useState<number>(1);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showSafeZones, setShowSafeZones] = useState<boolean>(true);
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [appliedSuccess, setAppliedSuccess] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const platformItems: PlatformImageMeta[] = [
    {
      platform: "linkedin",
      name: "LinkedIn Header",
      recommendedRatio: "16:9 Widescreen",
      icon: Linkedin,
      color: "text-[#0A66C2]",
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/40",
      data: result.linkedin,
      imageUrl: result.linkedin.imageUrl,
    },
    {
      platform: "twitter",
      name: "Twitter / X Card",
      recommendedRatio: "16:9 Widescreen",
      icon: Twitter,
      color: "text-zinc-900 dark:text-white",
      badgeColor: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800",
      data: result.twitter,
      imageUrl: result.twitter.imageUrl,
    },
    {
      platform: "instagram",
      name: "Instagram Feed",
      recommendedRatio: "1:1 Square or 4:5 Portrait",
      icon: Instagram,
      color: "text-[#dc2743]",
      badgeColor: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-900/40",
      data: result.instagram,
      imageUrl: result.instagram.imageUrl,
    },
  ];

  const currentMeta = platformItems.find((p) => p.platform === selectedPlatform) || platformItems[0];
  const activeImageUrl = currentMeta.imageUrl;

  // Auto-set default aspect ratio when switching platforms
  useEffect(() => {
    if (selectedPlatform === "instagram") {
      setAspectRatio("1:1");
    } else {
      setAspectRatio("16:9");
    }
    resetTransforms();
  }, [selectedPlatform]);

  const resetTransforms = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setRotation(0);
    setFlipH(false);
  };

  // Aspect ratio math
  const getAspectRatioClasses = (ratio: AspectRatioPreset) => {
    switch (ratio) {
      case "16:9":
        return "aspect-[16/9] max-w-2xl";
      case "1:1":
        return "aspect-square max-w-lg";
      case "4:5":
        return "aspect-[4/5] max-w-md";
      case "9:16":
        return "aspect-[9/16] max-w-xs";
      case "4:3":
        return "aspect-[4/3] max-w-xl";
      case "original":
      default:
        return "aspect-[16/9] max-w-2xl";
    }
  };

  const getAspectDimensions = (ratio: AspectRatioPreset): { width: number; height: number } => {
    switch (ratio) {
      case "16:9":
        return { width: 1280, height: 720 };
      case "1:1":
        return { width: 1080, height: 1080 };
      case "4:5":
        return { width: 1080, height: 1350 };
      case "9:16":
        return { width: 1080, height: 1920 };
      case "4:3":
        return { width: 1200, height: 900 };
      case "original":
      default:
        return { width: 1280, height: 720 };
    }
  };

  // Render crop to canvas and return base64 DataURL
  const generateCroppedImage = async (): Promise<string | null> => {
    if (!activeImageUrl) return null;

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const { width: targetW, height: targetH } = getAspectDimensions(aspectRatio);
        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }

        // Fill background
        ctx.fillStyle = "#09090b";
        ctx.fillRect(0, 0, targetW, targetH);

        ctx.save();
        // Move to center of target canvas
        ctx.translate(targetW / 2, targetH / 2);

        // Apply Pan (scaled to target canvas resolution)
        const scaleFactorX = targetW / (containerRef.current?.clientWidth || 400);
        const scaleFactorY = targetH / (containerRef.current?.clientHeight || 400);
        ctx.translate(panX * scaleFactorX, panY * scaleFactorY);

        // Apply Rotation
        ctx.rotate((rotation * Math.PI) / 180);

        // Apply Flip
        ctx.scale(flipH ? -1 : 1, 1);

        // Calculate fitted image scale
        const imgRatio = img.width / img.height;
        const targetRatio = targetW / targetH;
        let drawW = targetW;
        let drawH = targetH;

        if (imgRatio > targetRatio) {
          drawW = targetH * imgRatio;
          drawH = targetH;
        } else {
          drawW = targetW;
          drawH = targetW / imgRatio;
        }

        // Apply user zoom
        drawW *= zoom;
        drawH *= zoom;

        // Draw centered
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();

        resolve(canvas.toDataURL("image/png", 0.95));
      };
      img.onerror = () => resolve(null);
      img.src = activeImageUrl;
    });
  };

  const handleApplyCrop = async () => {
    if (!activeImageUrl) return;
    setIsApplying(true);
    try {
      const croppedUrl = await generateCroppedImage();
      if (croppedUrl) {
        onUpdatePlatformContent(selectedPlatform, {
          ...currentMeta.data,
          imageUrl: croppedUrl,
        });
        setAppliedSuccess(true);
        setTimeout(() => setAppliedSuccess(false), 2500);
      }
    } catch (err) {
      console.error("Failed to apply crop:", err);
    } finally {
      setIsApplying(false);
    }
  };

  const handleDownloadCropped = async () => {
    const croppedUrl = await generateCroppedImage();
    if (croppedUrl) {
      downloadBase64Image(croppedUrl, `postcraft-${selectedPlatform}-adjusted-${Date.now()}.png`);
    } else if (activeImageUrl) {
      downloadBase64Image(activeImageUrl, `postcraft-${selectedPlatform}-original-${Date.now()}.png`);
    }
  };

  // Mouse pan handlers for interactive frame drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      id="image-preview-studio"
      className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 animate-in fade-in duration-300"
    >
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800/80 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                Visual Preview & Framing Studio
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Live Studio
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Inspect generated platform imagery, fine-tune aspect ratios, and pan/zoom framing with safe margins.
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={resetTransforms}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5 transition-colors"
            title="Reset pan, zoom and rotation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadCropped}
            disabled={!activeImageUrl}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 transition-colors"
            title="Download framed image at target resolution"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download High-Res</span>
          </button>

          <button
            type="button"
            onClick={handleApplyCrop}
            disabled={!activeImageUrl || isApplying}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              appliedSuccess
                ? "bg-emerald-600 text-white shadow-emerald-500/20"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20"
            }`}
            title="Apply manual framing to the post"
          >
            {appliedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Applied to Post!</span>
              </>
            ) : (
              <>
                <Crop className="w-3.5 h-3.5" />
                <span>{isApplying ? "Rendering..." : "Apply & Update Post"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Platform Selector Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {platformItems.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedPlatform === item.platform;
          return (
            <button
              key={item.platform}
              type="button"
              onClick={() => setSelectedPlatform(item.platform)}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                isSelected
                  ? "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 shadow-xs"
                  : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-zinc-950 flex items-center justify-center overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-700">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-zinc-500" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    {item.recommendedRatio}
                  </span>
                </div>
              </div>

              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-zinc-300 dark:border-zinc-600"
                }`}
              >
                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Studio Viewport and Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start pt-1">
        {/* Left: Interactive Canvas Framing Box (8 cols) */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-zinc-950 border border-zinc-800 relative overflow-hidden min-h-[360px] sm:min-h-[420px]">
          {/* Studio Watermark & Info */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-white flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {selectedPlatform.toUpperCase()} · {aspectRatio}
            </span>
            <span className="text-[10px] text-zinc-400 hidden sm:inline bg-black/60 px-2 py-1 rounded border border-white/5">
              Drag image inside to adjust framing
            </span>
          </div>

          {/* Overlay Toggle Tools (Top Right) */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowGrid(!showGrid)}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                showGrid
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-black/75 hover:bg-black text-zinc-300 border border-white/10"
              }`}
              title="Toggle Rule-of-Thirds Composition Grid"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setShowSafeZones(!showSafeZones)}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                showSafeZones
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-black/75 hover:bg-black text-zinc-300 border border-white/10"
              }`}
              title="Toggle Social UI Safe Margin Guides"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Active Canvas Crop Window */}
          {activeImageUrl ? (
            <div
              ref={containerRef}
              className={`w-full relative rounded-xl overflow-hidden border-2 border-dashed border-indigo-500/60 shadow-2xl bg-zinc-900 cursor-grab active:cursor-grabbing select-none transition-all duration-300 flex items-center justify-center ${getAspectRatioClasses(
                aspectRatio
              )}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* The Active Image with Transforms */}
              <div
                className="w-full h-full flex items-center justify-center pointer-events-none transition-transform duration-75"
                style={{
                  transform: `translate(${panX}px, ${panY}px) scale(${zoom}) rotate(${rotation}deg) scaleX(${
                    flipH ? -1 : 1
                  })`,
                }}
              >
                <img
                  src={activeImageUrl}
                  alt="Framing preview"
                  className="w-full h-full object-contain pointer-events-none"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Composition Grid Overlay (Rule of Thirds) */}
              {showGrid && (
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none z-10">
                  <div className="border-r border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-b border-white/20" />
                  <div className="border-r border-white/20" />
                  <div className="border-r border-white/20" />
                  <div className="" />
                </div>
              )}

              {/* Safe Zone Overlay */}
              {showSafeZones && (
                <div className="absolute inset-3 border border-indigo-400/40 rounded-lg pointer-events-none z-10 flex flex-col justify-between p-2">
                  <span className="text-[9px] font-mono text-indigo-300/80 uppercase">
                    Safe Margin Area (No Cutoff)
                  </span>
                  <div className="flex justify-between text-[9px] font-mono text-indigo-300/80">
                    <span>10% Margin</span>
                    <span>10% Margin</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-8 space-y-2 text-zinc-400">
              <ImageIcon className="w-8 h-8 mx-auto text-zinc-600" />
              <p className="text-sm font-medium text-zinc-300">No image generated yet</p>
              <p className="text-xs text-zinc-500">Generate a campaign to preview graphics</p>
            </div>
          )}

          {/* Bottom Zoom & Pan Status */}
          <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between text-[10px] text-zinc-400 px-2 font-mono">
            <span>
              Zoom: {Math.round(zoom * 100)}% · Rot: {rotation}° · Flip: {flipH ? "Yes" : "No"}
            </span>
            <span>
              Target: {getAspectDimensions(aspectRatio).width} ×{" "}
              {getAspectDimensions(aspectRatio).height}px
            </span>
          </div>
        </div>

        {/* Right: Fine-Tuning Controls Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
          {/* Aspect Ratio Preset Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                <Crop className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Aspect Ratio Presets</span>
              </label>
              <span className="text-[10px] font-mono text-zinc-400">{aspectRatio}</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "16:9", label: "16:9", sub: "Landscape" },
                { id: "1:1", label: "1:1", sub: "Square" },
                { id: "4:5", label: "4:5", sub: "Portrait" },
                { id: "9:16", label: "9:16", sub: "Story/Reel" },
                { id: "4:3", label: "4:3", sub: "Standard" },
                { id: "original", label: "Original", sub: "Native" },
              ].map((preset) => {
                const isSelected = aspectRatio === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setAspectRatio(preset.id as AspectRatioPreset)}
                    className={`py-2 px-1.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs font-bold"
                        : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <div className="text-xs">{preset.label}</div>
                    <div
                      className={`text-[9px] ${
                        isSelected ? "text-indigo-200" : "text-zinc-400"
                      }`}
                    >
                      {preset.sub}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Zoom & Scale Slider */}
          <div className="space-y-1.5 pt-2 border-t border-zinc-200 dark:border-zinc-700/60">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <ZoomIn className="w-3.5 h-3.5 text-indigo-500" />
                <span>Scale / Zoom</span>
              </span>
              <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                {Math.round(zoom * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.8"
              max="2.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Manual Pan Horizontal & Vertical Sliders */}
          <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-700/60">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-600 dark:text-zinc-400">Pan Horizontal (X)</span>
                <span className="font-mono text-zinc-500">{panX}px</span>
              </div>
              <input
                type="range"
                min="-200"
                max="200"
                step="2"
                value={panX}
                onChange={(e) => setPanX(parseInt(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-600 dark:text-zinc-400">Pan Vertical (Y)</span>
                <span className="font-mono text-zinc-500">{panY}px</span>
              </div>
              <input
                type="range"
                min="-200"
                max="200"
                step="2"
                value={panY}
                onChange={(e) => setPanY(parseInt(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Rotation & Flip Controls */}
          <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-700/60">
            <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
              Transform & Orientation
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5 text-indigo-500" />
                <span>Rotate 90°</span>
              </button>

              <button
                type="button"
                onClick={() => setFlipH((prev) => !prev)}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  flipH
                    ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-600 dark:text-indigo-400"
                    : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                }`}
              >
                <FlipHorizontal className="w-3.5 h-3.5 text-indigo-500" />
                <span>Flip H</span>
              </button>
            </div>
          </div>

          {/* Platform Spec Quick Tip */}
          <div className="p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1">
            <div className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>Recommended Target Specs</span>
            </div>
            <p>
              {selectedPlatform === "linkedin" && "LinkedIn 16:9 Landscape (1280×720) ensures no header cropping."}
              {selectedPlatform === "twitter" && "Twitter 16:9 Card (1200×675) maximizes click-through rate."}
              {selectedPlatform === "instagram" && "Instagram 1:1 (1080×1080) or 4:5 (1080×1350) provides full feed takeover."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
