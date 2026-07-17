"use client";

import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "@/components/ui/alert/Alert";
import { Button } from "@/components/ui/button/Button";
import { notify } from "@/components/ui/toast/Toast";
import { registrationService } from "@/services/registration.service";
import {
  registrationDefaults,
  registrationFormSchema,
  personalDetailsSchema,
  addressDetailsSchema,
  schoolDetailsSchema,
  contactDetailsSchema,
  uploadFilesSchema,
  type RegistrationFormValues,
} from "@/schemas/registration.schema";
import {
  emptyFiles,
  type RegistrationFiles,
  type RegistrationSuccess,
} from "@/types/registration";
import { useRegistrationDraft } from "@/hooks/registration/useRegistrationDraft";
import { useOtpCooldown } from "@/hooks/registration/useOtpCooldown";
import { useRegistrationSubmit } from "@/hooks/registration/useRegistrationSubmit";
import { MultiStepLayout } from "./layout/MultiStepLayout";
import { StepNavigation } from "./navigation/StepNavigation";
import { PersonalDetailsForm } from "./forms/PersonalDetailsForm";
import { AddressDetailsForm } from "./forms/AddressDetailsForm";
import { SchoolDetailsForm } from "./forms/SchoolDetailsForm";
import { ContactDetailsForm } from "./forms/ContactDetailsForm";
import { UploadStep } from "./upload/UploadStep";
import { ReviewScreen } from "./review/ReviewScreen";
import { OtpVerification } from "./otp/OtpVerification";
import { SuccessScreen } from "./success/SuccessScreen";
import { DraftRestoreBanner } from "./shared/DraftRestoreBanner";
import { RegistrationHelpCard } from "./shared/RegistrationHelpCard";
import { Card } from "@/components/ui/card/Card";

function errMessage(err: unknown, fallback: string) {
  if (typeof err === "object" && err && "message" in err) {
    return String((err as { message: string }).message);
  }
  return fallback;
}

export function RegistrationWizard() {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<RegistrationFiles>(emptyFiles());
  const [uploadErrors, setUploadErrors] = useState<
    Partial<Record<keyof RegistrationFiles, string>>
  >({});
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [devOtp, setDevOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [success, setSuccess] = useState<RegistrationSuccess | null>(null);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [draftHandled, setDraftHandled] = useState(false);

  const methods = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: registrationDefaults,
    mode: "onBlur",
  });

  const values = methods.watch();
  const { hydrated, restored, clearDraft } = useRegistrationDraft(
    values,
    step,
    !success && draftHandled
  );
  const cooldown = useOtpCooldown(60);
  const { submit, submitting, error: submitError, setError } =
    useRegistrationSubmit();

  useEffect(() => {
    if (!hydrated || draftHandled) return;
    if (restored) {
      setShowDraftBanner(true);
    } else {
      setDraftHandled(true);
    }
  }, [hydrated, restored, draftHandled]);

  const onFile = useCallback(
    (key: keyof RegistrationFiles, file: File | null) => {
      setFiles((f) => ({ ...f, [key]: file }));
      setUploadErrors((e) => ({ ...e, [key]: undefined }));
    },
    []
  );

  const validateCurrentStep = async () => {
    if (step === 1) {
      const r = personalDetailsSchema.safeParse(methods.getValues());
      if (!r.success) {
        r.error.issues.forEach((i) => {
          const path = i.path[0] as keyof RegistrationFormValues;
          methods.setError(path, { message: i.message });
        });
        return false;
      }
      return true;
    }
    if (step === 2) {
      const r = addressDetailsSchema.safeParse(methods.getValues());
      if (!r.success) {
        r.error.issues.forEach((i) => {
          methods.setError(i.path[0] as keyof RegistrationFormValues, {
            message: i.message,
          });
        });
        return false;
      }
      return true;
    }
    if (step === 3) {
      const r = schoolDetailsSchema.safeParse(methods.getValues());
      if (!r.success) {
        r.error.issues.forEach((i) => {
          methods.setError(i.path[0] as keyof RegistrationFormValues, {
            message: i.message,
          });
        });
        return false;
      }
      return true;
    }
    if (step === 4) {
      const r = contactDetailsSchema.safeParse(methods.getValues());
      if (!r.success) {
        r.error.issues.forEach((i) => {
          methods.setError(i.path[0] as keyof RegistrationFormValues, {
            message: i.message,
          });
        });
        return false;
      }
      return true;
    }
    if (step === 5) {
      const r = uploadFilesSchema.safeParse(files);
      if (!r.success) {
        const next: Partial<Record<keyof RegistrationFiles, string>> = {};
        r.error.issues.forEach((i) => {
          const key = i.path[0] as keyof RegistrationFiles;
          next[key] = i.message;
        });
        setUploadErrors(next);
        return false;
      }
      setUploadErrors({});
      return true;
    }
    return true;
  };

  const next = async () => {
    const ok = await validateCurrentStep();
    if (!ok) {
      notify.error("Please fix the highlighted fields");
      return;
    }
    setStep((s) => Math.min(7, s + 1));
  };

  const back = () => setStep((s) => Math.max(1, s - 1));

  const jump = (target: number) => {
    if (target < step) setStep(target);
  };

  const sendOtp = async () => {
    setSendingOtp(true);
    setError("");
    setOtpError("");
    try {
      const email = methods.getValues("email");
      if (!email?.trim()) {
        throw new Error("Email required — go back to Contact step");
      }
      const res = await registrationService.sendOtp(email.trim());
      setOtpSent(true);
      cooldown.start();
      if (res.data?.devOtp) setDevOtp(res.data.devOtp);
      notify.success(res.message || "OTP sent to email");
    } catch (err) {
      const message = errMessage(err, "OTP send failed");
      setError(message);
      notify.error(message);
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    setVerifyingOtp(true);
    setOtpError("");
    try {
      const email = methods.getValues("email");
      await registrationService.verifyOtp(email.trim(), otp);
      setOtpVerified(true);
      notify.success("Email OTP verified");
    } catch (err) {
      const message = errMessage(err, "OTP verify failed");
      setOtpError(message);
      notify.error(message);
    } finally {
      setVerifyingOtp(false);
    }
  };

  const onSubmitRegistration = async () => {
    if (!otpVerified) {
      setError("Please verify OTP first");
      notify.error("Please verify OTP first");
      return;
    }
    const result = await submit(methods.getValues(), files, otp);
    if (result) {
      clearDraft();
      setSuccess(result);
      setStep(8);
    }
  };

  if (success && step === 8) {
    return (
      <Card className="mx-auto max-w-3xl">
        <SuccessScreen result={success} />
      </Card>
    );
  }

  return (
    <>
      <FormProvider {...methods}>
        <MultiStepLayout step={step} onJump={jump}>
          <DraftRestoreBanner
            visible={showDraftBanner && !!restored}
            onContinue={() => {
              if (restored) {
                methods.reset(restored.values);
                setStep(restored.step);
              }
              setShowDraftBanner(false);
              setDraftHandled(true);
            }}
            onDismiss={() => {
              clearDraft();
              methods.reset(registrationDefaults);
              setStep(1);
              setShowDraftBanner(false);
              setDraftHandled(true);
            }}
          />

          {(submitError || otpError) && step !== 7 && (
            <Alert variant="error" className="mb-4" title="Error">
              {submitError || otpError}
            </Alert>
          )}
          {submitError && step === 7 && (
            <Alert variant="error" className="mb-4" title="Error">
              {submitError}
            </Alert>
          )}

          {step === 1 && <PersonalDetailsForm />}
          {step === 2 && <AddressDetailsForm />}
          {step === 3 && <SchoolDetailsForm />}
          {step === 4 && <ContactDetailsForm />}
          {step === 5 && (
            <UploadStep files={files} errors={uploadErrors} onFile={onFile} />
          )}
          {step === 6 && (
            <ReviewScreen
              values={methods.getValues()}
              files={files}
              onEdit={setStep}
            />
          )}
          {step === 7 && (
            <OtpVerification
              email={methods.getValues("email")}
              otp={otp}
              onOtp={setOtp}
              onSend={sendOtp}
              onVerify={verifyOtp}
              sending={sendingOtp}
              verifying={verifyingOtp}
              otpSent={otpSent}
              verified={otpVerified}
              cooldown={cooldown.remaining}
              error={otpError}
              hint={devOtp ? `Development OTP: ${devOtp}` : undefined}
            />
          )}

          <StepNavigation
            step={step}
            onBack={back}
            onNext={next}
            nextLabel={
              step === 6
                ? "Confirm & Continue"
                : step === 7
                  ? "Submit Registration"
                  : "Next Step"
            }
            showNext={step < 7}
            loading={submitting}
            rightSlot={
              step === 7 ? (
                <Button
                  type="button"
                  variant="success"
                  loading={submitting}
                  disabled={!otpVerified}
                  onClick={onSubmitRegistration}
                >
                  Submit Registration
                </Button>
              ) : undefined
            }
          />

          <p className="mt-4 text-center text-[11px] text-slate-400">
            Draft auto-saved on this device · Photo, Signature & Mobile required
            · React Hook Form + Zod validated
          </p>
        </MultiStepLayout>
      </FormProvider>
      <RegistrationHelpCard />
    </>
  );
}
