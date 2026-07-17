"use client";

import {
  EXAM_INSTRUCTIONS,
  EXAM_INSTRUCTIONS_EN,
  EXAM_SLOTS,
  SITE,
} from "@/constants/site";
import { portalPage } from "@/assets/portalStyles";
import { SectionReveal } from "@/components/home/SectionReveal";

export function ExamTiming() {
  return (
    <section
      className="portal-section-pad bg-section-mesh"
      id="exam-timing"
    >
      <div className="container-page">
        <SectionReveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 mb-3">
              Exam Timing / परीक्षा समय
            </span>
            <h2 className="display-6 fw-bold text-dark">Exam Schedule</h2>
            <p className="text-muted mt-2">
              {SITE.examDateLabel} · {SITE.examDateLabelHindi}
              <br />
              {SITE.examCentreFull}
            </p>
          </div>
        </SectionReveal>

        <div className="row g-4 mt-2">
          {[EXAM_SLOTS.junior, EXAM_SLOTS.senior].map((slot, i) => (
            <div key={slot.classes} className="col-md-6">
              <SectionReveal delay={i * 0.06}>
                <div className="card border-0 shadow h-100 overflow-hidden">
                  <div
                    className={`card-header text-white py-3 ${i === 0 ? "bg-success" : "bg-primary"}`}
                  >
                    <p className="mb-0 fw-semibold">
                      {slot.classesLabelEn} / {slot.classesLabel}
                    </p>
                  </div>
                  <div className="card-body">
                    <p className="small text-uppercase text-muted mb-1">
                      Exam Time · परीक्षा समय
                    </p>
                    <p className="display-6 fw-bold text-dark tabular-nums mb-2">
                      {slot.examTime}
                    </p>
                    <p className="small text-muted mb-3">
                      Starts {slot.examStart} · Ends {slot.examEnd}
                    </p>
                    <div className="alert alert-warning py-2 mb-0 small">
                      <strong>Reporting / रिपोर्टिंग:</strong>{" "}
                      {slot.reportingTime}
                    </div>
                  </div>
                </div>
              </SectionReveal>
            </div>
          ))}
        </div>

        <SectionReveal delay={0.1}>
          <div className="card border-warning mt-5 overflow-hidden shadow-sm">
            <div className="card-header bg-warning text-white fw-bold">
              <i className="bi bi-exclamation-triangle me-2" aria-hidden />
              Important Instructions / महत्वपूर्ण निर्देश
            </div>
            <div className="card-body bg-warning-subtle">
              <ol className="mb-0 ps-3">
                {EXAM_INSTRUCTIONS.map((hi, i) => (
                  <li key={i} className="mb-3">
                    <p className="mb-1 fw-medium">{hi}</p>
                    <p className="small text-muted mb-0">
                      {EXAM_INSTRUCTIONS_EN[i]}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
