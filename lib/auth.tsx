"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import api, { setToken, clearToken, getToken } from "./api";

export type User = { id: string; email: string; name?: string | null };

export type Usage = {
  jobsUsed: number;
  jobsLimit: number;
  notesUsed: number;
  notesLimit: number;
} | null;

type AuthContextValue = {
  user: User | null;
  usage: Usage;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [usage, setUsage] = useState<Usage>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from /auth/me when a token exists. Any failure (network down,
  // backend not built yet, expired token) degrades silently to guest.
  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setUsage(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
      setUsage(res.data.usage ?? null);
    } catch {
      clearToken();
      setUser(null);
      setUsage(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.post("/auth/login", { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      await refresh();
    },
    [refresh],
  );

  const signup = useCallback(
    async (email: string, password: string, name?: string) => {
      const res = await api.post("/auth/signup", { email, password, name });
      setToken(res.data.token);
      setUser(res.data.user);
      await refresh();
    },
    [refresh],
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setUsage(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, usage, loading, login, signup, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
