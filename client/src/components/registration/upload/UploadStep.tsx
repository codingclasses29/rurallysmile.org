"use client";

import type { RegistrationFiles } from "@/types/registration";
import { PhotoUpload } from "./PhotoUpload";
import { SignatureUpload } from "./SignatureUpload";
import { DocumentsUpload } from "./DocumentsUpload";
import { RequiredDocsHint } from "../shared/RequiredDocsHint";
import { RegSectionTitle } from "../shared/RegSectionTitle";

type Props = {
  files: RegistrationFiles;
  errors: Partial<Record<keyof RegistrationFiles, string>>;
  onFile: (key: keyof RegistrationFiles, file: File | null) => void;
};

export function UploadStep({ files, errors, onFile }: Props) {
  return (
    <div className="space-y-5">
      <RegSectionTitle
        title="Photo & Documents"
        subtitle="Drag & drop files or click to browse. Preview appears instantly."
      />
      <RequiredDocsHint />
      <div className="grid gap-4 sm:grid-cols-2">
        <PhotoUpload
          file={files.photo}
          error={errors.photo}
          onSelect={(f) => onFile("photo", f)}
        />
        <SignatureUpload
          file={files.signature}
          error={errors.signature}
          onSelect={(f) => onFile("signature", f)}
        />
        <DocumentsUpload
          schoolIdDoc={files.schoolIdDoc}
          aadhaarDoc={files.aadhaarDoc}
          errors={{
            schoolIdDoc: errors.schoolIdDoc,
            aadhaarDoc: errors.aadhaarDoc,
          }}
          onSchoolId={(f) => onFile("schoolIdDoc", f)}
          onAadhaar={(f) => onFile("aadhaarDoc", f)}
        />
      </div>
    </div>
  );
}
