"use client";

import { useCallback, useState } from "react";
import { registrationService } from "@/services/registration.service";
import { notify } from "@/components/ui/toast/Toast";
import { SITE } from "@/constants/site";
import type { RegistrationFormValues } from "@/schemas/registration.schema";
import type { RegistrationFiles, RegistrationSuccess } from "@/types/registration";

function errMessage(err: unknown, fallback: string) {
  if (typeof err === "object" && err && "message" in err) {
    return String((err as { message: string }).message);
  }
  return fallback;
}

export function useRegistrationSubmit() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = useCallback(
    async (
      values: RegistrationFormValues,
      files: RegistrationFiles,
    ): Promise<RegistrationSuccess | null> => {
      setSubmitting(true);
      setError("");
      try {
        const fd = new FormData();
        Object.entries(values).forEach(([k, v]) => {
          if (v !== undefined && v !== null && String(v).length) {
            fd.append(k, String(v));
          }
        });
        if (files.photo) fd.append("photo", files.photo);
        if (files.signature) fd.append("signature", files.signature);

        const res = await registrationService.submit(fd);
        const regNo =
          res.registrationNumber || res.data?.registrationNumber || "";

        notify.registrationSuccess();

        return {
          registrationNumber: regNo,
          studentName: values.name,
          studentClass: values.class,
          examCentre: SITE.examCentre,
        };
      } catch (err) {
        const message = errMessage(err, "Registration failed");
        setError(message);
        notify.error(message);
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  return { submit, submitting, error, setError };
}
