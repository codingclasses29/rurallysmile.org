import type { Metadata } from "next";
import ResultClient from "./ResultClient";

export const metadata: Metadata = { title: "Check Result" };

export default function ResultPage() {
  return <ResultClient />;
}
