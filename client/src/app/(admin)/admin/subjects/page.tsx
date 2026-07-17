"use client";

import { SUBJECTS } from "@/constants/site";

export default function SubjectsPage() {
  return (
    <div>
      <h1 className="h3 fw-bold mb-1">Subjects</h1>
      <p className="text-muted mb-4">
        Combined paper · Full marks <strong>100</strong> · Pass marks 33%
      </p>
      <div className="alert alert-info">
        Admin enters <strong>total marks only (0–100)</strong> — not per subject.
      </div>
      <div className="row g-3">
        {SUBJECTS.map((s) => (
          <div className="col-md-6 col-xl-3" key={s.en}>
            <div className="admin-coming-card p-4 text-center h-100">
              <div className="display-6">{s.icon}</div>
              <div className="fw-bold fs-5 mt-2">{s.title}</div>
              <div className="text-muted small">{s.en}</div>
              <div className="badge text-bg-secondary mt-3">Part of 100</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
