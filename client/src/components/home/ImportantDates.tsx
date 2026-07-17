"use client";

import { IMPORTANT_DATES } from "@/constants/site";
import { SectionReveal } from "@/components/home/SectionReveal";

export function ImportantDates() {
  return (
    <section className="portal-section-pad portal-dates-section" id="dates">
      <div className="container-page">
        <SectionReveal>
          <div className="text-center mx-auto mb-4" style={{ maxWidth: 560 }}>
            <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 mb-3">
              Timeline
            </span>
            <h2 className="display-6 fw-bold text-dark mb-2">Important Dates</h2>
            <p className="text-muted mb-0">
              महत्वपूर्ण तिथियाँ — समय सीमा का ध्यान रखें
            </p>
          </div>
        </SectionReveal>

        <div className="row g-3 g-md-4 mt-2">
          {IMPORTANT_DATES.map((d, i) => (
            <div key={d.label} className="col-md-6 col-lg-4">
              <SectionReveal delay={i * 0.04}>
                <div className="card portal-date-card h-100">
                  <div className="card-body p-4">
                    <span className="badge rounded-circle bg-primary d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 32, height: 32 }}>
                      {i + 1}
                    </span>
                    <p className="small fw-semibold text-uppercase text-muted mb-0">
                      {d.label}
                    </p>
                    {"labelHi" in d && d.labelHi ? (
                      <p className="small text-muted mb-2">{d.labelHi}</p>
                    ) : (
                      <div className="mb-2" />
                    )}
                    <p className="h4 fw-bold text-dark mb-1">{d.date}</p>
                    <p className="small text-muted mb-0">{d.year}</p>
                  </div>
                </div>
              </SectionReveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
