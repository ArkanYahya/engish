// Firebase (Auth + Firestore) — powers the optional "sign in to back up across devices"
// feature. Config comes from Vite env vars (see .env.local.example) rather than being
// hardcoded, so the same source works against different Firebase projects without editing
// code, and the dev config never has to be typed into a file that gets committed.
//
// This file is safe to import even before .env.local is filled in: initialization is
// skipped and `firebaseReady` is false, so callers can show "sign-in unavailable" instead of
// crashing the whole app over a missing dev config.
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseReady = Object.values(config).every(Boolean);

let app = null;
let auth = null;
let db = null;
let googleProvider = null;
let appleProvider = null;

if (firebaseReady) {
  app = initializeApp(config);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  // Requires the Apple provider enabled in Firebase console (Services ID, Team ID, Key ID,
  // private key — all configured on the Apple Developer + Firebase console side, not here).
  // "email"/"name" are the standard scopes; Apple only returns name on the very first
  // sign-in ever for a given user, so nothing here should assume it's always present.
  appleProvider = new OAuthProvider("apple.com");
  appleProvider.addScope("email");
  appleProvider.addScope("name");
} else if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn(
    "Firebase isn't configured — copy .env.local.example to .env.local and fill in your project's values."
  );
}

export { app, auth, db, googleProvider, appleProvider };
