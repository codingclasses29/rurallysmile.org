"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button/Button";
import { registrationService } from "@/services/registration.service";
import { HiDownload, HiExternalLink } from "react-icons/hi";
import { notify } from "@/components/ui/toast/Toast";

type Props = {
  registrationNumber: string;
};

export function ReceiptActions({ registrationNumber }: Props) {
  const [busy, setBusy] = useState(false);
  const url = registrationService.receiptUrl(registrationNumber);

  const download = async () => {
    setBusy(true);
    try {
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Receipt download failed");
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `${registrationNumber}-receipt.pdf`;
      a.click();
      URL.revokeObjectURL(href);
      notify.success("Receipt downloaded");
    } catch {
      window.open(url, "_blank", "noopener,noreferrer");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Button
        type="button"
        variant="secondary"
        loading={busy}
        leftIcon={<HiDownload />}
        onClick={download}
      >
        Download PDF Receipt
      </Button>
      <a href={url} target="_blank" rel="noreferrer">
        <Button type="button" variant="outline" leftIcon={<HiExternalLink />}>
          Open Receipt
        </Button>
      </a>
      <Link href="/registration/status">
        <Button type="button" variant="ghost">
          Check Status
        </Button>
      </Link>
      <Link href="/">
        <Button type="button" variant="ghost">
          Go Home
        </Button>
      </Link>
    </div>
  );
}
