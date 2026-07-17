import { ModulePlaceholder } from "@/components/common/ModulePlaceholder";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cookie Policy" };

export default function CookiePolicyPage() {
  return (
    <ModulePlaceholder
      title="Cookie Policy"
      description="हम कैसे cookies का उपयोग करते हैं — Accept, Reject और Customize विकल्प।"
    />
  );
}
