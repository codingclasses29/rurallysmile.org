import { z } from "zod";

export const personalDetailsSchema = z.object({
  name: z.string().trim().min(2, "Student name is required").max(80, "Name is too long"),
  fatherName: z.string().trim().min(2, "Father name is required").max(80, "Name is too long"),
  motherName: z.string().trim().max(80).optional().or(z.literal("")),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().refine((v) => ["Male", "Female", "Other"].includes(v), { message: "Gender is required" }),
});
export const addressDetailsSchema = z.object({
  state: z.string().trim().min(1, "State is required"),
  district: z.string().trim().min(2, "District is required"),
  block: z.string().trim().optional().or(z.literal("")),
  village: z.string().trim().optional().or(z.literal("")),
  pinCode: z.string().trim().refine((v) => v === "" || /^\d{6}$/.test(v), { message: "PIN must be 6 digits" }),
});
export const schoolDetailsSchema = z.object({
  class: z.string().refine((v) => ["7", "8", "9", "10"].includes(v), { message: "Class must be 7, 8, 9 or 10" }),
  schoolName: z.string().trim().min(2, "School name is required").max(120, "School name is too long"),
  medium: z.string().trim().min(1, "Medium is required"),
});
export const registrationFormSchema = personalDetailsSchema.merge(addressDetailsSchema).merge(schoolDetailsSchema);
export type PersonalDetailsValues = z.infer<typeof personalDetailsSchema>;
export type AddressDetailsValues = z.infer<typeof addressDetailsSchema>;
export type SchoolDetailsValues = z.infer<typeof schoolDetailsSchema>;
export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

const imageTypes = ["image/jpeg", "image/jpg", "image/png"];
function fileSchema(opts: { required: boolean; maxBytes: number; types: string[]; label: string }) {
  return z.custom<File | null>((v) => v === null || v instanceof File, { message: `${opts.label} is invalid` }).superRefine((file, ctx) => {
    if (!file) {
      if (opts.required) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${opts.label} is required` });
      return;
    }
    if (!opts.types.includes(file.type)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${opts.label}: allowed types JPG / PNG` });
    if (file.size > opts.maxBytes) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${opts.label}: max ${opts.maxBytes / 1024 / 1024} MB` });
  });
}
export const uploadFilesSchema = z.object({
  photo: fileSchema({ required: true, maxBytes: 2 * 1024 * 1024, types: imageTypes, label: "Photo" }),
  signature: fileSchema({ required: true, maxBytes: 1 * 1024 * 1024, types: imageTypes, label: "Signature" }),
});
export type UploadFilesValues = z.infer<typeof uploadFilesSchema>;
export const registrationDefaults: RegistrationFormValues = {
  name: "", fatherName: "", motherName: "", dob: "", gender: "", state: "Bihar", district: "Siwan", block: "", village: "", pinCode: "", class: "", schoolName: "", medium: "Hindi",
};
export const STEP_SCHEMAS = [personalDetailsSchema, addressDetailsSchema, schoolDetailsSchema] as const;
