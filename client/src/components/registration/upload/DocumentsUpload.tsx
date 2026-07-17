"use client";

import { FileDropzone } from "./FileDropzone";

type Props = {
  schoolIdDoc: File | null;
  aadhaarDoc: File | null;
  errors?: { schoolIdDoc?: string; aadhaarDoc?: string };
  onSchoolId: (file: File | null) => void;
  onAadhaar: (file: File | null) => void;
};

export function DocumentsUpload({
  schoolIdDoc,
  aadhaarDoc,
  errors,
  onSchoolId,
  onAadhaar,
}: Props) {
  return (
    <>
      <FileDropzone
        label="School ID / Bonafide"
        accept="image/jpeg,image/jpg,image/png,application/pdf"
        hint="Optional · JPG / PNG / PDF · Max 2 MB"
        file={schoolIdDoc}
        error={errors?.schoolIdDoc}
        onSelect={onSchoolId}
      />
      <FileDropzone
        label="Aadhaar (Optional)"
        accept="image/jpeg,image/jpg,image/png,application/pdf"
        hint="Optional · JPG / PNG / PDF · Max 2 MB"
        file={aadhaarDoc}
        error={errors?.aadhaarDoc}
        onSelect={onAadhaar}
      />
    </>
  );
}
