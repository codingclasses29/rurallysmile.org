"use client";

import { FormEvent, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card/Card";
import { Input } from "@/components/ui/input/Input";
import { Button } from "@/components/ui/button/Button";
import { Badge } from "@/components/ui/badge/Badge";
import { Alert } from "@/components/ui/alert/Alert";
import { registrationService } from "@/services/registration.service";

type StatusData = {
  status?: string;
  approved?: boolean;
  paymentStatus?: string;
  student?: {
    name?: string;
    class?: string;
    registrationNumber?: string;
    mobile?: string;
    schoolName?: string;
  };
};

export default function RegistrationStatusPage() {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<StatusData | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await registrationService.status({
        registrationNumber: registrationNumber || undefined,
        mobile: mobile || undefined,
      });
      setResult((res.data as StatusData) || null);
    } catch (err: unknown) {
      setError(
        typeof err === "object" && err && "message" in err
          ? String((err as { message: string }).message)
          : "Status lookup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const status = result?.status || "Pending";

  return (
    <>
      <PageHeader
        title="Registration Status"
        description="Registration Number या Mobile से स्थिति जाँचें"
      />
      <div className="container-page section-pad pt-0">
        <Card className="mx-auto max-w-lg">
          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              label="Registration Number"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
              placeholder="RSF26-060001"
            />
            <Input
              label="Mobile Number"
              value={mobile}
              onChange={(e) =>
                setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="10-digit mobile"
            />
            <Button type="submit" fullWidth loading={loading}>
              Check Status
            </Button>
          </form>

          {error && (
            <Alert variant="error" className="mt-4" title="Not found">
              {error}
            </Alert>
          )}

          {result?.student && (
            <div className="mt-6 space-y-3 rounded-ui border border-brand-border bg-slate-50 p-4 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <p className="font-heading font-bold">{result.student.name}</p>
                <Badge
                  status={
                    status === "Approved"
                      ? "approved"
                      : status === "Rejected"
                        ? "rejected"
                        : "pending"
                  }
                >
                  {status}
                </Badge>
              </div>
              <p className="font-mono text-sm text-brand-secondary">
                {result.student.registrationNumber}
              </p>
              <p className="text-sm text-slate-600">
                Class {result.student.class} · {result.student.schoolName}
              </p>
              {status === "Approved" && (
                <a href="/admit-card" className="text-sm font-semibold text-brand-secondary">
                  Download Admit Card →
                </a>
              )}
              {result.student.registrationNumber && (
                <a
                  href={registrationService.receiptUrl(
                    result.student.registrationNumber
                  )}
                  className="block text-sm font-semibold text-brand-secondary"
                  target="_blank"
                  rel="noreferrer"
                >
                  Download Receipt PDF →
                </a>
              )}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
