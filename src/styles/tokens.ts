/**
 * TS mirror of tokens.css for canvas rendering (Konva cannot read CSS vars).
 * Keep values in sync with src/styles/tokens.css — the /dev/components
 * gallery renders a swatch sheet straight from this object.
 */
export const themes = {
  light: {
    primary: "#5646D6",
    primaryHover: "#4738B8",
    primarySoft: "#EEF0FC",
    onPrimary: "#FFFFFF",
    surface: "#FFFFFF",
    surface2: "#F7F8FC",
    surface3: "#EEF0F6",
    canvas: "#F0F3FA",
    ink: "#1C1E26",
    ink2: "#5A5E6E",
    ink3: "#8A8FA3",
    line: "#E4E7F0",
    lineStrong: "#C9CEDD",
    success: "#178A50",
    successSoft: "#E8F6EE",
    warning: "#9A6700",
    warningStrong: "#BF6A00",
    warningSoft: "#FFF6E0",
    danger: "#C63745",
    dangerSoft: "#FDEBED",
    info: "#2563AE",
    infoSoft: "#E9F1FA",
    accent: "#D63F8A",
    accentSoft: "#FAEAF3",
  },
  dark: {
    primary: "#7C72E8",
    primaryHover: "#8C83F0",
    primarySoft: "#2E2C54",
    onPrimary: "#FFFFFF",
    surface: "#1C1E26",
    surface2: "#232630",
    surface3: "#2E323F",
    canvas: "#14161C",
    ink: "#ECEEF5",
    ink2: "#A6ACBF",
    ink3: "#7A8094",
    line: "#2E323F",
    lineStrong: "#3E4354",
    success: "#4AC481",
    successSoft: "#163022",
    warning: "#EBB04C",
    warningStrong: "#EBB04C",
    warningSoft: "#372B10",
    danger: "#EB6976",
    dangerSoft: "#3A1A1F",
    info: "#6AA5EB",
    infoSoft: "#14283E",
    accent: "#F07AB2",
    accentSoft: "#3A182C",
  },
} as const;

export type ThemeName = keyof typeof themes;
export type TokenSheet = (typeof themes)[ThemeName];

export const radii = { sm: 6, md: 8, lg: 12, xl: 16, pill: 999 } as const;
export const motion = {
  fast: 120,
  base: 160,
  slow: 240,
  ease: "cubic-bezier(0.2, 0.7, 0.3, 1)",
} as const;
export const iconSizes = { xs: 14, sm: 16, md: 18, lg: 20 } as const;
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1440,
} as const;
export const layout = { sidebarWidth: 248 } as const;

export function tokensFor(theme: ThemeName): TokenSheet {
  return themes[theme];
}
