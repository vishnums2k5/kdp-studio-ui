"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Theme = "light" | "dark";

const ThemeCtx = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({ theme: "light", setTheme: () => {} });

export const THEME_STORAGE_KEY = "kdp-studio-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark") setThemeState(stored);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    window.localStorage.setItem(THEME_STORAGE_KEY, t);
  }, []);

  return (
    <ThemeCtx.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);

/**
 * Inline script injected in <head> to avoid theme flash (FOUC).
 */
export const themeInitScript = `
(function(){try{
  var t = localStorage.getItem("${THEME_STORAGE_KEY}");
  if (t === "dark") {
    document.documentElement.classList.add("dark");
    document.documentElement.style.colorScheme = "dark";
  }
} catch(e){}})();
`;
