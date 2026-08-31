import { useState } from "react";
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

import { useAuth } from "../context/AuthContext.jsx";
import { db, firebaseReady } from "../lib/firebase.js";

// TEMPORARY — Phase 1 test spike only (see the Firebase discussion). Exercises sign-in,
// sign-out, and a real Firestore write+read round trip in one place with everything visible
// on screen, so results are easy to read/screenshot on an actual installed PWA (Android +
// iOS home-screen), not just a desktop dev tools console. Remove this file, its Settings
// entry, and the BottomTabBar wiring once Phase 1 is confirmed working everywhere and Phase
// 2 (the real synced-progress feature) replaces it.
export default function FirebaseTestModal({ isOpen, onClose }) {
  const { user, authError, checkingRedirect, redirectDebug, signIn, signInPopup, signOut } = useAuth();
  const [firestoreResult, setFirestoreResult] = useState(null);
  const [firestoreError, setFirestoreError] = useState(null);
  const [testing, setTesting] = useState(false);

  async function runFirestoreTest() {
    if (!user) return;
    setTesting(true);
    setFirestoreResult(null);
    setFirestoreError(null);
    try {
      const nonce = Math.random().toString(36).slice(2, 10);
      const ref = doc(db, "debugPing", user.uid);
      await setDoc(ref, { nonce, writtenAt: serverTimestamp() });
      const snap = await getDoc(ref);
      if (!snap.exists()) throw new Error("Wrote the doc but couldn't read it back.");
      const roundTripped = snap.data().nonce;
      setFirestoreResult(
        roundTripped === nonce
          ? `✅ Wrote and read back "${nonce}" successfully.`
          : `⚠️ Wrote "${nonce}" but read back "${roundTripped}" — mismatch.`
      );
    } catch (err) {
      setFirestoreError(err);
    } finally {
      setTesting(false);
    }
  }

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="popup-modal">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Firebase Test</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose} aria-label="Close">
              <IonIcon icon={closeOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <div className="ion-padding" style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
        {!firebaseReady && (
          <p style={{ color: "var(--coral)" }}>
            Firebase isn't configured (.env.local is missing or incomplete) — nothing below will work.
          </p>
        )}

        {firebaseReady && checkingRedirect && <p>Checking for a sign-in redirect result…</p>}

        {firebaseReady && !checkingRedirect && (
          <>
            <p>
              <strong>Signed in as:</strong> {user ? `${user.displayName} (${user.email})` : "nobody"}
            </p>
            {redirectDebug && (
              <p style={{ color: "var(--ink-soft)" }}>
                <strong>Redirect check on this load:</strong> {redirectDebug}
              </p>
            )}

            {authError && (
              <p style={{ color: "var(--coral)" }}>
                <strong>Auth error:</strong> {authError.code || authError.message}
              </p>
            )}

            {!user ? (
              <>
                <IonButton expand="block" onClick={signIn}>
                  Sign in with Google (redirect)
                </IonButton>
                <IonButton expand="block" fill="outline" onClick={signInPopup}>
                  Sign in with Google (popup — desktop diagnosis only)
                </IonButton>
              </>
            ) : (
              <IonButton expand="block" fill="outline" onClick={signOut}>
                Sign out
              </IonButton>
            )}

            <IonButton expand="block" disabled={!user || testing} onClick={runFirestoreTest}>
              {testing ? "Testing…" : "Run Firestore write+read test"}
            </IonButton>

            {firestoreResult && <p>{firestoreResult}</p>}
            {firestoreError && (
              <p style={{ color: "var(--coral)" }}>
                <strong>Firestore error:</strong> {firestoreError.code || firestoreError.message}
              </p>
            )}
          </>
        )}
      </div>
    </IonModal>
  );
}
