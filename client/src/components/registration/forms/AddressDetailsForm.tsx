"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input/Input";
import { Textarea } from "@/components/ui/textarea/Textarea";
import { Select } from "@/components/ui/select/Select";
import type { RegistrationFormValues } from "@/schemas/registration.schema";
import { STATE_OPTIONS } from "@/types/registration";
import { RegSectionTitle } from "../shared/RegSectionTitle";

export function AddressDetailsForm() {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<RegistrationFormValues>();

  return (
    <div className="space-y-5">
      <RegSectionTitle
        title="Permanent Address"
        subtitle="जिला और पूरा पता अनिवार्य है — परीक्षा केंद्र जानकारी के लिए।"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <Select
              label="State"
              required
              value={field.value || "Bihar"}
              onChange={(v) => field.onChange(String(v))}
              error={errors.state?.message}
              options={[...STATE_OPTIONS]}
            />
          )}
        />
        <Input
          label="District"
          requiredMark
          placeholder="सीवान"
          error={errors.district?.message}
          {...register("district")}
        />
        <Input
          label="Block"
          placeholder="Block / प्रखंड"
          error={errors.block?.message}
          {...register("block")}
        />
        <Input
          label="Village / Town"
          placeholder="गाँव / कस्बा"
          error={errors.village?.message}
          {...register("village")}
        />
        <Input
          label="PIN Code"
          placeholder="841226"
          inputMode="numeric"
          maxLength={6}
          error={errors.pinCode?.message}
          {...register("pinCode", {
            onChange: (e) =>
              setValue(
                "pinCode",
                e.target.value.replace(/\D/g, "").slice(0, 6),
                { shouldValidate: true }
              ),
          })}
        />
        <div className="sm:col-span-2">
          <Textarea
            label="Full Address"
            requiredMark
            rows={3}
            placeholder="मकान नं., गली, पोस्ट..."
            error={errors.address?.message}
            {...register("address")}
          />
        </div>
      </div>
    </div>
  );
}
