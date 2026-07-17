"use client";

type Props = {
  remaining: number;
};

export function OtpTimer({ remaining }: Props) {
  if (remaining <= 0) return null;
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  return (
    <p className="text-center text-xs font-semibold text-slate-500">
      Resend available in{" "}
      <span className="font-mono text-brand-secondary">
        {m}:{s.toString().padStart(2, "0")}
      </span>
    </p>
  );
}
