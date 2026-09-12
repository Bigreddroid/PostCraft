export type Tone =
  | "Professional"
  | "Witty"
  | "Urgent"
  | "Casual"
  | "Inspirational"
  | "Educational";

export type Platform = "linkedin" | "twitter" | "instagram";

export type ContentFormat = "single" | "thread" | "script";

export interface CarouselSlide {
  slideNumber: number;
  title: string;
  body: string;
  visualNote?: string;
}

export interface ScriptScene {
  sceneNumber: number;
  timestamp: string; // e.g. "0:00 - 0:05"
  visualDirection: string; // e.g. "Talking head with fast zoom-in, text pop: '0 SALES CALLS'"
  audioVoiceover: string; // Spoken words for the creator / teleprompter
  onScreenText: string; // Text overlay on screen
}

export interface VideoScript {
  title: string;
  durationEstimate: string; // e.g. "45-60s"
  targetPlatform: string; // e.g. "Reels / TikTok / Shorts"
  hook: string;
  scenes: ScriptScene[];
  callToAction: string;
  wordCount: number;
  teleprompterSpeedWpm?: number;
}

export interface LinkedInPost {
  headline: string;
  content: string;
  imagePrompt: string;
  imageUrl: string | null;
  imageError?: string;
  aspectRatio: string;
  carouselSlides?: CarouselSlide[];
  videoScript?: VideoScript;
}

export interface TwitterPost {
  hook: string;
  tweet: string;
  thread?: string[];
  imagePrompt: string;
  imageUrl: string | null;
  imageError?: string;
  aspectRatio: string;
  videoScript?: VideoScript;
}

export interface InstagramPost {
  caption: string;
  hashtags: string[];
  carouselSlides?: CarouselSlide[];
  videoScript?: VideoScript;
  imagePrompt: string;
  imageUrl: string | null;
  imageError?: string;
  aspectRatio: string;
}

export interface BrandKit {
  enabled: boolean;
  brandName: string;
  brandHandle?: string;
  logoUrl?: string; // base64 or URL
  referenceImageUrl?: string; // base64 or URL for visual reference
  referenceDescription?: string; // Description of aesthetic/mood
  primaryColor?: string; // Hex color code
  visualStyle?: string; // e.g. "Minimalist 3D Studio", "Editorial Photography", etc.
  voiceGuidelines?: string; // e.g. "Authoritative, insightful, visionary founder"
  customHashtags?: string; // e.g. "#NextGen #AI"
}

export interface GenerationResult {
  id: string;
  topic: string;
  tone: Tone;
  contentFormat?: ContentFormat;
  threadLength?: number;
  scriptDuration?: string;
  targetAudience?: string;
  callToAction?: string;
  brandKit?: BrandKit;
  timestamp: number;
  imageResolution?: "512px" | "1K" | "2K";
  videoScript?: VideoScript;
  linkedin: LinkedInPost;
  twitter: TwitterPost;
  instagram: InstagramPost;
}

export interface SubscriptionDetails {
  planId: "pro_monthly" | "pro_annual" | "agency_monthly" | "agency_annual";
  planName: string;
  amount: number;
  billingCycle: "monthly" | "annual";
  invoiceId: string;
  activatedAt: string;
  renewsAt: string;
  paymentMethod: string;
  lastFour?: string;
}

export interface UserQuota {
  countToday: number;
  maxFree: number;
  lastResetDate: string; // YYYY-MM-DD
  isPro: boolean;
  subscription?: SubscriptionDetails;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isPro: boolean;
  provider: "google" | "github" | "email" | "guest";
}

export type AppView = "landing" | "generator" | "login";

export type ImprovementAction =
  | "make_punchier"
  | "stronger_hook"
  | "shorten"
  | "add_emojis"
  | "expand_story";

export type ViewMode = "tabs" | "grid";
