import React, { useState, useRef } from "react";
import {
  X,
  Palette,
  Upload,
  Image as ImageIcon,
  Check,
  Trash2,
  Sparkles,
  HelpCircle,
  Eye,
  Sliders,
  Type,
  AtSign,
  Hash,
  ShieldCheck,
} from "lucide-react";
import { BrandKit } from "../types";

interface BrandKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandKit: BrandKit;
  onSave: (kit: BrandKit) => void;
}

const VISUAL_STYLE_PRESETS = [
  {
    name: "Minimalist 3D Studio",
    desc: "Clean matte 3D geometric forms, soft diffused lighting, neutral studio floor",
  },
  {
    name: "Clean Editorial Photography",
    desc: "Crisp natural daylight, high aesthetic composition, real-world documentary look",
  },
  {
    name: "Modern Tech Vector",
    desc: "Sharp minimalist flat & isometric vector graphics, clean lines, high contrast",
  },
  {
    name: "Dark Tech Atmosphere",
    desc: "Deep obsidian backdrop, subtle neon accents, refined futuristic mood",
  },
  {
    name: "Warm Cinematic Film",
    desc: "Golden hour illumination, soft anamorphic glow, rich cinematic atmosphere",
  },
];

const COLOR_PRESETS = [
  { name: "Electric Indigo", hex: "#4F46E5" },
  { name: "Obsidian Slate", hex: "#0F172A" },
  { name: "Emerald Venture", hex: "#059669" },
  { name: "Sunset Amber", hex: "#D97706" },
  { name: "Cyber Violet", hex: "#8B5CF6" },
  { name: "Crimson Rose", hex: "#E11D48" },
];

const PRESET_LOGOS = [
  {
    name: "Tech Spark",
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='24' fill='%234F46E5'/%3E%3Cpath d='M50 20 L60 40 L80 50 L60 60 L50 80 L40 60 L20 50 L40 40 Z' fill='white'/%3E%3C/svg%3E",
  },
  {
    name: "Modern Cube",
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='24' fill='%23059669'/%3E%3Cpolygon points='50,25 80,42 80,75 50,58' fill='%23ffffff' opacity='0.9'/%3E%3Cpolygon points='50,25 20,42 20,75 50,58' fill='%23ffffff' opacity='0.7'/%3E%3Cpolygon points='50,25 80,42 50,58 20,42' fill='%23ffffff'/%3E%3C/svg%3E",
  },
  {
    name: "Creative Pulse",
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='24' fill='%23D97706'/%3E%3Ccircle cx='50' cy='50' r='25' fill='white'/%3E%3Ccircle cx='50' cy='50' r='14' fill='%23D97706'/%3E%3C/svg%3E",
  },
];

export const BrandKitModal: React.FC<BrandKitModalProps> = ({
  isOpen,
  onClose,
  brandKit,
  onSave,
}) => {
  const [enabled, setEnabled] = useState(brandKit.enabled);
  const [brandName, setBrandName] = useState(brandKit.brandName || "");
  const [brandHandle, setBrandHandle] = useState(brandKit.brandHandle || "");
  const [logoUrl, setLogoUrl] = useState(brandKit.logoUrl || "");
  const [referenceImageUrl, setReferenceImageUrl] = useState(brandKit.referenceImageUrl || "");
  const [referenceDescription, setReferenceDescription] = useState(brandKit.referenceDescription || "");
  const [primaryColor, setPrimaryColor] = useState(brandKit.primaryColor || "#4F46E5");
  const [visualStyle, setVisualStyle] = useState(brandKit.visualStyle || "Minimalist 3D Studio");
  const [voiceGuidelines, setVoiceGuidelines] = useState(brandKit.voiceGuidelines || "");
  const [customHashtags, setCustomHashtags] = useState(brandKit.customHashtags || "");

  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const refImageFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setLogoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRefImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setReferenceImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSave({
      enabled,
      brandName: brandName.trim(),
      brandHandle: brandHandle.trim(),
      logoUrl,
      referenceImageUrl,
      referenceDescription: referenceDescription.trim(),
      primaryColor,
      visualStyle,
      voiceGuidelines: voiceGuidelines.trim(),
      customHashtags: customHashtags.trim(),
    });
    onClose();
  };

  return (
    <div
      id="brand-kit-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="brand-kit-modal"
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Brand Kit & Visual References
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
                  Custom Assets
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Infuse your logo, brand voice, and aesthetic pictures into every generation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Active Switch */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Enable Brand Kit for Generations
              </span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                When enabled, Gemini uses your brand name, handle, voice rules, and visual style
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Section 1: Brand Identity */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-indigo-500" />
              1. Brand Identity & Copy Guidelines
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Brand / Organization Name
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Apex AI or Dr. Maya Lin"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Social Handle / Username
                </label>
                <div className="relative">
                  <AtSign className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={brandHandle}
                    onChange={(e) => setBrandHandle(e.target.value)}
                    placeholder="e.g. apex_ai or in/maya-lin"
                    className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Tone of Voice & Messaging Rules
              </label>
              <textarea
                rows={2}
                value={voiceGuidelines}
                onChange={(e) => setVoiceGuidelines(e.target.value)}
                placeholder="e.g. Authoritative, direct, optimistic. Use crisp bullet points, avoid buzzwords like 'synergy', focus on quantifiable engineering impact."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Preferred Brand Hashtags
              </label>
              <div className="relative">
                <Hash className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={customHashtags}
                  onChange={(e) => setCustomHashtags(e.target.value)}
                  placeholder="e.g. #ApexAI #MachineLearning #FounderJourney"
                  className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Logo & Visual Assets */}
          <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-indigo-500" />
              2. Brand Logo / Avatar
            </h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40">
              {/* Logo Preview */}
              <div className="relative w-16 h-16 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center overflow-hidden bg-white dark:bg-zinc-900 shrink-0">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Brand Logo"
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-zinc-400" />
                )}
              </div>

              {/* Upload & Presets */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={logoFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => logoFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Logo
                  </button>

                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => setLogoUrl("")}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  )}
                </div>

                {/* Instant Sample Logos */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-zinc-400">Or sample presets:</span>
                  {PRESET_LOGOS.map((sample) => (
                    <button
                      key={sample.name}
                      type="button"
                      onClick={() => setLogoUrl(sample.url)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border border-zinc-200 dark:border-zinc-700 hover:border-indigo-400 text-zinc-600 dark:text-zinc-300"
                    >
                      <img src={sample.url} alt={sample.name} className="w-3 h-3 rounded" />
                      {sample.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Reference Picture & Visual Style */}
          <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              3. Visual Style & Aesthetic Reference Picture
            </h3>

            {/* Visual Style Preset Selector */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Target Visual Style Preset
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {VISUAL_STYLE_PRESETS.map((preset) => {
                  const isSelected = visualStyle === preset.name;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setVisualStyle(preset.name)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 shadow-xs"
                          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold mb-0.5">
                        <span>{preset.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                        {preset.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reference Image Upload & Prompt Note */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Aesthetic Moodboard / Reference Picture
                  </span>
                  <p className="text-[11px] text-zinc-500">
                    Upload an image that captures the lighting, mood, or aesthetic you want to replicate
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={refImageFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleRefImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => refImageFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 text-zinc-800 dark:text-zinc-200 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Reference
                  </button>
                  {referenceImageUrl && (
                    <button
                      type="button"
                      onClick={() => setReferenceImageUrl("")}
                      className="p-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {referenceImageUrl && (
                <div className="flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <img
                    src={referenceImageUrl}
                    alt="Style Reference"
                    className="w-16 h-12 rounded object-cover border border-indigo-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      Visual Reference Active
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate">
                      Style guidance extracted into Gemini image generator
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Describe the visual look or lighting (Optional)
                </label>
                <input
                  type="text"
                  value={referenceDescription}
                  onChange={(e) => setReferenceDescription(e.target.value)}
                  placeholder="e.g. Clean Scandinavian workspace, glassmorphism, soft mint and lavender gradient shadows"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Brand Color Theme Palette */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Brand Accent Color
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {COLOR_PRESETS.map((col) => (
                  <button
                    key={col.hex}
                    type="button"
                    onClick={() => setPrimaryColor(col.hex)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      primaryColor === col.hex
                        ? "border-zinc-900 dark:border-white shadow-xs font-bold"
                        : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/10"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.name}</span>
                  </button>
                ))}

                {/* Custom Color Input */}
                <div className="flex items-center gap-1 ml-auto">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-7 h-7 rounded border border-zinc-300 dark:border-zinc-700 cursor-pointer p-0"
                    title="Choose custom color"
                  />
                  <span className="text-xs font-mono text-zinc-500">{primaryColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Save & Apply Brand Kit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
