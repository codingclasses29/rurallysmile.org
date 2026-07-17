import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Registration | Pratibha Khoj 2026",
    default: "Registration | Pratibha Khoj 2026",
  },
};

export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-[70vh] bg-gradient-to-b from-slate-50 via-white to-sky-50/40 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">{children}</div>;
}
