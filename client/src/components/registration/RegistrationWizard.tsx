"use client";

import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Alert } from "@/components/ui/alert/Alert";
import { Button } from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input/Input";
import { Select } from "@/components/ui/select/Select";
import { notify } from "@/components/ui/toast/Toast";
import { Card } from "@/components/ui/card/Card";
import {
  registrationDefaults,
  registrationFormSchema,
  uploadFilesSchema,
  type RegistrationFormValues,
} from "@/schemas/registration.schema";
import {
  emptyFiles,
  CLASS_OPTIONS,
  GENDER_OPTIONS,
  type RegistrationFiles,
  type RegistrationSuccess,
} from "@/types/registration";
import { useRegistrationSubmit } from "@/hooks/registration/useRegistrationSubmit";
import { PhotoUpload } from "./upload/PhotoUpload";
import { SignatureUpload } from "./upload/SignatureUpload";
import { SuccessScreen } from "./success/SuccessScreen";
import { RegistrationHelpCard } from "./shared/RegistrationHelpCard";

export function RegistrationWizard() {
  const [files, setFiles] = useState<RegistrationFiles>(emptyFiles());
  const [uploadErrors, setUploadErrors] = useState<
    Partial<Record<keyof RegistrationFiles, string>>
  >({});
  const [success, setSuccess] = useState<RegistrationSuccess | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: registrationDefaults,
    mode: "onBlur",
  });

  const { submit, submitting, error: submitError } = useRegistrationSubmit();

  const onFile = useCallback(
    (key: keyof RegistrationFiles, file: File | null) => {
      setFiles((current) => ({ ...current, [key]: file }));
      setUploadErrors((current) => ({ ...current, [key]: undefined }));
    },
    []
  );

  const onFormSubmit = async (values: RegistrationFormValues) => {
    // Validate uploaded files
    const fileResult = uploadFilesSchema.safeParse(files);
    if (!fileResult.success) {
      const errMap: Partial<Record<keyof RegistrationFiles, string>> = {};
      fileResult.error.issues.forEach((issue) => {
        errMap[issue.path[0] as keyof RegistrationFiles] = issue.message;
      });
      setUploadErrors(errMap);
      notify.error("कृपया फोटो और हस्ताक्षर अपलोड करें");
      return;
    }

    setUploadErrors({});
    const res = await submit(values, files);
    if (res) {
      setSuccess(res);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (success) {
    return (
      <Card className="mx-auto max-w-3xl">
        <SuccessScreen result={success} />
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-teal-100 bg-gradient-to-r from-[#071d2c] via-[#0b2b3a] to-[#0f766e] p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/icons/icons.png"
              alt="Rurally Smile Foundation"
              width={120}
              height={60}
              className="h-12 w-auto rounded-lg bg-white/10 p-1 object-contain backdrop-blur-sm"
            />
            <div>
              <span className="inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-sm">
                Single Page Registration Form · एकल पृष्ठ पंजीकरण
              </span>
              <h1 className="mt-1 font-heading text-2xl font-bold sm:text-3xl">
                प्रतिभा खोज प्रतियोगिता 2026
              </h1>
            </div>
          </div>
          <div className="text-right text-xs text-cyan-200">
            <div>कक्षा 7, 8, 9, 10 (हिन्दी माध्यम)</div>
            <div className="font-semibold text-amber-300">परीक्षा तिथि: 05 सितम्बर 2026</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {submitError && (
          <Alert variant="error" title="Submission Error">
            {submitError}
          </Alert>
        )}

        {/* Section 1: School Information */}
        <Card className="border border-slate-200 shadow-sm dark:border-slate-800">
          <div className="mb-4 border-b border-slate-100 pb-3 dark:border-slate-800">
            <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-slate-900 dark:text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                1
              </span>
              विद्यालय एवं वर्ग विवरण (School &amp; Class)
            </h2>
            <p className="text-xs text-slate-500">
              वर्तमान विद्यालय का नाम और अपनी कक्षा का चयन करें।
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="1. विद्यालय का नाम (School Name)"
                requiredMark
                placeholder="पूरा विद्यालय का नाम (जैसा स्कूल में है)"
                error={errors.schoolName?.message}
                {...register("schoolName")}
              />
            </div>

            <Controller
              name="class"
              control={control}
              render={({ field }) => (
                <Select
                  label="3. वर्ग (Class)"
                  required
                  value={field.value || ""}
                  onChange={(v) => field.onChange(String(v))}
                  error={errors.class?.message}
                  options={[...CLASS_OPTIONS]}
                />
              )}
            />

            <Input
              label="4. क्रमांक (School Roll No. - वैकल्पिक)"
              placeholder="स्कूल का रोल नंबर (उदा. 15)"
              error={errors.schoolRollNo?.message}
              {...register("schoolRollNo")}
            />
          </div>
        </Card>

        {/* Section 2: Student & Parent Details */}
        <Card className="border border-slate-200 shadow-sm dark:border-slate-800">
          <div className="mb-4 border-b border-slate-100 pb-3 dark:border-slate-800">
            <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-slate-900 dark:text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                2
              </span>
              विद्यार्थी एवं अभिभावक विवरण (Student &amp; Parent Details)
            </h2>
            <p className="text-xs text-slate-500">
              छात्र का नाम, पिता का नाम और संपर्क विवरण सही-सही भरें — Admit Card पर यही विवरण छपेगा।
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="2. विद्यार्थी का नाम (Student Name)"
              requiredMark
              placeholder="विद्यार्थी का पूरा नाम"
              error={errors.name?.message}
              {...register("name")}
            />

            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  label="लिंग (Gender: Male / Female)"
                  required
                  value={field.value || ""}
                  onChange={(v) => field.onChange(String(v))}
                  error={errors.gender?.message}
                  options={[...GENDER_OPTIONS]}
                />
              )}
            />

            <Input
              label="5. पिता का नाम (Father's Name)"
              requiredMark
              placeholder="पिता का पूरा नाम"
              error={errors.fatherName?.message}
              {...register("fatherName")}
            />

            <Input
              label="6. दूरभाष संख्या (Mobile Number)"
              requiredMark
              inputMode="numeric"
              maxLength={10}
              placeholder="10 अंकों का मोबाइल नंबर (उदा. 9934276672)"
              error={errors.mobile?.message}
              {...register("mobile", {
                onChange: (e) =>
                  setValue("mobile", e.target.value.replace(/\D/g, "").slice(0, 10), {
                    shouldValidate: true,
                  }),
              })}
            />

            <div className="sm:col-span-2">
              <Input
                label="7. ग्राम + पोस्ट (Village + Post)"
                requiredMark
                placeholder="उदा. ग्राम - रतनपुरा, पोस्ट - रतनपुरा, जिला - सीवान"
                error={errors.villagePost?.message}
                {...register("villagePost")}
              />
            </div>

            <Input
              label="जन्म तिथि (Date of Birth - वैकल्पिक)"
              type="date"
              error={errors.dob?.message}
              {...register("dob")}
            />

            <Input
              label="माता का नाम (Mother's Name - वैकल्पिक)"
              placeholder="माता का नाम"
              error={errors.motherName?.message}
              {...register("motherName")}
            />
          </div>
        </Card>

        {/* Section 3: Photo & Signature Upload */}
        <Card className="border border-slate-200 shadow-sm dark:border-slate-800">
          <div className="mb-4 border-b border-slate-100 pb-3 dark:border-slate-800">
            <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-slate-900 dark:text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                3
              </span>
              दस्तावेज़ अपलोड (Photo &amp; Signature)
            </h2>
            <p className="text-xs text-slate-500">
              Admit Card और Marksheet पर प्रिंट के लिए साफ फोटो और हस्ताक्षर अपलोड करें।
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <PhotoUpload
              file={files.photo}
              error={uploadErrors.photo}
              onSelect={(f) => onFile("photo", f)}
            />
            <SignatureUpload
              file={files.signature}
              error={uploadErrors.signature}
              onSelect={(f) => onFile("signature", f)}
            />
          </div>
        </Card>

        {/* Section 4: System Generated Pratibha Khoj Roll No Notice */}
        <div className="rounded-2xl border border-teal-200 bg-teal-50/80 p-4 text-slate-800 dark:border-teal-900 dark:bg-slate-900 dark:text-teal-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📋</span>
            <div className="text-sm">
              <p className="font-bold text-teal-900 dark:text-teal-300">
                8. प्रतिभा खोज प्रतियोगिता का क्रमांक (Pratibha Khoj Roll No)
              </p>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                प्रतिभा खोज परीक्षा का अनुक्रमांक (Roll No.) और Registration Number फॉर्म सबमिट
                करने पर सिस्टम द्वारा तुरंत और स्वतः जनरेट हो जाएगा तथा रसीद एवं एडमिट कार्ड पर
                उपलब्ध रहेगा।
              </p>
            </div>
          </div>
        </div>

        {/* Single Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="success"
            size="lg"
            fullWidth
            loading={submitting}
            className="py-4 text-lg font-bold shadow-lg transition-transform hover:scale-[1.01]"
          >
            {submitting ? "पंजीकरण जमा हो रहा है..." : "पंजीकरण जमा करें (Submit Registration) →"}
          </Button>
          <p className="mt-2 text-center text-xs text-slate-500">
            सबमिट करने के बाद आपकी पंजीकरण रसीद (PDF Receipt) तुरंत तैयार हो जाएगी।
          </p>
        </div>
      </form>

      <RegistrationHelpCard />
    </div>
  );
}
