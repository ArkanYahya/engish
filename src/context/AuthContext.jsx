import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth, googleProvider, firebaseReady } from "../lib/firebase.js";

const AuthContext = createContext(null);

// Redirect-based sign-in (not signInWithPopup) — a popup is unreliable inside an installed
// PWA with no browser chrome around it (silently blocked on some platforms, awkward on
// others). A redirect navigates the whole page away to Google and back, which means this
// context has to (a) live at the top of the tree, mounted before any redirect could return,
// and (b) check getRedirectResult() once on mount to catch that return, since nothing about
// component-local state survives the round trip.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [checkingRedirect, setCheckingRedirect] = useState(firebaseReady);
  // Debug-only (see FirebaseTestModal) — whether getRedirectResult() actually found a
  // pending redirect to resolve on this load. If sign-in still shows "nobody" after coming
  // back from Google with no authError, this is what tells us whether the redirect's result
  // simply never made it back to this page (this stays "none") vs. it resolved fine but
  // onAuthStateChanged somehow never fired with a user (this becomes "user", but user stays
  // null) — two very different bugs that look identical from the "signed in as: nobody" view.
  const [redirectDebug, setRedirectDebug] = useState(null);

  useEffect(() => {
    if (!firebaseReady) return;

    getRedirectResult(auth)
      .then((result) => setRedirectDebug(result ? `user: ${result.user?.email}` : "none"))
      .catch((err) => {
        setAuthError(err);
        setRedirectDebug(`error: ${err.code || err.message}`);
      })
      .finally(() => setCheckingRedirect(false));

    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return unsubscribe;
  }, []);

  function signIn() {
    if (!firebaseReady) return;
    setAuthError(null);
    // Marker so the app can reopen the Firebase Test panel automatically once Google
    // redirects back — otherwise the redirect returns to a fresh Home screen with Settings
    // closed, and it's easy to miss ever checking the result (see BottomTabBar).
    try {
      sessionStorage.setItem("firebaseTestReturnPending", "1");
    } catch {
      // ignore — worst case the panel just doesn't auto-reopen after the redirect
    }
    // signInWithRedirect normally navigates the page away before this promise ever settles —
    // it only rejects (rather than navigating) when something's wrong before the redirect
    // can even start (provider not enabled, domain not authorized, popup/redirect blocked,
    // ...), which is exactly the "nothing happens" case this was silently swallowing before.
    signInWithRedirect(auth, googleProvider).catch((err) => setAuthError(err));
  }

  // Debug-only (see FirebaseTestModal) — popup doesn't rely on the cross-origin storage
  // handoff that signInWithRedirect needs between the authDomain and this origin, so it's a
  // clean way to tell "the Firebase project/config is fine, it's specifically the redirect
  // mechanism failing here" apart from "nothing about this is working." Not meant for real
  // use in the installed-PWA case (see the top comment) — desktop-browser diagnosis only.
  async function signInPopup() {
    if (!firebaseReady) return;
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setAuthError(err);
    }
  }

  function signOut() {
    if (!firebaseReady) return;
    firebaseSignOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{ firebaseReady, user, authError, checkingRedirect, redirectDebug, signIn, signInPopup, signOut }}
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
