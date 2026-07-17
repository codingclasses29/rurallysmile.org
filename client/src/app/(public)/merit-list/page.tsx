import type { Metadata } from "next";
import MeritListClient from "./MeritListClient";

export const metadata: Metadata = { title: "Merit List" };

export default function MeritListPage() {
  return <MeritListClient />;
}
