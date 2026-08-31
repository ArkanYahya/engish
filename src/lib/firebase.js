// Firebase (Auth + Firestore) — powers the optional "sign in to back up across devices"
// feature. Config comes from Vite env vars (see .env.local.example) rather than being
// hardcoded, so the same source works against different Firebase projects without editing
// code, and the dev config never has to be typed into a file that gets committed.
//
// This file is safe to import even before .env.local is filled in: initialization is
// skipped and `firebaseReady` is false, so callers can show "sign-in unavailable" instead of
// crashing the whole app over a missing dev config.
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
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

if (firebaseReady) {
  app = initializeApp(config);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
} else if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn(
    "Firebase isn't configured — copy .env.local.example to .env.local and fill in your project's values."
  );
}

export { app, auth, db, googleProvider };
