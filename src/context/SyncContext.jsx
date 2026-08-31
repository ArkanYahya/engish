import { createContext, useContext, useEffect, useRef, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import { useAuth } from "./AuthContext.jsx";
import { db, firebaseReady } from "../lib/firebase.js";
import { exportProgressData, importProgressData, hasProgressInData, onProgressChange } from "../lib/storage.js";

const SyncContext = createContext(null);
const PUSH_DEBOUNCE_MS = 3000;

// One Firestore doc per signed-in user (users/{uid}), holding the exact same { data: {...} }
// shape Backup/Restore already uses — signing in is really just "point that same
// backup/restore machinery at Firestore instead of a downloaded file."
//
// Reconciliation runs once per sign-in: if only one side (this device or the cloud account)
// actually has real progress, the other side just silently adopts it — a genuine conflict
// (both sides have real, different progress) is the only case that asks the learner to
// choose, via `conflict` + `resolveConflict` below.
export function SyncProvider({ children }) {
  const { user } = useAuth();
  const [status, setStatus] = useState("idle"); // idle | syncing | synced | error
  const [conflict, setConflict] = useState(null); // { localData, cloudData } | null
  const pushTimer = useRef(null);
  const reconciledForUid = useRef(null);

  async function pushToCloud(uid) {
    if (!firebaseReady) return;
    setStatus("syncing");
    try {
      const { data } = exportProgressData();
      await setDoc(doc(db, "users", uid), { data, updatedAt: serverTimestamp() });
      setStatus("synced");
    } catch (err) {
      console.error("Sync push failed:", err);
      setStatus("error");
    }
  }

  function schedulePush(uid) {
    if (pushTimer.current) clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(() => pushToCloud(uid), PUSH_DEBOUNCE_MS);
  }

  useEffect(() => {
    const uid = user?.uid;
    if (!uid || !firebaseReady) return;
    if (reconciledForUid.current === uid) return;
    reconciledForUid.current = uid;

    (async () => {
      setStatus("syncing");
      try {
        const snap = await getDoc(doc(db, "users", uid));
        const cloudData = snap.exists() ? snap.data().data : null;

        if (!cloudData) {
          await pushToCloud(uid); // nothing in the cloud yet — this device seeds it
          return;
        }

        const { data: localData } = exportProgressData();
        if (JSON.stringify(localData) === JSON.stringify(cloudData)) {
          setStatus("synced");
          return;
        }

        const localHasProgress = hasProgressInData(localData);
        const cloudHasProgress = hasProgressInData(cloudData);

        if (localHasProgress && cloudHasProgress) {
          // Real conflict — only case that interrupts the learner.
          setConflict({ localData, cloudData });
          setStatus("idle");
        } else if (cloudHasProgress) {
          // This device has nothing at stake — adopt the cloud copy quietly.
          importProgressData({ data: cloudData });
          window.location.reload(); // same reasoning as Restore Progress: contexts read localStorage once at mount
        } else {
          // Cloud has nothing at stake (or differs only in trivial prefs) — this device wins.
          await pushToCloud(uid);
        }
      } catch (err) {
        console.error("Sync reconcile failed:", err);
        setStatus("error");
      }
    })();
  }, [user?.uid]);

  // Push on every local change once signed in — but not while a conflict is still awaiting
  // the learner's choice, so a stray write can't preempt that decision.
  useEffect(() => {
    const uid = user?.uid;
    if (!uid || !firebaseReady || conflict) return;
    return onProgressChange(() => schedulePush(uid));
  }, [user?.uid, conflict]);

  function resolveConflict(keep) {
    if (!conflict || !user) return;
    if (keep === "cloud") {
      importProgressData({ data: conflict.cloudData });
      setConflict(null);
      window.location.reload();
    } else {
      setConflict(null);
      pushToCloud(user.uid); // this device wins — push it up, overwriting the cloud copy
    }
  }

  return (
    <SyncContext.Provider value={{ status, conflict, resolveConflict }}>{children}</SyncContext.Provider>
  );
}

export function useSync() {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error("useSync must be used within SyncProvider");
  return ctx;
}
