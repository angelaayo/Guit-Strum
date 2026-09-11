"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Handedness = "right" | "left";

interface CurrentUser {
  id: string;
  email: string;
  displayName: string | null;
  handedness: Handedness;
}

// ---- Auth context: just exposes who's logged in, nothing else ----
const AuthContext = createContext<CurrentUser | null>(null);
export function useAuth() {
  return useContext(AuthContext);
}

// ---- Settings context: handedness, DB-backed if logged in, localStorage otherwise ----
interface SettingsContextValue {
  handedness: Handedness;
  setHandedness: (value: Handedness) => void;
}
const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined,
);
export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within Providers");
  return ctx;
}

const STORAGE_KEY = "guitstrum-settings";

export function Providers({
  user,
  children,
}: {
  user: CurrentUser | null;
  children: ReactNode;
}) {
  const [handedness, setHandednessState] = useState<Handedness>(
    user?.handedness ?? "right",
  );
  const [loaded, setLoaded] = useState(!!user); // logged-in users are already correct, nothing to wait for

  useEffect(() => {
    if (user) return; // state already correct from the initializer above — nothing to sync

    function loadFromStorage() {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.handedness === "left" || parsed.handedness === "right") {
            setHandednessState(parsed.handedness);
          }
        } catch {
          // ignore malformed data
        }
      }
      setLoaded(true);
    }

    loadFromStorage();
  }, [user]);

  async function setHandedness(value: Handedness) {
    setHandednessState(value);
    if (user) {
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handedness: value }),
      });
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ handedness: value }));
    }
  }

  if (!loaded) return null;

  return (
    <AuthContext.Provider value={user}>
      <SettingsContext.Provider value={{ handedness, setHandedness }}>
        {children}
      </SettingsContext.Provider>
    </AuthContext.Provider>
  );
}
