import type { Metadata } from "next";
import {
  RegistrationShell,
  RegistrationWizard,
} from "@/components/registration";

export const metadata: Metadata = {
  title: "Student Registration",
  description:
    "प्रतिभा खोज प्रतियोगिता 2026 के लिए ऑनलाइन छात्र पंजीकरण। Photo, Signature अपलोड करें और Registration Number प्राप्त करें।",
  alternates: { canonical: "/registration" },
};

export default function RegistrationPage() {
  return (
    <RegistrationShell>
      <RegistrationWizard />
    </RegistrationShell>
  );
}
