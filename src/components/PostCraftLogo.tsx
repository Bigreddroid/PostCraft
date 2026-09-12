import React from "react";

interface PostCraftLogoProps {
  variant?: "full" | "horizontal" | "mark-only";
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
}

export const PostCraftLogo: React.FC<PostCraftLogoProps> = ({
  variant = "horizontal",
  size = "md",
  showTagline = false,
  className = "",
}) => {
  // Dimension mappings
  const markDimensions = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
    xl: "w-20 h-20",
  }[size];

  const titleSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-4xl",
  }[size];

  const taglineSizes = {
    sm: "text-[9px] tracking-[0.2em]",
    md: "text-[10px] tracking-[0.22em]",
    lg: "text-xs tracking-[0.25em]",
    xl: "text-sm tracking-[0.28em]",
  }[size];

  // SVG Mark component with ribbon, sparkles, and radiant bursts
  const LogoMark = (
    <div
      className={`relative shrink-0 rounded-2xl flex items-center justify-center p-0.5 shadow-md shadow-indigo-500/20 ${markDimensions} bg-gradient-to-br from-zinc-900 via-zinc-950 to-indigo-950/90 border border-indigo-500/30`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-sm overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="pRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="35%" stopColor="#3b82f6" />
            <stop offset="70%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <linearGradient id="pStem" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6b21a8" />
            <stop offset="50%" stopColor="#4c1d95" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          <linearGradient id="pGloss" x1="30%" y1="0%" x2="70%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Stem of P with 3D Fold */}
        <path
          d="M 23 44 C 23 37 28 33 35 35 L 45 38 C 49 39 52 43 51 47 L 47 74 C 46 78 42 81 37 81 L 31 81 C 26 81 23 77 23 72 Z"
          fill="url(#pStem)"
        />

        {/* Fold ribbon loop */}
        <path
          d="M 25 31 C 28 16 43 7 60 7 C 76 7 88 17 88 34 C 88 51 73 63 54 65 L 39 67 C 45 63 54 59 64 53 C 74 47 81 38 79 29 C 77 19 66 14 54 15 C 40 16 29 23 25 31 Z"
          fill="url(#pRibbon)"
        />

        {/* Gloss highlight edge */}
        <path
          d="M 27 28 C 34 16 48 10 62 10 C 75 10 84 17 84 28 C 81 21 72 17 60 17 C 45 17 33 22 27 28 Z"
          fill="url(#pGloss)"
        />

        {/* 4-point Sparkle star on lower fold */}
        <g transform="translate(37, 57)">
          <path
            d="M 0 -8 C 0.3 -2 2 -0.3 8 0 C 2 0.3 0.3 2 0 8 C -0.3 2 -2 0.3 -8 0 C -2 -0.3 -0.3 -2 0 -8 Z"
            fill="#ffffff"
          />
          <circle cx="0" cy="0" r="1.5" fill="#c7d2fe" />
        </g>

        {/* 3 Radiant Light Accent Rays */}
        <g stroke="#7dd3fc" strokeWidth="3" strokeLinecap="round">
          <line x1="90" y1="18" x2="97" y2="13" />
          <line x1="93" y1="28" x2="101" y2="28" />
          <line x1="90" y1="38" x2="97" y2="43" />
        </g>
      </svg>
    </div>
  );

  if (variant === "mark-only") {
    return <div className={`inline-flex items-center ${className}`}>{LogoMark}</div>;
  }

  if (variant === "full") {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {LogoMark}
        <div className="mt-3">
          <div className={`font-extrabold ${titleSizes} tracking-tight leading-none`}>
            <span className="text-zinc-900 dark:text-white">PostCraft </span>
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-400 bg-clip-text text-transparent">
              AI
            </span>
          </div>
          {(showTagline || true) && (
            <p className={`font-bold ${taglineSizes} text-zinc-500 dark:text-zinc-400 uppercase mt-1.5`}>
              IDEAS TO IMPACT EVERYWHERE
            </p>
          )}
        </div>
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {LogoMark}
      <div className="flex flex-col">
        <div className={`font-extrabold ${titleSizes} tracking-tight leading-tight`}>
          <span className="text-zinc-900 dark:text-white">PostCraft </span>
          <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-400 bg-clip-text text-transparent">
            AI
          </span>
        </div>
        {showTagline && (
          <span className={`font-semibold ${taglineSizes} text-zinc-400 dark:text-zinc-500 uppercase -mt-0.5`}>
            IDEAS TO IMPACT EVERYWHERE
          </span>
        )}
      </div>
    </div>
  );
};
