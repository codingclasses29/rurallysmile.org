"use client";

import { useState } from "react";
import { FAQS } from "@/constants/site";
import { HiChevronDown } from "react-icons/hi";
import { cn } from "@/utils/cn";
import { SectionReveal } from "@/components/home/SectionReveal";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="portal-section-pad scroll-mt-28 bg-section-white">
      <div className="container-page mx-auto max-w-3xl">
        <SectionReveal>
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-secondary">
              Help
            </p>
            <h2 className="section-title mt-2">FAQ</h2>
            <p className="section-subtitle mx-auto">अक्सर पूछे जाने वाले प्रश्न</p>
          </div>
        </SectionReveal>

        <div className="mt-8 space-y-3" role="list">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            const btnId = `faq-btn-${i}`;
            return (
              <SectionReveal key={faq.q} delay={i * 0.03}>
                <div
                  className="overflow-hidden rounded-ui-lg border border-brand-border bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
                  role="listitem"
                >
                  <button
                    type="button"
                    id={btnId}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <span className="font-heading text-sm font-bold text-brand-primary dark:text-white sm:text-base">
                      {faq.q}
                    </span>
                    <HiChevronDown
                      className={cn(
                        "shrink-0 text-brand-secondary transition",
                        isOpen && "rotate-180"
                      )}
                      size={20}
                      aria-hidden
                    />
                  </button>
                  {isOpen && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={btnId}
                      className="border-t border-brand-border bg-white px-5 py-4 text-sm leading-relaxed text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
