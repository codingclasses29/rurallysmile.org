import { ModulePlaceholder } from "@/components/common/ModulePlaceholder";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <ModulePlaceholder
      title="Terms & Conditions"
      description="Pratibha Khoj Competition 2026 की नियम एवं शर्तें।"
    />
  );
}
