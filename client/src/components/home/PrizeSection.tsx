"use client";

import { PRIZES } from "@/constants/site";
import { SectionReveal } from "@/components/home/SectionReveal";

export function PrizeSection() {
  return (
    <section className="portal-section-pad portal-prize-section" id="prizes">
      <div className="container-page">
        <SectionReveal>
          <div className="text-center mx-auto mb-4" style={{ maxWidth: 560 }}>
            <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 mb-3">
              Awards &amp; Recognition
            </span>
            <h2 className="display-6 fw-bold text-dark mb-2">Prize Section</h2>
            <p className="text-muted mb-0">
              उत्कृष्ट प्रदर्शन पर नकद पुरस्कार और प्रमाण-पत्र
            </p>
          </div>
        </SectionReveal>

        <div className="row g-3 g-md-4 justify-content-center mt-2">
          {PRIZES.map((prize, i) => (
            <div key={prize.title} className="col-6 col-md-4 col-lg-4 col-xl">
              <SectionReveal delay={i * 0.05}>
                <div
                  className={`card portal-prize-card h-100 text-center ${
                    prize.highlight ? "is-highlight" : ""
                  }`}
                >
                  <div className={`card-header py-3 ${prize.headerClass}`}>
                    <span className="fs-2" aria-hidden>
                      {prize.icon}
                    </span>
                  </div>
                  <div className="card-body d-flex flex-column p-3 p-md-4">
                    <h3 className="h6 fw-bold text-dark mb-1">{prize.title}</h3>
                    <p className="small text-muted mb-2">{prize.titleEn}</p>
                    <p className="fs-3 fw-bold text-primary mb-3">{prize.amount}</p>
                    <ul className="list-unstyled mb-0 mt-auto">
                      {prize.extras.map((e) => (
                        <li key={e} className="small text-muted">
                          + {e}
                        </li>
                      ))}
                    </ul>
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
