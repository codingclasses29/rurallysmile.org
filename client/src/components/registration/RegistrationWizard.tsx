"use client";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "@/components/ui/alert/Alert";
import { Button } from "@/components/ui/button/Button";
import { notify } from "@/components/ui/toast/Toast";
import { registrationDefaults, registrationFormSchema, personalDetailsSchema, addressDetailsSchema, schoolDetailsSchema, uploadFilesSchema, type RegistrationFormValues } from "@/schemas/registration.schema";
import { emptyFiles, type RegistrationFiles, type RegistrationSuccess } from "@/types/registration";
import { useRegistrationDraft } from "@/hooks/registration/useRegistrationDraft";
import { useRegistrationSubmit } from "@/hooks/registration/useRegistrationSubmit";
import { MultiStepLayout } from "./layout/MultiStepLayout";
import { StepNavigation } from "./navigation/StepNavigation";
import { PersonalDetailsForm } from "./forms/PersonalDetailsForm";
import { AddressDetailsForm } from "./forms/AddressDetailsForm";
import { SchoolDetailsForm } from "./forms/SchoolDetailsForm";
import { UploadStep } from "./upload/UploadStep";
import { ReviewScreen } from "./review/ReviewScreen";
import { SuccessScreen } from "./success/SuccessScreen";
import { DraftRestoreBanner } from "./shared/DraftRestoreBanner";
import { RegistrationHelpCard } from "./shared/RegistrationHelpCard";
import { Card } from "@/components/ui/card/Card";

export function RegistrationWizard() {
  const [step, setStep] = useState(1), [files, setFiles] = useState<RegistrationFiles>(emptyFiles());
  const [uploadErrors, setUploadErrors] = useState<Partial<Record<keyof RegistrationFiles, string>>>({});
  const [success, setSuccess] = useState<RegistrationSuccess | null>(null), [showDraftBanner, setShowDraftBanner] = useState(false), [draftHandled, setDraftHandled] = useState(false);
  const methods = useForm<RegistrationFormValues>({ resolver: zodResolver(registrationFormSchema), defaultValues: registrationDefaults, mode: "onBlur" });
  const { hydrated, restored, clearDraft } = useRegistrationDraft(methods.watch(), step, !success && draftHandled);
  const { submit, submitting, error: submitError } = useRegistrationSubmit();
  useEffect(() => { if (!hydrated || draftHandled) return; if (restored) setShowDraftBanner(true); else setDraftHandled(true); }, [hydrated, restored, draftHandled]);
  const onFile = useCallback((key: keyof RegistrationFiles, file: File | null) => { setFiles((current) => ({ ...current, [key]: file })); setUploadErrors((current) => ({ ...current, [key]: undefined })); }, []);
  const validateCurrentStep = () => {
    const schema = step === 1 ? personalDetailsSchema : step === 2 ? addressDetailsSchema : step === 3 ? schoolDetailsSchema : null;
    if (schema) { const result = schema.safeParse(methods.getValues()); if (result.success) return true; result.error.issues.forEach((issue) => methods.setError(issue.path[0] as keyof RegistrationFormValues, { message: issue.message })); return false; }
    if (step !== 4) return true;
    const result = uploadFilesSchema.safeParse(files);
    if (result.success) { setUploadErrors({}); return true; }
    const errors: Partial<Record<keyof RegistrationFiles, string>> = {};
    result.error.issues.forEach((issue) => { errors[issue.path[0] as keyof RegistrationFiles] = issue.message; }); setUploadErrors(errors); return false;
  };
  const next = () => { if (!validateCurrentStep()) { notify.error("Please fix the highlighted fields"); return; } setStep((current) => Math.min(5, current + 1)); };
  const submitRegistration = async () => { const result = await submit(methods.getValues(), files); if (result) { clearDraft(); setSuccess(result); setStep(6); } };
  if (success && step === 6) return <Card className="mx-auto max-w-3xl"><SuccessScreen result={success} /></Card>;
  return <><FormProvider {...methods}><MultiStepLayout step={step} onJump={(target) => { if (target < step) setStep(target); }}>
    <DraftRestoreBanner visible={showDraftBanner && !!restored} onContinue={() => { if (restored) { methods.reset(restored.values); setStep(Math.min(restored.step, 5)); } setShowDraftBanner(false); setDraftHandled(true); }} onDismiss={() => { clearDraft(); methods.reset(registrationDefaults); setStep(1); setShowDraftBanner(false); setDraftHandled(true); }} />
    {submitError && <Alert variant="error" className="mb-4" title="Error">{submitError}</Alert>}
    {step === 1 && <PersonalDetailsForm />}{step === 2 && <AddressDetailsForm />}{step === 3 && <SchoolDetailsForm />}{step === 4 && <UploadStep files={files} errors={uploadErrors} onFile={onFile} />}{step === 5 && <ReviewScreen values={methods.getValues()} files={files} onEdit={setStep} />}
    <StepNavigation step={step} onBack={() => setStep((current) => Math.max(1, current - 1))} onNext={next} showNext={step < 5} loading={submitting} rightSlot={step === 5 ? <Button type="button" variant="success" loading={submitting} onClick={submitRegistration}>Submit Registration</Button> : undefined} />
  </MultiStepLayout></FormProvider><RegistrationHelpCard /></>;
}
