import { createContext, useContext, useEffect, useState } from "react";
import { getStoredTheme, setStoredTheme, isDarkActive } from "../lib/storage.js";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => isDarkActive());

  // Keep <html data-theme> in sync (our own custom-property bridge) and Ionic's own
  // class-based dark palette in sync (ion-palette-dark) so both our styles and Ionic's
  // built-in components respond to the same toggle together.
  useEffect(() => {
    const stored = getStoredTheme();
    if (stored === "dark" || stored === "light") {
      document.documentElement.setAttribute("data-theme", stored);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    document.documentElement.classList.toggle("ion-palette-dark", isDark);
  }, [isDark]);

  function toggleTheme() {
    const next = isDarkActive() ? "light" : "dark";
    setStoredTheme(next);
    setIsDark(next === "dark");
  }

  return <ThemeContext.Provider value={{ isDark, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
