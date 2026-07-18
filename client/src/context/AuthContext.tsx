"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type { AuthUser, UserRole } from "@/types";
import { authService } from "@/services/auth.service";

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  loading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function normalizeUser(data: unknown): AuthUser | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  // login returns flat admin; profile returns { user, role }
  if (d.user && typeof d.user === "object") {
    return d.user as AuthUser;
  }
  if (d.id || d.email) {
    return d as unknown as AuthUser;
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await authService.me();
      if (res?.success && res.data) {
        const u = normalizeUser(res.data);
        setUser(u);
        setRole(
          ((res.data as { role?: string }).role || u?.role) as UserRole | null
        );
      } else {
        setUser(null);
        setRole(null);
      }
    } catch {
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const isAdminRoute = pathname?.startsWith("/admin");
    const isAdminLogin = pathname?.startsWith("/admin/login");

    if (!isAdminRoute || isAdminLogin) {
      setUser(null);
      setRole(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    void refresh();
  }, [pathname, refresh]);

  const login = useCallback(async (payload: { email: string; password: string }) => {
    const res = await authService.login(payload);
    if (res?.success && res.data) {
      const u = normalizeUser(res.data);
      setUser(u);
      setRole((u?.role as UserRole) || null);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      /* ignore */
    }
    setUser(null);
    setRole(null);
  }, []);

  const value = useMemo(
    () => ({ user, role, loading, login, logout, refresh }),
    [user, role, loading, login, logout, refresh]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
