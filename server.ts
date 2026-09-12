import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Lazy initializer for Gemini client with required User-Agent
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not set in environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Utility for exponential backoff delay with jitter
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function isTransientError(err: any): boolean {
  if (!err) return false;
  const msg = (err.message || String(err)).toLowerCase();
  const status = err.status || err.statusCode || err.code;
  return (
    status === 503 ||
    status === 429 ||
    status === "UNAVAILABLE" ||
    status === "RESOURCE_EXHAUSTED" ||
    msg.includes("high demand") ||
    msg.includes("temporarily unavailable") ||
    msg.includes("503") ||
    msg.includes("429") ||
    msg.includes("overloaded") ||
    msg.includes("fetch failed") ||
    msg.includes("rate limit") ||
    msg.includes("try again later")
  );
}

// Resilient Text Generation with retry and fallback models
const TEXT_MODELS = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];

async function generateTextWithRetry(params: {
  contents: string | any;
  systemInstruction?: string;
  responseSchema?: any;
  responseMimeType?: string;
}): Promise<any> {
  const ai = getAi();
  let lastError: any = null;

  for (const model of TEXT_MODELS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: {
            systemInstruction: params.systemInstruction,
            responseMimeType: params.responseMimeType || "application/json",
            responseSchema: params.responseSchema,
          },
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const transient = isTransientError(err);
        console.warn(
          `[Gemini API] Attempt ${attempt}/3 for model ${model} failed: ${err.message || err}. Transient: ${transient}`
        );

        if (transient && attempt < 3) {
          const backoff = 800 * Math.pow(2, attempt - 1) + Math.random() * 400;
          await sleep(backoff);
          continue;
        }
        break;
      }
    }
  }

  throw lastError || new Error("All AI models are temporarily busy. Please try again in a few moments.");
}

// Generate image helper using gemini-3.1-flash-image with retry and fallback
const IMAGE_MODELS = ["gemini-3.1-flash-image", "gemini-3.1-flash-lite-image"];

async function generateSingleImage(
  prompt: string,
  aspectRatio: "1:1" | "16:9" | "4:3" | "3:4" | "9:16" = "16:9",
  imageSize: "512px" | "1K" | "2K" | "4K" = "1K"
): Promise<{ imageUrl: string | null; error?: string }> {
  const ai = getAi();
  let lastError: any = null;

  for (const model of IMAGE_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: {
            parts: [
              {
                text: `High quality, clean, professional social media visual: ${prompt}. Professional photography or modern minimalist 3D editorial design, high aesthetic, vivid colors, crisp lighting, no watermarks, no distorted text.`,
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio: aspectRatio,
              imageSize: imageSize,
            },
          },
        });

        const parts = response.candidates?.[0]?.content?.parts;
        if (parts) {
          for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
              const mime = part.inlineData.mimeType || "image/png";
              return {
                imageUrl: `data:${mime};base64,${part.inlineData.data}`,
              };
            }
          }
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Image Gen] Model ${model} attempt ${attempt} failed:`, err?.message || err);
        if (isTransientError(err) && attempt < 2) {
          await sleep(1000 + Math.random() * 500);
          continue;
        }
        break;
      }
    }
  }

  console.error(`Image generation failed for prompt "${prompt}":`, lastError?.message || lastError);
  return {
    imageUrl: null,
    error: isTransientError(lastError)
      ? "Image generator is temporarily experiencing high traffic. Click 'Retry image creation' to regenerate."
      : lastError?.message || "Image generation failed",
  };
}

// API: Generate All Posts and Images simultaneously
app.post("/api/generate-all", async (req, res) => {
  try {
    const {
      topic,
      tone = "Professional",
      contentFormat = "single",
      threadLength = 5,
      targetAudience,
      callToAction,
      imageResolution = "1K",
      brandKit,
    } = req.body;

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      res.status(400).json({ error: "Topic/idea is required" });
      return;
    }

    // 1. Generate Structured Text Content for 3 platforms
    const audiencePrompt = targetAudience ? `Target Audience: ${targetAudience}` : "";
    const ctaPrompt = callToAction ? `Desired Call-to-Action: ${callToAction}` : "";
    const brandPrompt = brandKit?.enabled
      ? `Brand Guidelines:
- Brand Name: "${brandKit.brandName}"
${brandKit.brandHandle ? `- Social Handle: "${brandKit.brandHandle}"` : ""}
${brandKit.voiceGuidelines ? `- Tone/Voice Rules: "${brandKit.voiceGuidelines}"` : ""}
${brandKit.customHashtags ? `- Brand Hashtags to include: "${brandKit.customHashtags}"` : ""}`
      : "";

    const brandVisualPrompt = brandKit?.enabled
      ? `Visual aesthetic & reference: ${brandKit.visualStyle ? `Style: ${brandKit.visualStyle}.` : ""} ${brandKit.primaryColor ? `Primary brand color accent: ${brandKit.primaryColor}.` : ""} ${brandKit.referenceDescription ? `Mood reference: ${brandKit.referenceDescription}.` : ""}`
      : "";

    const countThreads = Math.min(Math.max(Number(threadLength) || 5, 3), 7);

    const systemPrompt = `You are PostCraft AI, an elite social media strategist, viral copywriting expert, and visual art director.
Given a user's topic, chosen tone (${tone}), ${audiencePrompt}, ${ctaPrompt}, and ${brandPrompt}, generate 3 distinct, masterfully crafted posts simultaneously tailored for each specific platform. Ensure seamless brand consistency across all pieces with zero spelling mistakes, zero character overflows, and impeccable pacing:

1. LINKEDIN POST:
- Headline: High-impact, scroll-stopping executive hook line.
- Content: Long-form storytelling style (strictly 180 to 280 words) with clean spaced paragraphs, actionable takeaways, and a compelling closing question.
- CarouselSlides: An array of ${countThreads} slide breakdowns for an executive carousel PDF (Slide 1: High-contrast cover headline, Slides 2-${countThreads - 1}: Core frameworks/insights with metric highlights, Slide ${countThreads}: Actionable summary & CTA).
- Visual Prompt Style: Premium 16:9 executive presentation cover banner with bold attention-grabbing display headline typography, high-contrast dark navy & slate corporate styling, modern 3D tech icons or metric charts, and verified thought-leadership branding.

2. TWITTER / X POST:
- Hook: The single opening scroll-stopping hook line with intense curiosity or contrarian framing.
- Tweet: Single standalone tweet strictly under 260 characters including 1-2 hashtags.
- Thread: A high-value connected multi-tweet thread of exactly ${countThreads} tweets (e.g., Tweet 1: Hook [1/${countThreads}], Tweets 2 to ${countThreads - 1}: Framework breakdown [2/${countThreads}], Tweet ${countThreads}: Summary + CTA [${countThreads}/${countThreads}]).
  * CRITICAL: Every single tweet in the thread array MUST be strictly under 260 characters. No cutoffs, no incomplete sentences, zero fluff.
- Visual Prompt Style: 16:9 high-impact viral cover banner & roadmap infographic. Includes a bold attention-grabbing headline, verified creator badge watermark (@postcraft), high-contrast carbon dark mode background with vibrant cyan/violet accents, and clean numbered milestone cards.

3. INSTAGRAM POST:
- Caption: Highly engaging, visual and emotional caption with clean spacing and conversational flow.
- Hashtags: 10 to 15 highly relevant, high-traffic hashtags (without '#' in the array items).
- CarouselSlides: An array of ${countThreads} swipe carousel cards (Slide 1: Viral hook cover with attention-grabbing title, Slides 2-${countThreads - 1}: Actionable steps with visual highlights, Slide ${countThreads}: Save & Share CTA).
- Visual Prompt Style: Breathtaking, award-winning 1:1 square editorial visual art and commercial studio photography. Cinematic volumetric lighting, ultra-rich textural depth, vivid gradient glows, modern 3D abstract shapes or photorealistic subject matter, captivating focal point, no flat text-only look.

4. VIRAL VIDEO & REEL SCRIPT (For TikTok / Reels / YouTube Shorts / Video Posts):
- title: Punchy episode title.
- durationEstimate: Estimated runtime (e.g. "45-60s").
- targetPlatform: "TikTok / Reels / Shorts".
- hook: The first 3-second spoken & visual hook that stops users mid-scroll.
- scenes: 4 to 5 sequential scenes, each with:
  * sceneNumber (1, 2, 3, 4, 5)
  * timestamp (e.g. "0:00 - 0:05", "0:05 - 0:18", etc.)
  * visualDirection (precise camera angle, b-roll, motion graphic, or gesture direction)
  * audioVoiceover (exact spoken words for the creator or teleprompter)
  * onScreenText (bold text overlay on screen for silent viewers)
- callToAction: Clear closing CTA (e.g., "Follow @handle for more daily breakdowns").
- wordCount: Total spoken word count (approx 100-140 words for 45-60s).
- teleprompterSpeedWpm: 140.`;

    const userPrompt = `Topic/Idea: "${topic.trim()}"
Tone: ${tone}
Requested Format: ${contentFormat === "script" ? "Video / Reel Script Focus" : contentFormat === "thread" ? "Multi-tweet Thread / Multi-slide Carousel Focus" : "Standard Multi-Channel"}
Thread/Slide Count: ${countThreads}
${audiencePrompt}
${ctaPrompt}
${brandPrompt}`;

    const textResponse = await generateTextWithRetry({
      contents: userPrompt,
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          linkedin: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING, description: "Attention-grabbing headline/hook for LinkedIn" },
              content: { type: Type.STRING, description: "Full LinkedIn post body in storytelling format (180-280 words)" },
              carouselSlides: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    slideNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    body: { type: Type.STRING },
                    visualNote: { type: Type.STRING },
                  },
                  required: ["slideNumber", "title", "body"],
                },
              },
              imagePrompt: { type: Type.STRING, description: "Descriptive visual prompt for LinkedIn landscape image" },
            },
            required: ["headline", "content", "imagePrompt"],
          },
          twitter: {
            type: Type.OBJECT,
            properties: {
              hook: { type: Type.STRING, description: "The single opening hook line" },
              tweet: { type: Type.STRING, description: "Complete standalone tweet under 260 characters with 1-2 hashtags" },
              thread: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: `Connected thread of ${countThreads} tweets, each strictly <= 260 chars and formatted with [1/${countThreads}]`,
              },
              imagePrompt: { type: Type.STRING, description: "Descriptive visual prompt for Twitter landscape image" },
            },
            required: ["hook", "tweet", "imagePrompt"],
          },
          instagram: {
            type: Type.OBJECT,
            properties: {
              caption: { type: Type.STRING, description: "Engaging emotional visual caption formatted with clean line breaks" },
              hashtags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "10 to 15 relevant hashtags without the # symbol",
              },
              carouselSlides: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    slideNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    body: { type: Type.STRING },
                    visualNote: { type: Type.STRING },
                  },
                  required: ["slideNumber", "title", "body"],
                },
              },
              imagePrompt: { type: Type.STRING, description: "Descriptive visual prompt for Instagram 1:1 square image" },
            },
            required: ["caption", "hashtags", "imagePrompt"],
          },
          videoScript: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              durationEstimate: { type: Type.STRING },
              targetPlatform: { type: Type.STRING },
              hook: { type: Type.STRING },
              scenes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    sceneNumber: { type: Type.INTEGER },
                    timestamp: { type: Type.STRING },
                    visualDirection: { type: Type.STRING },
                    audioVoiceover: { type: Type.STRING },
                    onScreenText: { type: Type.STRING },
                  },
                  required: ["sceneNumber", "timestamp", "visualDirection", "audioVoiceover", "onScreenText"],
                },
              },
              callToAction: { type: Type.STRING },
              wordCount: { type: Type.INTEGER },
              teleprompterSpeedWpm: { type: Type.INTEGER },
            },
            required: ["title", "durationEstimate", "hook", "scenes", "callToAction"],
          },
        },
        required: ["linkedin", "twitter", "instagram"],
      },
    });

    const parsedText = JSON.parse(textResponse.text || "{}");

    // 2. Generate Images in parallel for all 3 platforms with safe margins and distinctive aesthetics
    const size = (imageResolution as "512px" | "1K" | "2K") || "1K";

    const linkedinPrompt = `Executive thought leadership presentation cover for: "${topic}". Headline: "${parsedText.linkedin?.headline || topic}". 16:9 widescreen layout, centered composition with generous safe padding margins, dark navy and corporate sapphire lighting, sharp high-contrast vector diagrams, authoritative executive atmosphere. ${brandVisualPrompt}`;
    const twitterPrompt = `Viral thread cover banner & infographic for: "${topic}". Hook: "${parsedText.twitter?.hook || topic}". 16:9 widescreen high-contrast dark mode card, bold attention-grabbing headline banner, numbered roadmap milestones, verified creator branding badge, electric carbon and cyan lighting, sharp graphic design with generous margin padding. ${brandVisualPrompt}`;
    const instaPrompt = `Award-winning aesthetic editorial visual art and commercial studio photography: "${parsedText.instagram?.imagePrompt || `${topic} cinematic visual concept`}". 1:1 square aspect ratio, stunning dramatic volumetric lighting, rich vibrant color palette, ultra-high textural detail, modern 3D depth and cinematic composition, visually captivating hero imagery with zero flat text look. ${brandVisualPrompt}`;

    const [linkedinImg, twitterImg, instaImg] = await Promise.all([
      generateSingleImage(linkedinPrompt, "16:9", size),
      generateSingleImage(twitterPrompt, "16:9", size),
      generateSingleImage(instaPrompt, "1:1", size),
    ]);

    const result = {
      id: "gen_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      topic,
      tone,
      contentFormat: contentFormat || "single",
      threadLength: countThreads,
      targetAudience: targetAudience || undefined,
      callToAction: callToAction || undefined,
      brandKit: brandKit || undefined,
      timestamp: Date.now(),
      imageResolution: size,
      videoScript: parsedText.videoScript || {
        title: topic,
        durationEstimate: "45-60s",
        targetPlatform: "TikTok / Reels / Shorts",
        hook: `Stop scrolling if you want to master ${topic}.`,
        scenes: [
          {
            sceneNumber: 1,
            timestamp: "0:00 - 0:05",
            visualDirection: "Talking head direct-to-camera with fast zoom-in",
            audioVoiceover: `Here is the exact breakdown of how to handle ${topic}.`,
            onScreenText: "Must Watch ⚡️",
          },
          {
            sceneNumber: 2,
            timestamp: "0:05 - 0:20",
            visualDirection: "Cut to screen demo or clean visual illustration",
            audioVoiceover: "Step 1: Simplify the entire process and focus on single-utility leverage.",
            onScreenText: "Step 1: Focus 🎯",
          },
          {
            sceneNumber: 3,
            timestamp: "0:20 - 0:40",
            visualDirection: "Fast b-roll with bullet point animations",
            audioVoiceover: "Step 2: Automate your distribution so you never create in isolation.",
            onScreenText: "Step 2: Automate 🚀",
          },
          {
            sceneNumber: 4,
            timestamp: "0:40 - 0:50",
            visualDirection: "Back to creator with high energy",
            audioVoiceover: "Save this video and follow for more daily breakdowns.",
            onScreenText: "Save for Later 💾",
          },
        ],
        callToAction: "Follow for more daily playbooks!",
        wordCount: 110,
        teleprompterSpeedWpm: 140,
      },
      linkedin: {
        headline: parsedText.linkedin?.headline || "Key Perspective",
        content: parsedText.linkedin?.content || "",
        carouselSlides: parsedText.linkedin?.carouselSlides || [],
        videoScript: parsedText.videoScript,
        imagePrompt: parsedText.linkedin?.imagePrompt || "",
        imageUrl: linkedinImg.imageUrl,
        imageError: linkedinImg.error,
        aspectRatio: "16:9 (1200x627)",
      },
      twitter: {
        hook: parsedText.twitter?.hook || "",
        tweet: parsedText.twitter?.tweet || "",
        thread: parsedText.twitter?.thread || [
          parsedText.twitter?.tweet || "",
          `Here is why this matters: Break down key step 1. [2/${countThreads}]`,
          `Key takeaway: Implement consistently for maximum impact. [3/${countThreads}]`,
        ],
        videoScript: parsedText.videoScript,
        imagePrompt: parsedText.twitter?.imagePrompt || "",
        imageUrl: twitterImg.imageUrl,
        imageError: twitterImg.error,
        aspectRatio: "16:9 (1600x900)",
      },
      instagram: {
        caption: parsedText.instagram?.caption || "",
        hashtags: parsedText.instagram?.hashtags || [],
        carouselSlides: parsedText.instagram?.carouselSlides || [],
        videoScript: parsedText.videoScript,
        imagePrompt: parsedText.instagram?.imagePrompt || "",
        imageUrl: instaImg.imageUrl,
        imageError: instaImg.error,
        aspectRatio: "1:1 (1080x1080)",
      },
    };

    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/generate-all:", error);
    const isBusy = isTransientError(error);
    res.status(isBusy ? 503 : 500).json({
      error: isBusy
        ? "AI model is currently experiencing high demand. Please try again."
        : error.message || "Failed to generate social media content",
    });
  }
});

// API: Regenerate single platform (Text or Image or Both)
app.post("/api/regenerate-platform", async (req, res) => {
  try {
    const {
      platform,
      topic,
      tone = "Professional",
      targetAudience,
      callToAction,
      type = "both",
      customPrompt,
      imageResolution = "1K",
    } = req.body;

    if (!platform || !["linkedin", "twitter", "instagram"].includes(platform)) {
      res.status(400).json({ error: "Valid platform (linkedin, twitter, instagram) is required" });
      return;
    }

    const ai = getAi();
    let textData: any = null;
    let imgData: any = null;

    const size = (imageResolution as "512px" | "1K" | "2K") || "1K";
    const audienceText = targetAudience ? `Target audience: ${targetAudience}.` : "";
    const ctaText = callToAction ? `Call to action: ${callToAction}.` : "";

    if (type === "text" || type === "both") {
      if (platform === "linkedin") {
        const resp = await generateTextWithRetry({
          contents: `Regenerate a brand-new, fresh LinkedIn post and 5-slide carousel breakdown for topic "${topic}". Tone: ${tone}. ${audienceText} ${ctaText} Follow long-form storytelling format (180-280 words), strong hook, spaced paragraphs, actionable lessons, and closing discussion prompt. Include carouselSlides array for executive slides.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              content: { type: Type.STRING },
              carouselSlides: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    slideNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    body: { type: Type.STRING },
                    visualNote: { type: Type.STRING },
                  },
                  required: ["slideNumber", "title", "body"],
                },
              },
              imagePrompt: { type: Type.STRING },
            },
            required: ["headline", "content", "imagePrompt"],
          },
        });
        textData = JSON.parse(resp.text || "{}");
      } else if (platform === "twitter") {
        const resp = await generateTextWithRetry({
          contents: `Regenerate a brand-new, viral Twitter/X tweet and 5-tweet connected thread for topic "${topic}". Tone: ${tone}. ${audienceText} ${ctaText} Standalone tweet must be under 260 chars. Thread tweets must each be strictly <= 260 chars, numbered [1/5] to [5/5] with no cutoffs or typos.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hook: { type: Type.STRING },
              tweet: { type: Type.STRING },
              thread: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              imagePrompt: { type: Type.STRING },
            },
            required: ["hook", "tweet", "imagePrompt"],
          },
        });
        textData = JSON.parse(resp.text || "{}");
      } else if (platform === "instagram") {
        const resp = await generateTextWithRetry({
          contents: `Regenerate a brand-new, highly engaging Instagram caption and 5-slide carousel breakdown for topic "${topic}". Tone: ${tone}. ${audienceText} ${ctaText} Include visual & emotional body with clean line breaks, 10-15 relevant hashtags, and carouselSlides array.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              caption: { type: Type.STRING },
              hashtags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              carouselSlides: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    slideNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    body: { type: Type.STRING },
                    visualNote: { type: Type.STRING },
                  },
                  required: ["slideNumber", "title", "body"],
                },
              },
              imagePrompt: { type: Type.STRING },
            },
            required: ["caption", "hashtags", "imagePrompt"],
          },
        });
        textData = JSON.parse(resp.text || "{}");
      }
    }

    if (type === "image" || type === "both") {
      let promptToUse = customPrompt || textData?.imagePrompt || `${topic} aesthetic social media graphic`;
      if (platform === "linkedin") {
        promptToUse = `Executive thought leadership presentation cover for: "${topic}". 16:9 widescreen layout, centered composition, dark navy & sapphire corporate lighting, sharp high-contrast vector diagrams, authoritative executive atmosphere. ${promptToUse}`;
      } else if (platform === "twitter") {
        promptToUse = `Viral thread cover banner & infographic for: "${topic}". 16:9 widescreen high-contrast dark mode card, bold attention-grabbing headline banner, verified creator branding, electric carbon and cyan lighting. ${promptToUse}`;
      } else if (platform === "instagram") {
        promptToUse = `Award-winning aesthetic editorial visual art and commercial studio photography: "${promptToUse}". 1:1 square aspect ratio, stunning dramatic volumetric lighting, rich vibrant color palette, ultra-high textural detail, modern 3D depth, visually captivating hero imagery with zero flat text look.`;
      }
      const ratio = platform === "instagram" ? "1:1" : "16:9";
      imgData = await generateSingleImage(promptToUse, ratio, size);
    }

    res.json({
      platform,
      textData,
      imgData,
    });
  } catch (error: any) {
    console.error("Error in /api/regenerate-platform:", error);
    const isBusy = isTransientError(error);
    res.status(isBusy ? 503 : 500).json({
      error: isBusy
        ? "AI model is currently experiencing high demand. Please try again in a moment."
        : error.message || "Failed to regenerate platform content",
    });
  }
});

// API: Improve / Refine a specific post
app.post("/api/improve-post", async (req, res) => {
  try {
    const { platform, currentContent, currentHeadline, action, customInstruction, topic, tone } = req.body;

    if (!platform || !currentContent) {
      res.status(400).json({ error: "Platform and current content are required" });
      return;
    }

    let instructionDesc = "";
    switch (action) {
      case "make_punchier":
        instructionDesc = "Make the copy more punchy, direct, and high-impact. Cut fluff and emphasize compelling phrases.";
        break;
      case "stronger_hook":
        instructionDesc = "Rewrite and strengthen the opening hook to be 10x more captivating and scroll-stopping.";
        break;
      case "shorten":
        instructionDesc = "Condense and tighten the post while preserving the core insight and energy.";
        break;
      case "add_emojis":
        instructionDesc = "Tastefully add relevant, stylish emojis to structure key points and improve visual flow.";
        break;
      case "expand_story":
        instructionDesc = "Expand the narrative with vivid storytelling, emotional depth, and practical lessons.";
        break;
      default:
        instructionDesc = customInstruction || "Polish, refine, and improve this social media post for maximum engagement.";
    }

    const prompt = `You are an expert social media copy doctor.
Platform: ${platform.toUpperCase()}
Topic: "${topic || ""}"
Current Tone: ${tone || "Professional"}
Improvement goal: ${instructionDesc}

Original text:
${currentHeadline ? `Headline: ${currentHeadline}\n\n` : ""}${currentContent}

Constraints:
${platform === "twitter" ? "- Strictly under 260 characters including 1-2 hashtags." : ""}
${platform === "linkedin" ? "- Storytelling format (180-280 words) with clean paragraph spacing." : ""}
${platform === "instagram" ? "- Engaging visual caption with 10-15 relevant hashtags." : ""}

Return clean JSON matching the schema.`;

    if (platform === "linkedin") {
      const resp = await generateTextWithRetry({
        contents: prompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            content: { type: Type.STRING },
          },
          required: ["headline", "content"],
        },
      });
      res.json({ platform, data: JSON.parse(resp.text || "{}") });
    } else if (platform === "twitter") {
      const resp = await generateTextWithRetry({
        contents: prompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hook: { type: Type.STRING },
            tweet: { type: Type.STRING },
          },
          required: ["hook", "tweet"],
        },
      });
      res.json({ platform, data: JSON.parse(resp.text || "{}") });
    } else {
      const resp = await generateTextWithRetry({
        contents: prompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caption: { type: Type.STRING },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["caption", "hashtags"],
        },
      });
      res.json({ platform, data: JSON.parse(resp.text || "{}") });
    }
  } catch (error: any) {
    console.error("Error in /api/improve-post:", error);
    const isBusy = isTransientError(error);
    res.status(isBusy ? 503 : 500).json({
      error: isBusy
        ? "AI model is currently experiencing high demand. Please try again in a moment."
        : error.message || "Failed to improve post",
    });
  }
});

// API: Custom image generator
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt, aspectRatio = "1:1", imageSize = "1K" } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }
    const result = await generateSingleImage(prompt, aspectRatio, imageSize);
    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/generate-image:", error);
    res.status(500).json({ error: error.message || "Failed to generate image" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "PostCraft AI" });
});

// Vite Middleware for development & static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PostCraft AI server running on http://localhost:${PORT}`);
  });
}

// Only start the standalone listener if not running in a Vercel serverless environment
if (process.env.VERCEL !== "1") {
  startServer();
}

export default app;
