"use client";

import { type ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";

/** Wrap page content when auth/toast is needed */
export default function ClientProviders({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
