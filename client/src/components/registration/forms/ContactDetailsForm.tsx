"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input/Input";
import type { RegistrationFormValues } from "@/schemas/registration.schema";
import { RegSectionTitle } from "../shared/RegSectionTitle";

export function ContactDetailsForm() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<RegistrationFormValues>();

  const digits =
    (field: "mobile" | "parentMobile" | "whatsapp") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(field, e.target.value.replace(/\D/g, "").slice(0, 10), {
        shouldValidate: true,
        shouldDirty: true,
      });
    };

  return (
    <div className="space-y-5">
      <RegSectionTitle
        title="Contact Details"
        subtitle="OTP आपके Email पर भेजा जाएगा। Email सही और सक्रिय रखें।"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Email (OTP)"
          type="email"
          requiredMark
          placeholder="student@email.com"
          hint="Registration OTP इसी email पर आएगा"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Student Mobile"
          requiredMark
          placeholder="10-digit mobile"
          inputMode="numeric"
          maxLength={10}
          error={errors.mobile?.message}
          {...register("mobile")}
          onChange={digits("mobile")}
        />
        <Input
          label="Parent Mobile"
          placeholder="Optional"
          inputMode="numeric"
          maxLength={10}
          error={errors.parentMobile?.message}
          {...register("parentMobile")}
          onChange={digits("parentMobile")}
        />
        <Input
          label="WhatsApp Number"
          placeholder="Same as mobile if blank"
          inputMode="numeric"
          maxLength={10}
          hint="खाली छोड़ने पर Student Mobile उपयोग होगा"
          error={errors.whatsapp?.message}
          {...register("whatsapp")}
          onChange={digits("whatsapp")}
        />
      </div>
    </div>
  );
}
