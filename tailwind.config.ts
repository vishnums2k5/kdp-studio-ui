import type { Config } from "tailwindcss";

/**
 * KDP Studio — Tailwind reads every value from the design tokens in
 * src/styles/tokens.css (CSS variables). No component may hard-code
 * colors, sizes or fonts (rebuild prompt §4).
 */
const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    transparent: "transparent",
    current: "currentColor",
    extend: {
      colors: {
        primary: "rgb(var(--c-primary) / <alpha-value>)",
        "primary-hover": "rgb(var(--c-primary-hover) / <alpha-value>)",
        "primary-soft": "rgb(var(--c-primary-soft) / <alpha-value>)",
        "on-primary": "rgb(var(--c-on-primary) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        "surface-2": "rgb(var(--c-surface-2) / <alpha-value>)",
        "surface-3": "rgb(var(--c-surface-3) / <alpha-value>)",
        canvas: "rgb(var(--c-canvas) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        "ink-2": "rgb(var(--c-ink-2) / <alpha-value>)",
        "ink-3": "rgb(var(--c-ink-3) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
        "line-strong": "rgb(var(--c-line-strong) / <alpha-value>)",
        success: "rgb(var(--c-success) / <alpha-value>)",
        "success-soft": "rgb(var(--c-success-soft) / <alpha-value>)",
        warning: "rgb(var(--c-warning) / <alpha-value>)",
        "warning-soft": "rgb(var(--c-warning-soft) / <alpha-value>)",
        danger: "rgb(var(--c-danger) / <alpha-value>)",
        "danger-soft": "rgb(var(--c-danger-soft) / <alpha-value>)",
        info: "rgb(var(--c-info) / <alpha-value>)",
        "info-soft": "rgb(var(--c-info-soft) / <alpha-value>)",
        accent: "rgb(var(--c-accent) / <alpha-value>)",
        "accent-soft": "rgb(var(--c-accent-soft) / <alpha-value>)",
      },
      borderRadius: {
        sm: "var(--r-sm)",
        DEFAULT: "var(--r-md)",
        lg: "var(--r-lg)",
        xl: "var(--r-xl)",
        pill: "var(--r-pill)",
      },
      boxShadow: {
        sm: "var(--sh-sm)",
        DEFAULT: "var(--sh-md)",
        lg: "var(--sh-lg)",
        focus: "var(--sh-focus)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: ["var(--t-xs)", { lineHeight: "1.45" }],
        sm: ["var(--t-sm)", { lineHeight: "1.5" }],
        base: ["var(--t-base)", { lineHeight: "1.55" }],
        lg: ["var(--t-lg)", { lineHeight: "1.45" }],
        xl: ["var(--t-xl)", { lineHeight: "1.35" }],
        "2xl": ["var(--t-2xl)", { lineHeight: "1.25" }],
        "3xl": ["var(--t-3xl)", { lineHeight: "1.2" }],
      },
      spacing: {
        4.5: "1.125rem",
        18: "4.5rem",
        22: "5.5rem",
      },
      zIndex: {
        rail: "30",
        panel: "40",
        bar: "50",
        modal: "80",
        toast: "90",
      },
      keyframes: {
        "slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "pop-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "slide-up": "slide-up var(--d-base) var(--ease)",
        "slide-in-left": "slide-in-left var(--d-base) var(--ease)",
        "slide-in-right": "slide-in-right var(--d-base) var(--ease)",
        "fade-in": "fade-in var(--d-base) var(--ease)",
        "pop-in": "pop-in var(--d-fast) var(--ease)",
      },
    },
  },
  plugins: [],
};

export default config;
