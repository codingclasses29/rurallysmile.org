"use client";

import Link from "next/link";
import { QUICK_ACTIONS } from "@/constants/site";
import { SectionReveal } from "@/components/home/SectionReveal";

const CARD_VARIANT: Record<string, string> = {
  "/registration": "card-reg",
  "/admit-card": "card-admit",
  "/result": "card-result",
  "/marksheet": "card-marksheet",
  "/merit-list": "card-merit",
  "/notice": "card-notice",
};

export function QuickLinks() {
  return (
    <section
      className="relative z-10 -mt-10 pb-6 md:-mt-14"
      aria-label="Quick actions"
    >
      <div className="container-page">
        <SectionReveal>
          <div className="row g-3 g-md-4">
            {QUICK_ACTIONS.map((item) => (
              <div
                key={item.href}
                className="col-6 col-md-4 col-xl-2"
              >
                <Link
                  href={item.href}
                  className="text-decoration-none d-block h-100"
                >
                  <article
                    className={`card portal-quick-card h-100 ${CARD_VARIANT[item.href] || ""}`}
                  >
                    <div className="card-top-bar" />
                    <div className="card-body p-3 p-md-4">
                      <div
                        className="icon-circle mb-3"
                        aria-hidden
                      >
                        {item.icon}
                      </div>
                      <h3 className="card-title h6 fw-bold text-dark mb-1">
                        {item.title}
                      </h3>
                      <p className="card-text small text-muted mb-0">
                        {item.desc}
                      </p>
                    </div>
                  </article>
                </Link>
              </div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
