import type { Metadata } from "next";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card/Card";
import Link from "next/link";
import { Button } from "@/components/ui/button/Button";

export const metadata: Metadata = { title: "Required Documents" };

const docs = [
  { title: "Photo", rule: "JPG/PNG · Max 2 MB · Recent passport size" },
  { title: "Signature", rule: "JPG/PNG · Max 1 MB · Clear white background" },
  { title: "School ID", rule: "JPG/PNG/PDF · Max 2 MB" },
  { title: "Aadhaar (Optional)", rule: "JPG/PNG/PDF · Max 2 MB" },
  { title: "DOB Proof", rule: "Birth certificate / School record (if asked)" },
];

export default function RequiredDocumentsPage() {
  return (
    <>
      <PageHeader
        title="Required Documents"
        description="पंजीकरण से पहले ये दस्तावेज़ तैयार रखें"
      />
      <div className="container-page section-pad pt-0">
        <div className="mx-auto grid max-w-3xl gap-4">
          {docs.map((d) => (
            <Card key={d.title} className="!p-5">
              <h3 className="font-heading font-bold text-brand-primary">{d.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{d.rule}</p>
            </Card>
          ))}
          <Link href="/registration">
            <Button variant="success">Start Registration</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
