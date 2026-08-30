import type { RegistrationFormValues } from "@/schemas/registration.schema";

export type RegistrationFiles = { photo: File | null; signature: File | null };
export type RegistrationSuccess = {
  registrationNumber: string;
  studentName: string;
  studentClass: string;
  examCentre: string;
};
export type RegistrationFormData = RegistrationFormValues;

export const REG_STEPS = [
  { id: 1, title: "Personal Details", short: "Personal", hindi: "Personal details" },
  { id: 2, title: "Address Details", short: "Address", hindi: "Address" },
  { id: 3, title: "School Details", short: "School", hindi: "School" },
  { id: 4, title: "Photo & Signature", short: "Upload", hindi: "Upload" },
  { id: 5, title: "Review", short: "Review", hindi: "Review" },
  { id: 6, title: "Complete", short: "Done", hindi: "Complete" },
] as const;

export const FORM_STEP_COUNT = 5;
export const DRAFT_KEY = "rsf_registration_draft_v2";

export const GENDER_OPTIONS = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
] as const;
export const CLASS_OPTIONS = [
  { label: "Class 7", value: "7" }, { label: "Class 8", value: "8" },
  { label: "Class 9", value: "9" }, { label: "Class 10", value: "10" },
] as const;
export const STATE_OPTIONS = [
  { label: "Bihar", value: "Bihar" }, { label: "Jharkhand", value: "Jharkhand" },
  { label: "Uttar Pradesh", value: "Uttar Pradesh" }, { label: "Other", value: "Other" },
] as const;
export const MEDIUM_OPTIONS = [
  { label: "Hindi", value: "Hindi" }, { label: "English", value: "English" },
] as const;

export const emptyFiles = (): RegistrationFiles => ({ photo: null, signature: null });
