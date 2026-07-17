"use client";

import { FileDropzone } from "./FileDropzone";

type Props = {
  file: File | null;
  error?: string;
  onSelect: (file: File | null) => void;
};

export function SignatureUpload({ file, error, onSelect }: Props) {
  return (
    <FileDropzone
      label="Signature"
      required
      accept="image/jpeg,image/jpg,image/png"
      hint="JPG / PNG · Max 1 MB · White background preferred"
      file={file}
      error={error}
      onSelect={onSelect}
      previewShape="wide"
    />
  );
}
