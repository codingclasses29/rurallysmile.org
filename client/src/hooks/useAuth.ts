"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import type { AuthUser } from "@/types";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await authService.profile();
        if (active && res.success && res.data?.user) {
          setUser(res.data.user);
        }
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { user, loading, setUser };
}
