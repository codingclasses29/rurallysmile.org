"use client";

import { Button } from "@/components/ui/button/Button";
import { Alert } from "@/components/ui/alert/Alert";
import { OtpInput } from "./OtpInput";
import { OtpTimer } from "./OtpTimer";
import { RegSectionTitle } from "../shared/RegSectionTitle";

type Props = {
  email: string;
  otp: string;
  onOtp: (v: string) => void;
  onSend: () => void;
  onVerify: () => void;
  sending: boolean;
  verifying: boolean;
  otpSent: boolean;
  verified: boolean;
  cooldown: number;
  error?: string;
  hint?: string;
};

export function OtpVerification({
  email,
  otp,
  onOtp,
  onSend,
  onVerify,
  sending,
  verifying,
  otpSent,
  verified,
  cooldown,
  error,
  hint,
}: Props) {
  return (
    <div className="mx-auto max-w-md space-y-5">
      <RegSectionTitle
        title="Verify email with OTP"
        subtitle={`हम ${email || "आपके email"} पर 6-अंकों का OTP भेजेंगे। OTP 5 मिनट तक मान्य है।`}
      />

      <Alert variant="info" title="OTP Verification">
        OTP पहले email पर भेजा जाएगा। अगर server email न भेज पाए तो आपके
        registered mobile पर SMS/WhatsApp से OTP आएगा।
      </Alert>

      {hint && (
        <Alert variant="warning" title="Development OTP">
          {hint}
        </Alert>
      )}

      {verified ? (
        <Alert variant="success" title="OTP Verified">
          Email successfully verified. Click Submit Registration to finish.
        </Alert>
      ) : (
        <>
          <OtpInput
            value={otp}
            onChange={onOtp}
            disabled={!otpSent || verifying}
            error={error}
          />

          <OtpTimer remaining={cooldown} />

          <div className="flex flex-wrap justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              loading={sending}
              disabled={cooldown > 0 || !email}
              onClick={onSend}
            >
              {otpSent ? "Resend OTP" : "Send OTP"}
            </Button>
            <Button
              type="button"
              variant="success"
              loading={verifying}
              onClick={onVerify}
              disabled={!otpSent || otp.length < 4}
            >
              Verify OTP
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
