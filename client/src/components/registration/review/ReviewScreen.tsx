"use client";

import type { RegistrationFormValues } from "@/schemas/registration.schema";
import type { RegistrationFiles } from "@/types/registration";
import { RegSectionTitle } from "../shared/RegSectionTitle";
import { ReviewSection } from "./ReviewSection";
import { ReviewField } from "./ReviewField";
import { ReviewUploads } from "./ReviewUploads";

type Props = {
  values: RegistrationFormValues;
  files: RegistrationFiles;
  onEdit: (step: number) => void;
};

export function ReviewScreen({ values, files, onEdit }: Props) {
  return (
    <div className="space-y-4">
      <RegSectionTitle
        title="Review your application"
        subtitle="सभी विवरण जाँच लें। Edit से पिछले चरण पर वापस जा सकते हैं। OTP अगले चरण में।"
      />

      <ReviewSection title="Personal" stepId={1} onEdit={onEdit}>
        <ReviewField label="Name" value={values.name} />
        <ReviewField label="Father" value={values.fatherName} />
        <ReviewField label="Mother" value={values.motherName} />
        <ReviewField label="DOB" value={values.dob} />
        <ReviewField label="Gender" value={values.gender} />
        <ReviewField label="Category" value={values.category} />
      </ReviewSection>

      <ReviewSection title="Address" stepId={2} onEdit={onEdit}>
        <ReviewField label="State" value={values.state} />
        <ReviewField label="District" value={values.district} />
        <ReviewField label="Block" value={values.block} />
        <ReviewField label="Village" value={values.village} />
        <ReviewField label="PIN" value={values.pinCode} />
        <ReviewField label="Address" value={values.address} />
      </ReviewSection>

      <ReviewSection title="School" stepId={3} onEdit={onEdit}>
        <ReviewField label="Class" value={values.class} />
        <ReviewField label="School" value={values.schoolName} />
        <ReviewField label="Medium" value={values.medium} />
      </ReviewSection>

      <ReviewSection title="Contact" stepId={4} onEdit={onEdit}>
        <ReviewField label="Mobile" value={values.mobile} />
        <ReviewField label="Parent Mobile" value={values.parentMobile} />
        <ReviewField label="Email" value={values.email} />
        <ReviewField
          label="WhatsApp"
          value={values.whatsapp || values.mobile}
        />
      </ReviewSection>

      <ReviewSection title="Uploads" stepId={5} onEdit={onEdit}>
        <ReviewUploads files={files} />
      </ReviewSection>
    </div>
  );
}
