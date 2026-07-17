"use client";

import type { AdminStudent } from "@/services/admin.service";
import { SITE } from "@/constants/site";

type Props = {
  student: AdminStudent & { motherName?: string; dob?: string };
  badge?: { label: string; tone: "success" | "warning" | "danger" | "info" | "secondary" };
  center?: string;
  examTitle?: string;
  extra?: React.ReactNode;
};

export function StudentPreviewCard({
  student,
  badge,
  center,
  examTitle = SITE.name,
  extra,
}: Props) {
  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex gap-3">
          <div
            className="rounded-3 bg-light border overflow-hidden flex-shrink-0"
            style={{ width: 72, height: 84 }}
          >
            {student.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={student.photo}
                alt={student.name}
                className="w-100 h-100 object-fit-cover"
              />
            ) : (
              <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                <i className="bi bi-person fs-3" />
              </div>
            )}
          </div>
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between gap-2 flex-wrap">
              <h2 className="h5 fw-bold mb-1">{student.name}</h2>
              {badge && (
                <span className={`badge text-bg-${badge.tone} align-self-start`}>
                  {badge.label}
                </span>
              )}
            </div>
            <dl className="row small mb-0 g-1">
              <dt className="col-5 text-muted">Roll No</dt>
              <dd className="col-7 fw-semibold font-monospace mb-0">
                {student.rollNumber || "—"}
              </dd>
              <dt className="col-5 text-muted">Reg No</dt>
              <dd className="col-7 fw-semibold font-monospace mb-0">
                {student.registrationNumber || "—"}
              </dd>
              <dt className="col-5 text-muted">Class</dt>
              <dd className="col-7 mb-0">{student.class || "—"}</dd>
              <dt className="col-5 text-muted">Exam</dt>
              <dd className="col-7 mb-0">{examTitle}</dd>
              <dt className="col-5 text-muted">Center</dt>
              <dd className="col-7 mb-0">{center || SITE.examCentre}</dd>
            </dl>
          </div>
        </div>
        {extra}
      </div>
    </div>
  );
}
