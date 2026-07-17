/** Design tokens for Pratibha Khoj Exam Portal */

export const colors = {
  primary: "#0F766E",
  secondary: "#0F172A",
  accent: "#F97316",
  success: "#16A34A",
  warning: "#F97316",
  danger: "#DC2626",
  info: "#06B6D4",
  background: "#F4FBFA",
  border: "#CDEDEA",
  text: "#1E293B",
  white: "#FFFFFF",
} as const;

export const radius = {
  sm: "8px",
  md: "12px",
  lg: "20px",
  full: "9999px",
} as const;

export const shadows = {
  card: "shadow-md",
  hover: "shadow-xl",
  modal: "shadow-2xl",
} as const;

export const breakpoints = {
  mobile: 320,
  tablet: 768,
  laptop: 1024,
  desktop: 1440,
} as const;

export const gridCols = {
  mobile: 1,
  tablet: 2,
  laptop: 3,
  desktop: 4,
} as const;
