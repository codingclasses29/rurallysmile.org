import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-secondary">
        404
      </p>
      <h1 className="font-heading text-4xl font-bold">Page Not Found</h1>
      <p className="text-slate-600">यह पेज मौजूद नहीं है या स्थानांतरित कर दिया गया है।</p>
      <Link href="/">
        <Button variant="secondary">Go Home</Button>
      </Link>
    </div>
  );
}
