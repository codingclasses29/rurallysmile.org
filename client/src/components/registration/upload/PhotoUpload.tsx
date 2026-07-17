"use client";

import { FileDropzone } from "./FileDropzone";

type Props = {
  file: File | null;
  error?: string;
  onSelect: (file: File | null) => void;
};

export function PhotoUpload({ file, error, onSelect }: Props) {
  return (
    <FileDropzone
      label="Passport Photo"
      required
      accept="image/jpeg,image/jpg,image/png"
      hint="JPG / PNG · Max 2 MB · Clear face"
      file={file}
      error={error}
      onSelect={onSelect}
      previewShape="square"
    />
  );
}
