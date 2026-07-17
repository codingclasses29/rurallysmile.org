"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input/Input";
import { Select } from "@/components/ui/select/Select";
import type { RegistrationFormValues } from "@/schemas/registration.schema";
import { CATEGORY_OPTIONS, GENDER_OPTIONS } from "@/types/registration";
import { RegSectionTitle } from "../shared/RegSectionTitle";

export function PersonalDetailsForm() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<RegistrationFormValues>();

  return (
    <div className="space-y-5">
      <RegSectionTitle
        title="Personal Information"
        subtitle="छात्र का सही नाम और जन्म-तिथि भरे — Admit Card पर वही छपेगा।"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Student Name"
          requiredMark
          placeholder="पूरा नाम (जैसा स्कूल में है)"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Father Name"
          requiredMark
          placeholder="पिता का नाम"
          error={errors.fatherName?.message}
          {...register("fatherName")}
        />
        <Input
          label="Mother Name"
          placeholder="माता का नाम (optional)"
          error={errors.motherName?.message}
          {...register("motherName")}
        />
        <Input
          label="Date of Birth"
          type="date"
          requiredMark
          error={errors.dob?.message}
          {...register("dob")}
        />
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Select
              label="Gender"
              required
              value={field.value || ""}
              onChange={(v) => field.onChange(String(v))}
              error={errors.gender?.message}
              options={[...GENDER_OPTIONS]}
            />
          )}
        />
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select
              label="Category"
              required
              value={field.value || "General"}
              onChange={(v) => field.onChange(String(v))}
              error={errors.category?.message}
              options={[...CATEGORY_OPTIONS]}
            />
          )}
        />
      </div>
    </div>
  );
}
