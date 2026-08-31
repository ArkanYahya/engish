import { createContext, useContext, useEffect, useState } from "react";
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth";

import { auth, googleProvider, firebaseReady } from "../lib/firebase.js";

const AuthContext = createContext(null);

// Popup, not signInWithRedirect — Phase 1 testing (see the Firebase discussion) found
// redirect's cross-origin storage handoff unreliable even on a plain desktop browser tab on
// localhost, while popup completed cleanly in both a regular mobile browser tab and the
// installed PWA on Android/iOS — the two contexts that actually matter for this app.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(firebaseReady);
  const [authError, setAuthError] = useState(null);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (!firebaseReady) return;
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signIn() {
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

  function signOut() {
    if (!firebaseReady) return;
    firebaseSignOut(auth);
  }

  return (
    <AuthContext.Provider value={{ firebaseReady, user, authLoading, authError, signingIn, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
