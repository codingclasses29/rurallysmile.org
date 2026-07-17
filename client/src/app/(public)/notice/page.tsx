import type { Metadata } from "next";
import NoticeClient from "./NoticeClient";

export const metadata: Metadata = { title: "Notices" };

export default function NoticePage() {
  return <NoticeClient />;
}
