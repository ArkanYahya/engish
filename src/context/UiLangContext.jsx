import { createContext, useContext, useState } from "react";
import { STRINGS } from "../lib/strings.js";
import { getStoredUiLang, setStoredUiLang } from "../lib/storage.js";

const UiLangContext = createContext(null);

export function UiLangProvider({ children }) {
  const [uiLang, setUiLang] = useState(() => getStoredUiLang());

  function t(key, ...args) {
    const entry = STRINGS[uiLang][key];
    return typeof entry === "function" ? entry(...args) : entry;
  }

  function toggleUiLang() {
    const next = uiLang === "ar" ? "en" : "ar";
    setStoredUiLang(next);
    setUiLang(next);
  }

  const isArabicUi = uiLang === "ar";
  // Passed as spreadable props on chrome-only containers, e.g. <div {...rtlAttrs}> — never
  // on raw English quiz/vocabulary/grammar list content, which always stays LTR regardless
  // of UI language (see the vanilla version's "list stays LTR" convention).
  const rtlAttrs = isArabicUi ? { dir: "rtl", lang: "ar" } : { dir: "ltr", lang: "en" };

  return (
    <UiLangContext.Provider value={{ uiLang, t, isArabicUi, rtlAttrs, toggleUiLang }}>
      {children}
    </UiLangContext.Provider>
  );
}

export function useUiLang() {
  const ctx = useContext(UiLangContext);
  if (!ctx) throw new Error("useUiLang must be used within UiLangProvider");
  return ctx;
}
