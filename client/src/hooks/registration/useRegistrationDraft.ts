"use client";

import { useCallback, useEffect, useState } from "react";
import { DRAFT_KEY } from "@/types/registration";
import type { RegistrationFormValues } from "@/schemas/registration.schema";
import { registrationDefaults } from "@/schemas/registration.schema";

type DraftPayload = {
  values: RegistrationFormValues;
  step: number;
  updatedAt: string;
};

export function useRegistrationDraft(
  values: RegistrationFormValues,
  step: number,
  enabled: boolean
) {
  const [hydrated, setHydrated] = useState(false);
  const [restored, setRestored] = useState<{
    values: RegistrationFormValues;
    step: number;
  } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<DraftPayload>;
        if (parsed.values) {
          setRestored({
            values: { ...registrationDefaults, ...parsed.values },
            step: parsed.step && parsed.step < 8 ? parsed.step : 1,
          });
        }
      }
    } catch {
      /* ignore corrupt draft */
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!enabled || !hydrated) return;
    const id = window.setTimeout(() => {
      try {
        const payload: DraftPayload = {
          values,
          step,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
      } catch {
        /* quota / private mode */
      }
    }, 600);
    return () => window.clearTimeout(id);
  }, [values, step, enabled, hydrated]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return { hydrated, restored, clearDraft };
}
