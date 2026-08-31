import { createContext, useContext, useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import {
  signInWithPopup,
  signInWithRedirect,
  signInWithCredential,
  getRedirectResult,
  GoogleAuthProvider,
  OAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth, googleProvider, appleProvider, firebaseReady } from "../lib/firebase.js";

const AuthContext = createContext(null);
const isNative = Capacitor.isNativePlatform();

// Two completely different sign-in mechanisms depending on where this is running, not one
// mechanism with a fallback:
//
// On native (iOS/Android via Capacitor): the real fix for the Apple-sign-in problem this app
// spent a long investigation on — native Google/Apple sign-in via @capacitor-firebase/
// authentication uses the OS's own account picker (no browser, no redirect, no third-party
// storage involved at all), then bridges the resulting credential into this same Firebase JS
// `auth` object via signInWithCredential so every downstream feature (SyncContext,
// onAuthStateChanged, all of it) keeps working exactly as it already does. See
// https://github.com/capawesome-team/capacitor-firebase — this is their documented pattern,
// not something improvised here.
//
// On web: unchanged from what was already proven out — Google via popup (reliable), Apple via
// redirect (kept only so the button still attempts something on web; known not to complete
// there — see the Apple-sign-in-on-web investigation. Native is the real fix for Apple, not
// this path).
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(firebaseReady);
  const [checkingRedirect, setCheckingRedirect] = useState(firebaseReady && !isNative);
  const [authError, setAuthError] = useState(null);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (!firebaseReady) return;

    // Redirect-result checking is a web-only concern — native never uses signInWithRedirect.
    if (!isNative) {
      getRedirectResult(auth)
        .catch((err) => {
          if (err.code !== "auth/popup-closed-by-user") setAuthError(err);
        })
        .finally(() => setCheckingRedirect(false));
    }

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
      if (isNative) {
        const result = await FirebaseAuthentication.signInWithGoogle();
        const credential = GoogleAuthProvider.credential(result.credential?.idToken);
        await signInWithCredential(auth, credential);
      } else {
        await signInWithPopup(auth, googleProvider);
      }
    } catch (err) {
      // The user closing the popup/native sheet themselves isn't an error worth surfacing.
      if (err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request") {
        setAuthError(err);
      }
    } finally {
      setSigningIn(false);
    }
  }

  async function signInApple() {
    if (!firebaseReady) return;
    setAuthError(null);

    if (isNative) {
      setSigningIn(true);
      try {
        // skipNativeAuth so the plugin doesn't also sign in on the native FirebaseAuth layer
        // separately from this JS `auth` object — one sign-in, not two parallel ones.
        const result = await FirebaseAuthentication.signInWithApple({ skipNativeAuth: true });
        const provider = new OAuthProvider("apple.com");
        const credential = provider.credential({
          idToken: result.credential?.idToken,
          rawNonce: result.credential?.nonce,
        });
        await signInWithCredential(auth, credential);
      } catch (err) {
        if (err.code !== "auth/popup-closed-by-user") setAuthError(err);
      } finally {
        setSigningIn(false);
      }
      return;
    }

    // Web path — kept for completeness, not because it works (see the top comment).
    try {
      sessionStorage.setItem("authReturnPending", "1");
    } catch {
      // ignore — worst case Settings just doesn't auto-reopen after the redirect
    }
    signInWithRedirect(auth, appleProvider).catch((err) => setAuthError(err));
  }

  function signOut() {
    if (!firebaseReady) return;
    if (isNative) FirebaseAuthentication.signOut();
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
