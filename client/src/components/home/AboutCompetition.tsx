"use client";

import Image from "next/image";
import { SITE } from "@/constants/site";
import { portalPage } from "@/assets/portalStyles";
import { SectionReveal } from "@/components/home/SectionReveal";

export function AboutCompetition() {
  return (
    <section
      className="portal-section-pad bg-section-mesh"
      id="about"
    >
      <div className="container-page grid items-center gap-10 lg:grid-cols-2">
        <SectionReveal>
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-teal-100 bg-white p-3 shadow-soft">
              <Image
                src="/icons/icons.png"
                alt="Rurally Smile Foundation"
                width={140}
                height={74}
                className="h-12 w-auto object-contain"
              />
            </div>
            <span className={portalPage.badge}>About Competition</span>
          <h2 className={`${portalPage.title} mt-4`}>
            <span className={portalPage.titleGradient}>
              प्रतिभा खोज प्रतियोगिता
            </span>
          </h2>
          <p className={`${portalPage.subtitle} !max-w-none text-base leading-relaxed`}>
            ग्रामीण क्षेत्रों के प्रतिभाशाली विद्यार्थियों को राष्ट्रीय स्तर तक
            पहुँचाने हेतु आयोजित। {SITE.mission}
          </p>
          <aside className="mt-6 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-[#071d2c] to-[#0f766e] p-4 shadow-lg">
            <Image
              src="/icons/icons.png"
              alt="Rurally Smile Foundation"
              width={120}
              height={63}
              className="h-12 w-auto object-contain"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-300">
                Organized by
              </p>
              <p className="font-heading font-bold text-white">{SITE.org}</p>
            </div>
          </aside>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="relative min-h-[390px] overflow-hidden rounded-3xl bg-[#0F172A] p-8 text-white shadow-2xl">
            <Image
              src="/images/gallery/volunteer-team.png"
              alt="Rurally Smile Foundation volunteer team"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071824]/95 via-[#0f3038]/85 to-[#0f766e]/55" />
            <div className="relative z-10">
              <Image
                src="/icons/icons.png"
                alt="Rurally Smile Foundation"
                width={120}
                height={63}
                className="mb-4 object-contain"
                style={{ height: 48, width: "auto" }}
              />
              <h3 className="font-heading text-2xl font-bold">{SITE.slogan}</h3>
              <ul className="mt-6 space-y-3 text-sm text-cyan-50">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Talent search for rural students
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Hindi medium · 4 subjects = 100 marks
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Certificates, trophies & cash prizes
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Online admit card, result & marksheet
                </li>
              </ul>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
