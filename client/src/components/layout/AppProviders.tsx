"use client";

import { ThemeProvider } from "@/theme/ThemeProvider";
import { ToastProvider } from "@/components/ui/toast/Toast";
import { AuthProvider } from "@/context/AuthContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <ToastProvider />
      </AuthProvider>
    </ThemeProvider>
  );
}
