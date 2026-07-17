import type { RegistrationFormValues } from "@/schemas/registration.schema";

export type RegistrationFiles = {
  photo: File | null;
  signature: File | null;
  schoolIdDoc: File | null;
  aadhaarDoc: File | null;
};

export type RegistrationSuccess = {
  registrationNumber: string;
  studentName: string;
  studentClass: string;
  examCentre: string;
  mobile?: string;
};

/** Kept for draft / legacy compat */
export type RegistrationFormData = RegistrationFormValues;

export const REG_STEPS = [
  { id: 1, title: "Personal Details", short: "Personal", hindi: "व्यक्तिगत विवरण" },
  { id: 2, title: "Address Details", short: "Address", hindi: "पता" },
  { id: 3, title: "School Details", short: "School", hindi: "स्कूल" },
  { id: 4, title: "Contact Details", short: "Contact", hindi: "संपर्क" },
  { id: 5, title: "Photo & Documents", short: "Upload", hindi: "अपलोड" },
  { id: 6, title: "Review", short: "Review", hindi: "समीक्षा" },
  { id: 7, title: "Email OTP", short: "OTP", hindi: "ईमेल OTP" },
  { id: 8, title: "Complete", short: "Done", hindi: "पूर्ण" },
] as const;

export const FORM_STEP_COUNT = 7; // excludes Complete
export const DRAFT_KEY = "rsf_registration_draft_v2";

export const GENDER_OPTIONS = [
  { label: "Male / पुरुष", value: "Male" },
  { label: "Female / महिला", value: "Female" },
  { label: "Other / अन्य", value: "Other" },
] as const;

export const CATEGORY_OPTIONS = [
  { label: "General", value: "General" },
  { label: "OBC", value: "OBC" },
  { label: "SC", value: "SC" },
  { label: "ST", value: "ST" },
  { label: "EWS", value: "EWS" },
  { label: "Other", value: "Other" },
] as const;

export const CLASS_OPTIONS = [
  { label: "Class 7", value: "7" },
  { label: "Class 8", value: "8" },
  { label: "Class 9", value: "9" },
  { label: "Class 10", value: "10" },
] as const;

export const STATE_OPTIONS = [
  { label: "Bihar", value: "Bihar" },
  { label: "Jharkhand", value: "Jharkhand" },
  { label: "Uttar Pradesh", value: "Uttar Pradesh" },
  { label: "Other", value: "Other" },
] as const;

export const MEDIUM_OPTIONS = [
  { label: "हिन्दी (Hindi)", value: "Hindi" },
  { label: "English", value: "English" },
] as const;

export const emptyFiles = (): RegistrationFiles => ({
  photo: null,
  signature: null,
  schoolIdDoc: null,
  aadhaarDoc: null,
});
