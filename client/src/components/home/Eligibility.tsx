"use client";

import { ELIGIBILITY_CLASSES, SUBJECTS } from "@/constants/site";
import { portalCard, portalPage } from "@/assets/portalStyles";
import { SectionReveal } from "@/components/home/SectionReveal";
import { motion } from "framer-motion";

export function Eligibility() {
  return (
    <section className="portal-section-pad bg-section-dots" id="eligibility">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-2">
          <SectionReveal>
            <span className={portalPage.badge}>Eligibility</span>
            <h2 className={`${portalPage.title} mt-4`}>केवल कक्षा 7 से 10 तक</h2>
            <p className={portalPage.subtitle}>
              परीक्षा केवल Classes 7, 8, 9 और 10 के विद्यार्थियों के लिए
            </p>
            <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-3">
              {ELIGIBILITY_CLASSES.map((c, i) => (
                <motion.div
                  key={c}
                  whileHover={{ y: -6, scale: 1.04 }}
                  className="rounded-2xl border border-cyan-100 bg-white py-4 text-center shadow-md transition dark:border-slate-700 dark:bg-slate-900"
                  transition={{ delay: i * 0.02 }}
                >
                  <p className="text-[10px] font-semibold uppercase text-slate-500">
                    Class
                  </p>
                  <p className="font-mono text-2xl font-extrabold text-[#1399A2]">
                    {c}
                  </p>
                </motion.div>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal delay={0.08}>
            <span className={portalPage.badge}>Subjects</span>
            <h2 className={`${portalPage.title} mt-4`}>परीक्षा विषय</h2>
            <p className={portalPage.subtitle}>
              चार विषय मिलकर कुल 100 अंक · प्रत्येक 25 अंक · पासिंग 33%
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {SUBJECTS.map((s) => (
                <motion.div
                  key={s.en}
                  whileHover={{ y: -4 }}
                  className={portalCard.base}
                >
                  <p className="text-2xl" aria-hidden>
                    {s.icon}
                  </p>
                  <p className="mt-2 font-heading text-lg font-bold text-[#0F172A] dark:text-white">
                    {s.title}
                  </p>
                  <p className="text-sm text-slate-500">{s.en}</p>
                  <span className="mt-3 inline-flex rounded-full bg-gradient-to-r from-[#1399A2] to-cyan-500 px-3 py-1 text-xs font-bold text-white">
                    25 Marks
                  </span>
                </motion.div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
