import { useState } from "react";
import { IonButton } from "@ionic/react";

import { useUiLang } from "../context/UiLangContext.jsx";
import { markOnboardingComplete } from "../lib/storage.js";
import { HomeIcon, BookIcon, GrammarIcon, SettingsIcon } from "./icons.jsx";

const TOTAL_STEPS = 5;
const LEVELS = ["A1", "A2", "B1", "B2"];

// First-run tutorial — shown once, before the router mounts (see App.jsx), so nothing about
// the real app (level data, saved progress, etc.) needs to load until it's dismissed.
// Steps 0-1 happen before a UI language is chosen, so their copy is hardcoded bilingual
// (English + Arabic together) rather than going through t() — everything from step 2 onward
// uses the language the learner just picked, same as the rest of the app.
export default function Onboarding({ onComplete }) {
  const { uiLang, t, isArabicUi, rtlAttrs, toggleUiLang } = useUiLang();
  const [step, setStep] = useState(0);

  function selectLanguage(lang) {
    if (lang !== uiLang) toggleUiLang();
    setStep(2);
  }

  function next() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function finish() {
    markOnboardingComplete();
    onComplete();
  }

  return (
    <div className="onboarding" {...rtlAttrs}>
      <div className="onboarding-body">
        {step === 0 && (
          <>
            <img src="/icon-512.png" alt="HamoLingo" className="onboarding-icon" />
            <h1 className="onboarding-title" dir="ltr" lang="en">
              Welcome to HamoLingo
            </h1>
            <h1 className="onboarding-title" dir="rtl" lang="ar">
              مرحبًا بك في HamoLingo
            </h1>
            <p className="onboarding-subtitle" dir="ltr" lang="en">
              Learn English the fun way, in both English and Arabic.
            </p>
            <p className="onboarding-subtitle" dir="rtl" lang="ar">
              تعلم الإنجليزية بطريقة ممتعة، بالإنجليزية والعربية معًا.
            </p>
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="onboarding-title" dir="ltr" lang="en">
              Choose your language
            </h1>
            <h1 className="onboarding-title" dir="rtl" lang="ar">
              اختر لغتك
            </h1>
            <div className="onboarding-lang-row">
              <button type="button" className="onboarding-lang-btn" onClick={() => selectLanguage("en")}>
                English
              </button>
              <button type="button" className="onboarding-lang-btn" dir="rtl" lang="ar" onClick={() => selectLanguage("ar")}>
                العربية
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="onboarding-title font-display">{t("onboardingWordsTitle")}</h1>
            <p className="onboarding-subtitle">{t("onboardingWordsBody")}</p>
            <div className="onboarding-levels-row">
              {LEVELS.map((label) => (
                <div className="onboarding-level-chip" key={label}>
                  <strong>{label}</strong>
                  <span>
                    250 {t("onboardingWordsUnit")}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="onboarding-title font-display">{t("onboardingUiTitle")}</h1>
            <div className="onboarding-ui-list">
              <div className="onboarding-ui-row">
                <span className="onboarding-ui-icon">
                  <HomeIcon />
                </span>
                <p>
                  <strong>{t("navHome")}</strong>
                  {t("onboardingUiHome")}
                </p>
              </div>
              <div className="onboarding-ui-row">
                <span className="onboarding-ui-icon">
                  <BookIcon />
                </span>
                <p>
                  <strong>{t("vocabulary")}</strong>
                  {t("onboardingUiVocab")}
                </p>
              </div>
              <div className="onboarding-ui-row">
                <span className="onboarding-ui-icon">
                  <GrammarIcon />
                </span>
                <p>
                  <strong>{t("grammar")}</strong>
                  {t("onboardingUiGrammar")}
                </p>
              </div>
              <div className="onboarding-ui-row">
                <span className="onboarding-ui-icon">
                  <SettingsIcon />
                </span>
                <p>
                  <strong>{t("settings")}</strong>
                  {t("onboardingUiSettings")}
                </p>
              </div>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <img src="/icon-512.png" alt="HamoLingo" className="onboarding-icon" />
            <h1 className="onboarding-title font-display">{t("onboardingFinishTitle")}</h1>
            <p className="onboarding-subtitle">{t("onboardingFinishBody")}</p>
          </>
        )}
      </div>

      <div className="onboarding-dots">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <span key={i} className={`onboarding-dot ${i === step ? "active" : ""}`} />
        ))}
      </div>

      <div className="onboarding-nav">
        {step > 0 && (
          <IonButton fill="outline" onClick={back}>
            {step === 1 ? (isArabicUi ? "رجوع" : "Back") : t("back")}
          </IonButton>
        )}
        {step === 0 && (
          <IonButton expand="block" onClick={next}>
            Next · التالي
          </IonButton>
        )}
        {step >= 2 && step < TOTAL_STEPS - 1 && (
          <IonButton expand="block" onClick={next}>
            {t("next")}
          </IonButton>
        )}
        {step === TOTAL_STEPS - 1 && (
          <IonButton expand="block" onClick={finish}>
            {t("onboardingGetStarted")}
          </IonButton>
        )}
      </div>
    </div>
  );
}
