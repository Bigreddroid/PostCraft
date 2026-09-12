import { GenerationResult, UserQuota, UserProfile, BrandKit } from "../types";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const HISTORY_KEY = "postcraft_ai_history";
const QUOTA_KEY = "postcraft_ai_quota";
const THEME_KEY = "postcraft_ai_theme";
const USER_KEY = "postcraft_ai_user";
const BRAND_KIT_KEY = "postcraft_ai_brandkit";

const MAX_HISTORY_ITEMS = 10;

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function getStoredHistory(): GenerationResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_HISTORY_ITEMS) : [];
  } catch (e) {
    console.error("Failed to load history:", e);
    return [];
  }
}

export function saveGenerationToHistory(result: GenerationResult): GenerationResult[] {
  try {
    const current = getStoredHistory();
    // Filter out if existing id already there, then prepend and save last 10
    const updated = [result, ...current.filter((item) => item.id !== result.id)].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to save history:", e);
    return [];
  }
}

export function deleteHistoryItem(id: string): GenerationResult[] {
  try {
    const current = getStoredHistory();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to delete history item:", e);
    return [];
  }
}

export function clearAllHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error("Failed to clear history:", e);
  }
}

export function getStoredBrandKit(): BrandKit {
  try {
    const raw = localStorage.getItem(BRAND_KIT_KEY);
    if (!raw) {
      return {
        enabled: false,
        brandName: "",
        brandHandle: "",
        logoUrl: "",
        referenceImageUrl: "",
        referenceDescription: "",
        primaryColor: "#4F46E5",
        visualStyle: "Minimalist 3D Studio",
        voiceGuidelines: "",
        customHashtags: "",
      };
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load brand kit:", e);
    return {
      enabled: false,
      brandName: "",
      brandHandle: "",
      logoUrl: "",
      referenceImageUrl: "",
      referenceDescription: "",
      primaryColor: "#4F46E5",
      visualStyle: "Minimalist 3D Studio",
      voiceGuidelines: "",
      customHashtags: "",
    };
  }
}

export function saveStoredBrandKit(brandKit: BrandKit): void {
  try {
    localStorage.setItem(BRAND_KIT_KEY, JSON.stringify(brandKit));
  } catch (e) {
    console.error("Failed to save brand kit:", e);
  }
}

export function getUserQuota(): UserQuota {
  const today = getTodayString();
  const defaultQuota: UserQuota = {
    countToday: 0,
    maxFree: 5,
    lastResetDate: today,
    isPro: false,
  };

  try {
    const raw = localStorage.getItem(QUOTA_KEY);
    if (!raw) {
      localStorage.setItem(QUOTA_KEY, JSON.stringify(defaultQuota));
      return defaultQuota;
    }
    const parsed: UserQuota = JSON.parse(raw);
    // Reset if it's a new day
    if (parsed.lastResetDate !== today) {
      const refreshed: UserQuota = {
        ...parsed,
        countToday: 0,
        lastResetDate: today,
      };
      localStorage.setItem(QUOTA_KEY, JSON.stringify(refreshed));
      return refreshed;
    }
    return parsed;
  } catch (e) {
    return defaultQuota;
  }
}

export function incrementUserQuota(): UserQuota {
  const current = getUserQuota();
  const updated: UserQuota = {
    ...current,
    countToday: current.countToday + 1,
  };
  try {
    localStorage.setItem(QUOTA_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to update quota:", e);
  }
  return updated;
}

export function setProStatus(isPro: boolean, subscription?: import("../types").SubscriptionDetails): UserQuota {
  const current = getUserQuota();
  const updated: UserQuota = {
    ...current,
    isPro,
    subscription: isPro ? (subscription || current.subscription) : undefined,
  };
  try {
    localStorage.setItem(QUOTA_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to update pro status:", e);
  }
  return updated;
}

export function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: UserProfile | null): void {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (e) {
    console.error("Failed to save user:", e);
  }
}

export function getStoredTheme(): "dark" | "light" {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "dark";
  }
}

export function setStoredTheme(theme: "dark" | "light"): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    console.error("Failed to save theme:", e);
  }
}

export function downloadBase64Image(dataUrl: string, filename: string): void {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Export All 3 Posts + Images into a single downloadable ZIP
export async function exportResultAsZip(result: GenerationResult): Promise<void> {
  const zip = new JSZip();
  const folderName = `postcraft-${result.topic.slice(0, 25).replace(/[^a-zA-Z0-9]/g, "_")}-${Date.now()}`;
  const folder = zip.folder(folderName) || zip;

  // 1. Text Files
  const linkedinText = `=== LINKEDIN POST ===
Headline: ${result.linkedin.headline}

${result.linkedin.content}

Image Prompt: ${result.linkedin.imagePrompt}
`;

  const twitterText = `=== TWITTER / X POST ===
Hook: ${result.twitter.hook}

${result.twitter.tweet}

Image Prompt: ${result.twitter.imagePrompt}
`;

  const instagramText = `=== INSTAGRAM POST ===
${result.instagram.caption}

Hashtags:
${result.instagram.hashtags?.map((t) => (t.startsWith("#") ? t : `#${t}`)).join(" ")}

Image Prompt: ${result.instagram.imagePrompt}
`;

  const allInOne = `=========================================
POSTCRAFT AI - OMNICHANNEL EXPORT
Topic: ${result.topic}
Tone: ${result.tone}
Generated at: ${new Date(result.timestamp).toLocaleString()}
=========================================

${linkedinText}

-----------------------------------------

${twitterText}

-----------------------------------------

${instagramText}
`;

  folder.file("ALL_POSTS_SUMMARY.txt", allInOne);
  folder.file("linkedin_post.txt", linkedinText);
  folder.file("twitter_post.txt", twitterText);
  folder.file("instagram_post.txt", instagramText);

  if (result.videoScript) {
    const scriptMd = `# 🎬 VIDEO & REEL SCRIPT: ${result.videoScript.title || result.topic}
⏱ Duration: ${result.videoScript.durationEstimate} | 📱 Platform: ${result.videoScript.targetPlatform} | 🗣 Words: ${result.videoScript.wordCount || 120}

## 🪝 0-3s SCROLL-STOPPING HOOK:
${result.videoScript.hook}

## 🎥 SCENE-BY-SCENE STORYBOARD:
${result.videoScript.scenes
  .map(
    (s) => `### Scene ${s.sceneNumber} (${s.timestamp})
- 👁 Visual Direction: ${s.visualDirection}
- 🎙 Spoken Voiceover: "${s.audioVoiceover}"
- 🔤 On-Screen Text: [${s.onScreenText}]`
  )
  .join("\n\n")}

## 📢 CALL TO ACTION:
${result.videoScript.callToAction}
`;
    folder.file("video_reel_script.md", scriptMd);
  }

  if (result.brandKit?.enabled) {
    const brandText = `=== BRAND KIT REFERENCE ===
Brand Name: ${result.brandKit.brandName}
Handle: ${result.brandKit.brandHandle || "N/A"}
Visual Style: ${result.brandKit.visualStyle || "N/A"}
Primary Color: ${result.brandKit.primaryColor || "N/A"}
Voice Guidelines: ${result.brandKit.voiceGuidelines || "N/A"}
Hashtags: ${result.brandKit.customHashtags || "N/A"}
Reference Notes: ${result.brandKit.referenceDescription || "N/A"}
`;
    folder.file("BRAND_KIT.txt", brandText);
  }

  // 2. Images (Base64 data extraction)
  const imagesFolder = folder.folder("images");
  if (imagesFolder) {
    if (result.brandKit?.logoUrl?.includes("base64,")) {
      const base64Data = result.brandKit.logoUrl.split("base64,")[1];
      imagesFolder.file("brand_logo.png", base64Data, { base64: true });
    }
    if (result.brandKit?.referenceImageUrl?.includes("base64,")) {
      const base64Data = result.brandKit.referenceImageUrl.split("base64,")[1];
      imagesFolder.file("reference_mood_image.png", base64Data, { base64: true });
    }
    if (result.linkedin.imageUrl?.includes("base64,")) {
      const base64Data = result.linkedin.imageUrl.split("base64,")[1];
      imagesFolder.file("linkedin_1200x627.png", base64Data, { base64: true });
    }
    if (result.twitter.imageUrl?.includes("base64,")) {
      const base64Data = result.twitter.imageUrl.split("base64,")[1];
      imagesFolder.file("twitter_1600x900.png", base64Data, { base64: true });
    }
    if (result.instagram.imageUrl?.includes("base64,")) {
      const base64Data = result.instagram.imageUrl.split("base64,")[1];
      imagesFolder.file("instagram_1080x1080.png", base64Data, { base64: true });
    }
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${folderName}.zip`);
}
