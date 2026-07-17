/** Upload constraints aligned with server middleware */
export const UPLOAD_RULES = {
  photo: {
    label: "Passport Photo",
    accept: "image/jpeg,image/jpg,image/png",
    maxBytes: 2 * 1024 * 1024,
    required: true,
    hint: "JPG / PNG · Max 2 MB · Clear face, recent photo",
  },
  signature: {
    label: "Signature",
    accept: "image/jpeg,image/jpg,image/png",
    maxBytes: 1 * 1024 * 1024,
    required: true,
    hint: "JPG / PNG · Max 1 MB · White background preferred",
  },
  schoolIdDoc: {
    label: "School ID / Bonafide",
    accept: "image/jpeg,image/jpg,image/png,application/pdf",
    maxBytes: 2 * 1024 * 1024,
    required: false,
    hint: "Optional · JPG / PNG / PDF · Max 2 MB",
  },
  aadhaarDoc: {
    label: "Aadhaar",
    accept: "image/jpeg,image/jpg,image/png,application/pdf",
    maxBytes: 2 * 1024 * 1024,
    required: false,
    hint: "Optional · JPG / PNG / PDF · Max 2 MB",
  },
} as const;

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
