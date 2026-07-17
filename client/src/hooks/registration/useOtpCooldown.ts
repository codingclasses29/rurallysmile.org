"use client";

import { useCallback, useEffect, useState } from "react";

/** Resend OTP cooldown in seconds */
export function useOtpCooldown(seconds = 60) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = window.setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [remaining]);

  const start = useCallback(() => setRemaining(seconds), [seconds]);
  const reset = useCallback(() => setRemaining(0), []);

  return {
    remaining,
    active: remaining > 0,
    start,
    reset,
  };
}
