import { z } from "zod";

const mobileSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Valid 10-digit mobile required (starts with 6–9)");

const optionalMobile = z
  .string()
  .trim()
  .refine((v) => v === "" || /^[6-9]\d{9}$/.test(v), {
    message: "Enter a valid 10-digit mobile",
  });

const requiredEmail = z
  .string()
  .trim()
  .min(1, "Email is required for OTP")
  .email("Enter a valid email address");

/** Part 2 — Personal Details */
export const personalDetailsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Student name is required")
    .max(80, "Name is too long"),
  fatherName: z
    .string()
    .trim()
    .min(2, "Father name is required")
    .max(80, "Name is too long"),
  motherName: z.string().trim().max(80).optional().or(z.literal("")),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z
    .string()
    .refine((v) => ["Male", "Female", "Other"].includes(v), {
      message: "Gender is required",
    }),
  category: z
    .string()
    .refine(
      (v) => ["General", "OBC", "SC", "ST", "EWS", "Other"].includes(v),
      { message: "Category is required" }
    ),
});

/** Part 3 — Address Details */
export const addressDetailsSchema = z.object({
  state: z.string().trim().min(1, "State is required"),
  district: z.string().trim().min(2, "District is required"),
  block: z.string().trim().optional().or(z.literal("")),
  village: z.string().trim().optional().or(z.literal("")),
  pinCode: z
    .string()
    .trim()
    .refine((v) => v === "" || /^\d{6}$/.test(v), {
      message: "PIN must be 6 digits",
    }),
  address: z
    .string()
    .trim()
    .min(5, "Full address is required")
    .max(300, "Address is too long"),
});

/** Part 4 — School Details */
export const schoolDetailsSchema = z.object({
  class: z
    .string()
    .refine((v) => ["8", "9", "10"].includes(v), {
      message: "Class must be 8, 9 or 10",
    }),
  schoolName: z
    .string()
    .trim()
    .min(2, "School name is required")
    .max(120, "School name is too long"),
  medium: z.string().trim().min(1, "Medium is required"),
});

/** Contact (email required — OTP sent on email) */
export const contactDetailsSchema = z.object({
  mobile: mobileSchema,
  parentMobile: optionalMobile,
  email: requiredEmail,
  whatsapp: optionalMobile,
});

/** Combined text fields submitted to API */
export const registrationFormSchema = personalDetailsSchema
  .merge(addressDetailsSchema)
  .merge(schoolDetailsSchema)
  .merge(contactDetailsSchema);

export type PersonalDetailsValues = z.infer<typeof personalDetailsSchema>;
export type AddressDetailsValues = z.infer<typeof addressDetailsSchema>;
export type SchoolDetailsValues = z.infer<typeof schoolDetailsSchema>;
export type ContactDetailsValues = z.infer<typeof contactDetailsSchema>;
export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

const imageTypes = ["image/jpeg", "image/jpg", "image/png"];
const docTypes = [...imageTypes, "application/pdf"];

function fileSchema(opts: {
  required: boolean;
  maxBytes: number;
  types: string[];
  label: string;
}) {
  return z
    .custom<File | null>((v) => v === null || v instanceof File, {
      message: `${opts.label} is invalid`,
    })
    .superRefine((file, ctx) => {
      if (!file) {
        if (opts.required) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${opts.label} is required`,
          });
        }
        return;
      }
      if (!opts.types.includes(file.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${opts.label}: allowed types JPG / PNG${
            opts.types.includes("application/pdf") ? " / PDF" : ""
          }`,
        });
      }
      if (file.size > opts.maxBytes) {
        const mb = opts.maxBytes / (1024 * 1024);
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${opts.label}: max ${mb} MB`,
        });
      }
    });
}

/** Part 5 — Photo & Signature (+ optional docs) */
export const uploadFilesSchema = z.object({
  photo: fileSchema({
    required: true,
    maxBytes: 2 * 1024 * 1024,
    types: imageTypes,
    label: "Photo",
  }),
  signature: fileSchema({
    required: true,
    maxBytes: 1 * 1024 * 1024,
    types: imageTypes,
    label: "Signature",
  }),
  schoolIdDoc: fileSchema({
    required: false,
    maxBytes: 2 * 1024 * 1024,
    types: docTypes,
    label: "School ID",
  }),
  aadhaarDoc: fileSchema({
    required: false,
    maxBytes: 2 * 1024 * 1024,
    types: docTypes,
    label: "Aadhaar",
  }),
});

export type UploadFilesValues = z.infer<typeof uploadFilesSchema>;

export const otpSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{4,6}$/, "Enter 4–6 digit OTP"),
});

export type OtpValues = z.infer<typeof otpSchema>;

export const registrationDefaults: RegistrationFormValues = {
  name: "",
  fatherName: "",
  motherName: "",
  dob: "",
  gender: "",
  category: "General",
  state: "Bihar",
  district: "Siwan",
  block: "",
  village: "",
  pinCode: "",
  address: "",
  class: "",
  schoolName: "",
  medium: "Hindi",
  mobile: "",
  parentMobile: "",
  email: "",
  whatsapp: "",
};

export const STEP_SCHEMAS = [
  personalDetailsSchema,
  addressDetailsSchema,
  schoolDetailsSchema,
  contactDetailsSchema,
] as const;
