import type { Metadata } from "next";
import { AboutCompetition } from "@/components/home/AboutCompetition";
import { Contact } from "@/components/home/Contact";
import { Eligibility } from "@/components/home/Eligibility";
import { ExamCenter } from "@/components/home/ExamCenter";
import { ExamTiming } from "@/components/home/ExamTiming";
import { FAQ } from "@/components/home/FAQ";
import { FlipCountdown } from "@/components/home/FlipCountdown";
import { FoundationLeadership } from "@/components/home/FoundationLeadership";
import { Gallery } from "@/components/home/Gallery";
import { HeroSection } from "@/components/home/HeroSection";
import { ImportantDates } from "@/components/home/ImportantDates";
import { LatestNotice } from "@/components/home/LatestNotice";
import { PrizeSection } from "@/components/home/PrizeSection";
import { QuickLinks } from "@/components/home/QuickLinks";
import { RegistrationSteps } from "@/components/home/RegistrationSteps";
import { StatisticsCounter } from "@/components/home/StatisticsCounter";
import { SectionReveal } from "@/components/home/SectionReveal";
import { SITE } from "@/constants/site";

export const metadata: Metadata = {
  title: {
    absolute: `${SITE.name} | ${SITE.org}`,
  },
  description:
    "Rurally Smile Foundation द्वारा आयोजित प्रतिभा खोज प्रतियोगिता 2026 — केवल कक्षा 8–10, हिन्दी माध्यम। उत्क्रमित उच्च विद्यालय रतनपुरा, सीवान। आवेदन, Admit Card, Result ऑनलाइन।",
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE.name,
    description:
      "Talent Search Competition 2026 — Register online, download admit card & check results.",
    url: "/",
    type: "website",
    locale: "hi_IN",
    siteName: SITE.org,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: "प्रतिभा खोज प्रतियोगिता 2026 | Online Exam Portal",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section
        className="portal-countdown-section portal-section-pad position-relative"
        aria-label="Exam countdown"
      >
        <div className="container-page max-w-4xl position-relative" style={{ zIndex: 1 }}>
          <SectionReveal>
            <FlipCountdown targetDate={SITE.examDate} variant="light" />
          </SectionReveal>
        </div>
      </section>

      <QuickLinks />
      <AboutCompetition />
      <FoundationLeadership />
      <Eligibility />
      <ExamTiming />
      <PrizeSection />
      <ExamCenter />
      <ImportantDates />
      <RegistrationSteps />
      <StatisticsCounter />
      <LatestNotice />
      <Gallery />
      <FAQ />
      <Contact />
    </>
  );
}
