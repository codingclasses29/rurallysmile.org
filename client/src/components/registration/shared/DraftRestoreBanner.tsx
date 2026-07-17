"use client";

import { Alert } from "@/components/ui/alert/Alert";
import { Button } from "@/components/ui/button/Button";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onContinue: () => void;
};

export function DraftRestoreBanner({ visible, onDismiss, onContinue }: Props) {
  if (!visible) return null;

  return (
    <Alert variant="info" className="mb-4" title="Draft found on this device">
      <p className="mb-3 text-sm">
        पिछला अधूरा आवेदन मिला। Continue करें या नया शुरू करें।
      </p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={onContinue}>
          Continue draft
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onDismiss}>
          Start fresh
        </Button>
      </div>
    </Alert>
  );
}
