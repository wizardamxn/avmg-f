// AVMG neobrutalist design tokens.
//
// Tailwind v4's JIT scans source files as plain TEXT — an arbitrary utility
// like `shadow-[8px_8px_0_0_#ff00ff]` is only generated if that exact string
// appears literally somewhere it scans. Because our components compose classes
// dynamically (by accent name), every literal MUST live in this file so the
// compiler emits it. Never build these strings with template interpolation.

export type Accent =
  | "pink"
  | "green"
  | "cyan"
  | "purple"
  | "yellow"
  | "white"
  | "orange"
  | "red";

type AccentTokens = {
  hex: string;
  text: string;
  border: string;
  borderHalf: string; // 50% opacity divider used inside panels
  bg: string;
  fg: string; // readable text color when sitting ON the solid bg
  bgHover: string;
  placeholder: string;
};

export const ACCENT: Record<Accent, AccentTokens> = {
  pink: {
    hex: "#ff00ff",
    text: "text-pink-500",
    border: "border-pink-500",
    borderHalf: "border-pink-500/50",
    bg: "bg-pink-500",
    fg: "text-black",
    bgHover: "hover:bg-pink-400",
    placeholder: "placeholder-pink-900",
  },
  green: {
    hex: "#39ff14",
    text: "text-green-500",
    border: "border-green-500",
    borderHalf: "border-green-500/50",
    bg: "bg-green-500",
    fg: "text-black",
    bgHover: "hover:bg-green-400",
    placeholder: "placeholder-green-900",
  },
  cyan: {
    hex: "#00ffff",
    text: "text-cyan-400",
    border: "border-cyan-400",
    borderHalf: "border-cyan-400/50",
    bg: "bg-cyan-400",
    fg: "text-black",
    bgHover: "hover:bg-cyan-300",
    placeholder: "placeholder-cyan-900",
  },
  purple: {
    hex: "#9333ea",
    text: "text-purple-400",
    border: "border-purple-500",
    borderHalf: "border-purple-500/50",
    bg: "bg-purple-600",
    fg: "text-white",
    bgHover: "hover:bg-purple-500",
    placeholder: "placeholder-purple-800",
  },
  yellow: {
    hex: "#ffff00",
    text: "text-yellow-400",
    border: "border-yellow-400",
    borderHalf: "border-yellow-400/50",
    bg: "bg-yellow-400",
    fg: "text-black",
    bgHover: "hover:bg-yellow-300",
    placeholder: "placeholder-yellow-800",
  },
  white: {
    hex: "#ffffff",
    text: "text-white",
    border: "border-white",
    borderHalf: "border-white/50",
    bg: "bg-white",
    fg: "text-black",
    bgHover: "hover:bg-gray-200",
    placeholder: "placeholder-neutral-600",
  },
  orange: {
    hex: "#ff8800",
    text: "text-orange-400",
    border: "border-orange-500",
    borderHalf: "border-orange-500/50",
    bg: "bg-orange-500",
    fg: "text-black",
    bgHover: "hover:bg-orange-400",
    placeholder: "placeholder-orange-900",
  },
  red: {
    hex: "#ef4444",
    text: "text-red-500",
    border: "border-red-500",
    borderHalf: "border-red-500/50",
    bg: "bg-red-500",
    fg: "text-black",
    bgHover: "hover:bg-red-400",
    placeholder: "placeholder-red-900",
  },
};

// Hard offset shadows (no blur), keyed by accent then pixel offset.
export const SHADOW: Record<Accent, Record<4 | 6 | 8 | 10 | 12, string>> = {
  pink: {
    4: "shadow-[4px_4px_0_0_#ff00ff]",
    6: "shadow-[6px_6px_0_0_#ff00ff]",
    8: "shadow-[8px_8px_0_0_#ff00ff]",
    10: "shadow-[10px_10px_0_0_#ff00ff]",
    12: "shadow-[12px_12px_0_0_#ff00ff]",
  },
  green: {
    4: "shadow-[4px_4px_0_0_#39ff14]",
    6: "shadow-[6px_6px_0_0_#39ff14]",
    8: "shadow-[8px_8px_0_0_#39ff14]",
    10: "shadow-[10px_10px_0_0_#39ff14]",
    12: "shadow-[12px_12px_0_0_#39ff14]",
  },
  cyan: {
    4: "shadow-[4px_4px_0_0_#00ffff]",
    6: "shadow-[6px_6px_0_0_#00ffff]",
    8: "shadow-[8px_8px_0_0_#00ffff]",
    10: "shadow-[10px_10px_0_0_#00ffff]",
    12: "shadow-[12px_12px_0_0_#00ffff]",
  },
  purple: {
    4: "shadow-[4px_4px_0_0_#9333ea]",
    6: "shadow-[6px_6px_0_0_#9333ea]",
    8: "shadow-[8px_8px_0_0_#9333ea]",
    10: "shadow-[10px_10px_0_0_#9333ea]",
    12: "shadow-[12px_12px_0_0_#9333ea]",
  },
  yellow: {
    4: "shadow-[4px_4px_0_0_#ffff00]",
    6: "shadow-[6px_6px_0_0_#ffff00]",
    8: "shadow-[8px_8px_0_0_#ffff00]",
    10: "shadow-[10px_10px_0_0_#ffff00]",
    12: "shadow-[12px_12px_0_0_#ffff00]",
  },
  white: {
    4: "shadow-[4px_4px_0_0_#ffffff]",
    6: "shadow-[6px_6px_0_0_#ffffff]",
    8: "shadow-[8px_8px_0_0_#ffffff]",
    10: "shadow-[10px_10px_0_0_#ffffff]",
    12: "shadow-[12px_12px_0_0_#ffffff]",
  },
  orange: {
    4: "shadow-[4px_4px_0_0_#ff8800]",
    6: "shadow-[6px_6px_0_0_#ff8800]",
    8: "shadow-[8px_8px_0_0_#ff8800]",
    10: "shadow-[10px_10px_0_0_#ff8800]",
    12: "shadow-[12px_12px_0_0_#ff8800]",
  },
  red: {
    4: "shadow-[4px_4px_0_0_#ef4444]",
    6: "shadow-[6px_6px_0_0_#ef4444]",
    8: "shadow-[8px_8px_0_0_#ef4444]",
    10: "shadow-[10px_10px_0_0_#ef4444]",
    12: "shadow-[12px_12px_0_0_#ef4444]",
  },
};

// Shadow that shrinks on hover (the "press in" feel).
export const SHADOW_HOVER: Record<Accent, Record<2 | 4, string>> = {
  pink: { 2: "hover:shadow-[2px_2px_0_0_#ff00ff]", 4: "hover:shadow-[4px_4px_0_0_#ff00ff]" },
  green: { 2: "hover:shadow-[2px_2px_0_0_#39ff14]", 4: "hover:shadow-[4px_4px_0_0_#39ff14]" },
  cyan: { 2: "hover:shadow-[2px_2px_0_0_#00ffff]", 4: "hover:shadow-[4px_4px_0_0_#00ffff]" },
  purple: { 2: "hover:shadow-[2px_2px_0_0_#9333ea]", 4: "hover:shadow-[4px_4px_0_0_#9333ea]" },
  yellow: { 2: "hover:shadow-[2px_2px_0_0_#ffff00]", 4: "hover:shadow-[4px_4px_0_0_#ffff00]" },
  white: { 2: "hover:shadow-[2px_2px_0_0_#ffffff]", 4: "hover:shadow-[4px_4px_0_0_#ffffff]" },
  orange: { 2: "hover:shadow-[2px_2px_0_0_#ff8800]", 4: "hover:shadow-[4px_4px_0_0_#ff8800]" },
  red: { 2: "hover:shadow-[2px_2px_0_0_#ef4444]", 4: "hover:shadow-[4px_4px_0_0_#ef4444]" },
};

// Offset text shadow used on big headings.
export const DROP: Record<Accent, Record<4 | 8, string>> = {
  pink: { 4: "drop-shadow-[4px_4px_0_#ff00ff]", 8: "drop-shadow-[8px_8px_0_#ff00ff]" },
  green: { 4: "drop-shadow-[4px_4px_0_#39ff14]", 8: "drop-shadow-[8px_8px_0_#39ff14]" },
  cyan: { 4: "drop-shadow-[4px_4px_0_#00ffff]", 8: "drop-shadow-[8px_8px_0_#00ffff]" },
  purple: { 4: "drop-shadow-[4px_4px_0_#9333ea]", 8: "drop-shadow-[8px_8px_0_#9333ea]" },
  yellow: { 4: "drop-shadow-[4px_4px_0_#ffff00]", 8: "drop-shadow-[8px_8px_0_#ffff00]" },
  white: { 4: "drop-shadow-[4px_4px_0_#ffffff]", 8: "drop-shadow-[8px_8px_0_#ffffff]" },
  orange: { 4: "drop-shadow-[4px_4px_0_#ff8800]", 8: "drop-shadow-[8px_8px_0_#ff8800]" },
  red: { 4: "drop-shadow-[4px_4px_0_#ef4444]", 8: "drop-shadow-[8px_8px_0_#ef4444]" },
};

// Tiny helper — join truthy class fragments.
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");
