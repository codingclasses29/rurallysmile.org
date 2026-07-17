import type { Metadata } from "next";
import AdmitCardClient from "./AdmitCardClient";

export const metadata: Metadata = { title: "Admit Card" };

export default function AdmitCardPage() {
  return <AdmitCardClient />;
}
