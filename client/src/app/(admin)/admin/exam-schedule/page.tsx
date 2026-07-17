"use client";

import { SITE, EXAM_SLOTS, IMPORTANT_DATES } from "@/constants/site";

export default function ExamSchedulePage() {
  return (
    <div>
      <h1 className="h3 fw-bold mb-1">Exam Schedule</h1>
      <p className="text-muted mb-4">Official timing · {SITE.examDateLabel}</p>

      <div className="row g-3 mb-4">
        {[EXAM_SLOTS.junior, EXAM_SLOTS.senior].map((s) => (
          <div className="col-md-6" key={s.classes}>
            <div className="admin-coming-card p-4 h-100">
              <div className="text-primary fw-semibold small text-uppercase">
                {s.classesLabelEn}
              </div>
              <div className="fs-3 fw-bold mt-2">{s.examTime}</div>
              <div className="text-muted">Reporting · {s.reportingTime}</div>
              <div className="mt-3 small">{SITE.examCentreFull}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-coming-card p-4">
        <h2 className="h6 fw-bold">Important Dates</h2>
        <table className="table mb-0">
          <tbody>
            {IMPORTANT_DATES.map((d) => (
              <tr key={d.label}>
                <td>{d.labelHi}</td>
                <td className="fw-semibold">
                  {d.date} {d.year}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
