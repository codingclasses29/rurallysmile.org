"use client";

import { useEffect, useState } from "react";

export function useCountdown(targetDate: string) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const tick = () =>
      setRemaining(Math.max(0, new Date(targetDate).getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  return { remaining, days, hours, minutes, seconds };
}
