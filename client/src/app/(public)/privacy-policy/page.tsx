import { ModulePlaceholder } from "@/components/common/ModulePlaceholder";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <ModulePlaceholder
      title="Privacy Policy"
      description="आपके डेटा की सुरक्षा हमारी प्राथमिकता है।"
    />
  );
}
