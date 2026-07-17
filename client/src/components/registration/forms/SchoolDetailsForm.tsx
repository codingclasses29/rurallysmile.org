"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input/Input";
import { Select } from "@/components/ui/select/Select";
import type { RegistrationFormValues } from "@/schemas/registration.schema";
import { CLASS_OPTIONS, MEDIUM_OPTIONS } from "@/types/registration";
import { RegSectionTitle } from "../shared/RegSectionTitle";

export function SchoolDetailsForm() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<RegistrationFormValues>();

  return (
    <div className="space-y-5">
      <RegSectionTitle
        title="School Information"
        subtitle="वर्तमान कक्षा और विद्यालय का नाम सही भरें।"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          name="class"
          control={control}
          render={({ field }) => (
            <Select
              label="Class"
              required
              value={field.value || ""}
              onChange={(v) => field.onChange(String(v))}
              error={errors.class?.message}
              options={[...CLASS_OPTIONS]}
            />
          )}
        />
        <Controller
          name="medium"
          control={control}
          render={({ field }) => (
            <Select
              label="Medium"
              required
              value={field.value || "Hindi"}
              onChange={(v) => field.onChange(String(v))}
              error={errors.medium?.message}
              options={[...MEDIUM_OPTIONS]}
            />
          )}
        />
        <div className="sm:col-span-2">
          <Input
            label="School Name"
            requiredMark
            placeholder="विद्यालय का पूरा नाम"
            error={errors.schoolName?.message}
            {...register("schoolName")}
          />
        </div>
      </div>
    </div>
  );
}
