import { createContext, useContext, useEffect, useState } from "react";
import { getStoredTheme, setStoredTheme, isDarkActive, getStoredAccent, setStoredAccent } from "../lib/storage.js";

const ThemeContext = createContext(null);

// Two independent choices, both picked from Settings: "mode" (light/dark surface — dark
// follows the OS preference automatically until explicitly picked, same as before) and
// "accent" (violet/red primary color), which stays whatever it is regardless of mode. Four
// combinations exist (violet-light, violet-dark, red-light, red-dark) and theme.css defines
// tokens for all four.
export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => isDarkActive());
  const [accent, setAccent] = useState(() => getStoredAccent());

  // Keep <html data-theme>/<html data-accent> in sync (our own custom-property bridge) and
  // Ionic's own class-based dark palette in sync (ion-palette-dark) so both our styles and
  // Ionic's built-in components respond to the same choices together. When no mode has been
  // explicitly picked yet, data-theme is left off entirely so the OS-level
  // prefers-color-scheme media query keeps driving light/dark live, same as before.
  useEffect(() => {
    const stored = getStoredTheme();
    if (stored === "dark" || stored === "light") {
      document.documentElement.setAttribute("data-theme", stored);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    document.documentElement.classList.toggle("ion-palette-dark", isDark);
  }, [isDark]);

  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accent);
  }, [accent]);

  function selectMode(next) {
    setStoredTheme(next);
    setIsDark(next === "dark");
  }

  function selectAccent(next) {
    setStoredAccent(next);
    setAccent(next);
  }

  return (
    <ThemeContext.Provider value={{ isDark, selectMode, accent, selectAccent }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
