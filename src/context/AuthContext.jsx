import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth, googleProvider, appleProvider, firebaseReady } from "../lib/firebase.js";

const AuthContext = createContext(null);

// Google: popup — Phase 1 testing (see the Firebase discussion) found signInWithRedirect's
// cross-origin storage handoff unreliable even on a plain desktop browser tab on localhost,
// while popup completed cleanly in both a regular mobile browser tab and the installed PWA
// on Android/iOS.
//
// Apple: redirect, not popup — the opposite conclusion, for the opposite reason. Apple's own
// sign-in page rejects being opened as a popup from Safari/WebKit ("The requested action is
// invalid", confirmed failing in both a plain Safari tab and the installed PWA on iPhone) —
// unlike Google, Apple's flow is natively built around a full-page redirect
// (response_mode=form_post), so redirect is the flow Apple actually expects here, not a
// fallback. Since this navigates the whole page away and back, getRedirectResult() has to be
// checked once on mount, same as the original Phase 1 spike did for Google.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(firebaseReady);
  const [checkingRedirect, setCheckingRedirect] = useState(firebaseReady);
  const [authError, setAuthError] = useState(null);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (!firebaseReady) return;

    // Apple sign-in is known-broken on the web (see the Apple-sign-in investigation):
    // signInWithRedirect's credential handoff gets lost to browser cross-site storage
    // blocking between our domain and Firebase's authDomain, confirmed via a debug build
    // that logged getRedirectResult()'s actual outcome ("none" every time, despite Apple's
    // own login completing) — removed now that the cause is confirmed, not still open.
    getRedirectResult(auth)
      .catch((err) => {
        if (err.code !== "auth/popup-closed-by-user") setAuthError(err);
      })
      .finally(() => setCheckingRedirect(false));

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signInGoogle() {
    if (!firebaseReady) return;
    setAuthError(null);
    setSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      // The user closing the popup themselves isn't an error worth surfacing.
      if (err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request") {
        setAuthError(err);
      }
    } finally {
      setSigningIn(false);
    }
  }

  function signInApple() {
    if (!firebaseReady) return;
    setAuthError(null);
    // Marker so the app can reopen Settings automatically once Apple redirects back —
    // otherwise the redirect returns to a fresh Home screen with Settings closed, and it's
    // easy to miss ever seeing whether sign-in actually worked (see BottomTabBar).
    try {
      sessionStorage.setItem("authReturnPending", "1");
    } catch {
      // ignore — worst case Settings just doesn't auto-reopen after the redirect
    }
    // No setSigningIn(true)/finally here — this navigates the page away immediately, so
    // there's no "back" from this call to reset that state from; the reload that follows
    // sign-in resets everything anyway. Errors thrown here (as opposed to after the redirect
    // returns) mean the redirect couldn't even start.
    signInWithRedirect(auth, appleProvider).catch((err) => setAuthError(err));
  }

  function signOut() {
    if (!firebaseReady) return;
    firebaseSignOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{
        firebaseReady,
        user,
        authLoading,
        checkingRedirect,
        authError,
        signingIn,
        signInGoogle,
        signInApple,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
