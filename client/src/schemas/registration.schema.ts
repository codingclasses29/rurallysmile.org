import { z } from "zod";

export const personalDetailsSchema = z.object({
  name: z.string().trim().min(2, "Student name is required").max(80, "Name is too long"),
  fatherName: z.string().trim().min(2, "Father name is required").max(80, "Name is too long"),
  motherName: z.string().trim().max(80).optional().or(z.literal("")),
  dob: z.string().optional().or(z.literal("")),
  gender: z.string().refine((v) => ["Male", "Female", "Other"].includes(v), { message: "Gender is required" }),
});

export const addressDetailsSchema = z.object({
  state: z.string().trim().min(1, "State is required"),
  district: z.string().trim().min(2, "District is required"),
  block: z.string().trim().optional().or(z.literal("")),
  village: z.string().trim().optional().or(z.literal("")),
  villagePost: z.string().trim().optional().or(z.literal("")),
  pinCode: z.string().trim().refine((v) => v === "" || /^\d{6}$/.test(v), { message: "PIN must be 6 digits" }).optional().or(z.literal("")),
});

export const schoolDetailsSchema = z.object({
  class: z.string().refine((v) => ["7", "8", "9", "10"].includes(v), { message: "Class must be 7, 8, 9 or 10" }),
  schoolName: z.string().trim().min(2, "School name is required").max(120, "School name is too long"),
  schoolRollNo: z.string().trim().optional().or(z.literal("")),
  medium: z.string().trim().default("Hindi"),
});

export const registrationFormSchema = z.object({
  // 1. विद्यालय का नाम (School Name)
  schoolName: z
    .string()
    .trim()
    .min(2, "School name is required / विद्यालय का नाम आवश्यक है")
    .max(120, "School name is too long"),

  // 2. विद्यार्थी का नाम (Student Name) & लिंग (Gender)
  name: z
    .string()
    .trim()
    .min(2, "Student name is required / विद्यार्थी का नाम आवश्यक है")
    .max(80, "Name is too long"),
  gender: z
    .string()
    .refine((v) => ["Male", "Female", "Other"].includes(v), {
      message: "Gender is required / लिंग चुनें (Male/Female)",
    }),

  // 3. वर्ग (Class)
  class: z
    .string()
    .refine((v) => ["7", "8", "9", "10"].includes(v), {
      message: "Class must be 7, 8, 9 or 10 / कक्षा 7, 8, 9 या 10 चुनें",
    }),

  // 4. क्रमांक (Roll no.) [School Roll Number]
  schoolRollNo: z.string().trim().optional().or(z.literal("")),

  // 5. पिता का नाम (Father's Name)
  fatherName: z
    .string()
    .trim()
    .min(2, "Father name is required / पिता का नाम आवश्यक है")
    .max(80, "Father name is too long"),

  // 6. दूरभाष संख्या (Mobile Number)
  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter valid 10-digit mobile number / 10 अंकों का वैध मोबाइल नंबर भरें"),

  // 7. ग्राम + पोस्ट (Village + Post)
  villagePost: z
    .string()
    .trim()
    .min(2, "Village + Post is required / ग्राम + पोस्ट आवश्यक है")
    .max(150, "Address is too long"),

  // Optional supporting fields
  block: z.string().trim().optional().or(z.literal("")),
  village: z.string().trim().optional().or(z.literal("")),
  motherName: z.string().trim().max(80).optional().or(z.literal("")),
  dob: z.string().optional().or(z.literal("")),
  medium: z.string().trim().default("Hindi"),
  district: z.string().trim().default("Siwan"),
  state: z.string().trim().default("Bihar"),
  pinCode: z
    .string()
    .trim()
    .refine((v) => v === "" || /^\d{6}$/.test(v), { message: "PIN must be 6 digits" })
    .optional()
    .or(z.literal("")),
});

export type PersonalDetailsValues = z.infer<typeof personalDetailsSchema>;
export type AddressDetailsValues = z.infer<typeof addressDetailsSchema>;
export type SchoolDetailsValues = z.infer<typeof schoolDetailsSchema>;
export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

const imageTypes = ["image/jpeg", "image/jpg", "image/png"];
function fileSchema(opts: {
  required: boolean;
  maxBytes: number;
  types: string[];
  label: string;
}) {
  return z
    .custom<File | null>(
      (v) => v === null || v instanceof File,
      { message: `${opts.label} is invalid` }
    )
    .superRefine((file, ctx) => {
      if (!file) {
        if (opts.required)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${opts.label} is required / ${opts.label} अपलोड करना अनिवार्य है`,
          });
        return;
      }
      if (!opts.types.includes(file.type))
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${opts.label}: allowed types JPG / PNG`,
        });
      if (file.size > opts.maxBytes)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${opts.label}: max ${opts.maxBytes / 1024 / 1024} MB`,
        });
    });
}

export const uploadFilesSchema = z.object({
  photo: fileSchema({
    required: true,
    maxBytes: 2 * 1024 * 1024,
    types: imageTypes,
    label: "Student Photo (फोटो)",
  }),
  signature: fileSchema({
    required: true,
    maxBytes: 1 * 1024 * 1024,
    types: imageTypes,
    label: "Signature (हस्ताक्षर)",
  }),
});

export type UploadFilesValues = z.infer<typeof uploadFilesSchema>;

export const registrationDefaults: RegistrationFormValues = {
  schoolName: "",
  name: "",
  gender: "",
  class: "",
  schoolRollNo: "",
  fatherName: "",
  mobile: "",
  villagePost: "",
  block: "",
  village: "",
  motherName: "",
  dob: "",
  medium: "Hindi",
  district: "Siwan",
  state: "Bihar",
  pinCode: "",
};

export const STEP_SCHEMAS = [personalDetailsSchema, addressDetailsSchema, schoolDetailsSchema] as const;
