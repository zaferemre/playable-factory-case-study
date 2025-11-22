"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "@/firebase";
import type { User as BackendUser } from "@/lib/types/types";
import { syncFirebaseUser } from "@/lib/api/authApi";
import { getOrCreateCartSessionId } from "@/lib/api/cartApi"; // you already have this helper

interface AuthContextShape {
  firebaseUser: FirebaseUser | null;
  backendUser: BackendUser | null;
  backendUserId: string | null;
  idToken: string | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextShape | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
  const [backendUserId, setBackendUserId] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        const token = await fbUser.getIdToken();
        setIdToken(token);

        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
        }

        try {
          const sessionId = getOrCreateCartSessionId();
          const syncRes = await syncFirebaseUser({
            uid: fbUser.uid,
            email: fbUser.email || "",
            name: fbUser.displayName || fbUser.email || "Customer",
            photoUrl: fbUser.photoURL || undefined,
            sessionId,
          });

          setBackendUser(syncRes.user);
          setBackendUserId(syncRes.user._id);
          // do not touch Redux cart here, Header will hydrate using backendUserId
        } catch (err) {
          console.error("syncFirebaseUser failed", err);
          setBackendUser(null);
          setBackendUserId(null);
        }
      } else {
        setIdToken(null);
        setBackendUser(null);
        setBackendUserId(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value: AuthContextShape = {
    firebaseUser,
    backendUser,
    backendUserId,
    idToken,
    loading,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
