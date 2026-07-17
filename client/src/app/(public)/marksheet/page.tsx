import type { Metadata } from "next";
import MarksheetClient from "./MarksheetClient";

export const metadata: Metadata = { title: "Digital Marksheet" };

export default function MarksheetPage() {
  return <MarksheetClient />;
}
