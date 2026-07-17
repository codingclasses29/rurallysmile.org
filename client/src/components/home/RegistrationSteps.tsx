"use client";

import { REGISTRATION_STEPS } from "@/constants/site";
import { portalPage, portalSteps } from "@/assets/portalStyles";
import { SectionReveal } from "@/components/home/SectionReveal";

export function RegistrationSteps() {
  return (
    <section className="portal-section-pad bg-section-warm" id="process">
      <div className="container-page">
        <SectionReveal>
          <div className={portalPage.headerCenter}>
            <span className={portalPage.badge}>How to Apply</span>
            <h2 className={`${portalPage.title} mt-4`}>Registration Process</h2>
            <p className={`${portalPage.subtitle} mx-auto`}>
              आवेदन से प्रमाण-पत्र तक — 6 सरल चरण
            </p>
          </div>
        </SectionReveal>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {REGISTRATION_STEPS.map((step, i) => (
            <SectionReveal key={step.step} delay={i * 0.04}>
              <li className={portalSteps.card}>
                <span className={portalSteps.number}>{step.step}</span>
                <h3 className="mt-4 font-heading text-base font-bold text-[#0F172A] dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {step.desc}
                </p>
                {i < REGISTRATION_STEPS.length - 1 && (
                  <span
                    className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-[#1399A2] xl:block"
                    aria-hidden
                  >
                    →
                  </span>
                )}
              </li>
            </SectionReveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
