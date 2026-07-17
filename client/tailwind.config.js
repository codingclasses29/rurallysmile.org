/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0F766E",
          secondary: "#0F172A",
          accent: "#F97316",
          success: "#16A34A",
          warning: "#F97316",
          danger: "#DC2626",
          info: "#06B6D4",
          white: "#FFFFFF",
          gray: "#F4FBFA",
          border: "#CDEDEA",
          text: "#1E293B",
        },
        ui: {
          bg: "var(--ui-bg)",
          surface: "var(--ui-surface)",
          border: "var(--ui-border)",
          text: "var(--ui-text)",
          muted: "var(--ui-muted)",
        },
        primary: {
          50: "#F0FDFA",
          100: "#CCFBF1",
          500: "#14B8A6",
          600: "#0F766E",
          700: "#115E59",
          900: "#134E4A",
        },
        secondary: {
          500: "#F97316",
          600: "#EA580C",
          800: "#0F172A",
        },
      },
      borderRadius: {
        ui: "12px",
        "ui-sm": "8px",
        "ui-lg": "20px",
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "Poppins", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "Noto Sans Devanagari", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "Noto Sans Devanagari", "sans-serif"],
        mono: ["var(--font-roboto-mono)", "Roboto Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        soft: "0 12px 40px rgba(15, 118, 110, 0.10)",
        card: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        hover: "0 20px 35px -8px rgba(15, 118, 110, 0.22)",
        modal: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      },
    },
  },
  plugins: [],
};
