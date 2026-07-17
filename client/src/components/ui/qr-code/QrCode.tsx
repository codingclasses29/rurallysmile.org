"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { HiDownload, HiRefresh, HiShieldCheck } from "react-icons/hi";
import { Button } from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input/Input";
import { cn } from "@/utils/cn";

export type QrCodeProps = {
  value: string;
  size?: number;
  className?: string;
  showActions?: boolean;
  verifyValue?: string;
  title?: string;
};

export function QrCode({
  value,
  size = 180,
  className,
  showActions = true,
  verifyValue,
  title = "QR Code",
}: QrCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [manual, setManual] = useState("");
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null);

  const generate = useCallback(async () => {
    if (!canvasRef.current || !value) return;
    try {
      await QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: { dark: "#0F172A", light: "#FFFFFF" },
      });
      setError(null);
    } catch {
      setError("QR generate करने में समस्या हुई।");
    }
  }, [size, value]);

  useEffect(() => {
    void generate();
  }, [generate]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `qr-${Date.now()}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const verify = () => {
    const expected = verifyValue ?? value;
    if (manual.trim() === expected) {
      setVerifyMsg("Verified ✓ QR मान्य है।");
    } else {
      setVerifyMsg("Invalid ✗ QR मेल नहीं खाता।");
    }
  };

  return (
    <div
      className={cn(
        "inline-flex flex-col items-center gap-3 rounded-ui-lg border border-brand-border bg-white p-4 shadow-card dark:bg-slate-900",
        className
      )}
    >
      <p className="font-heading text-sm font-bold text-brand-primary dark:text-white">
        {title}
      </p>
      <canvas ref={canvasRef} className="rounded-ui-sm" />
      {error && <p className="text-xs text-brand-danger">{error}</p>}

      {showActions && (
        <div className="flex flex-wrap justify-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => void generate()} leftIcon={<HiRefresh />}>
            Generate
          </Button>
          <Button size="sm" variant="outline" onClick={download} leftIcon={<HiDownload />}>
            Download
          </Button>
        </div>
      )}

      {showActions && (
        <div className="w-full space-y-2 border-t border-brand-border pt-3">
          <Input
            label="Verify QR"
            placeholder="Enter code / value"
            value={manual}
            onChange={(e) => setManual(e.target.value)}
          />
          <Button size="sm" variant="success" fullWidth onClick={verify} leftIcon={<HiShieldCheck />}>
            Verify QR
          </Button>
          {verifyMsg && (
            <p
              className={cn(
                "text-center text-xs font-semibold",
                verifyMsg.startsWith("Verified")
                  ? "text-brand-success"
                  : "text-brand-danger"
              )}
            >
              {verifyMsg}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
