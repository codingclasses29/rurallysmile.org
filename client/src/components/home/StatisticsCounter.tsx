"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { HOME_STATS } from "@/constants/site";
import { SectionReveal } from "@/components/home/SectionReveal";
import { portalStats } from "@/assets/portalStyles";
import { statsService } from "@/services/stats.service";

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (target === 0) {
      setValue(0);
      return;
    }
    let start: number | null = null;
    let frame = 0;
    const step = (ts: number) => {
      if (start == null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration]);

  return value;
}

function StatItem({
  label,
  value,
  prefix,
  suffix,
  active,
}: {
  label: string;
  value: number;
  prefix: string;
  suffix: string;
  active: boolean;
}) {
  const n = useCountUp(value, active);
  return (
    <div className={portalStats.card}>
      <p className={portalStats.value}>
        {prefix}
        {n.toLocaleString("en-IN")}
        {suffix}
      </p>
      <p className={portalStats.label}>{label}</p>
    </div>
  );
}

type StatRow = {
  key: string;
  label: string;
  value: number;
  prefix: string;
  suffix: string;
};

export function StatisticsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [stats, setStats] = useState<StatRow[]>(
    HOME_STATS.map((s) => ({ ...s }))
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await statsService.public();
        const s = res.data?.stats;
        if (!s) return;
        setStats([
          {
            key: "students",
            label: "Students Registered",
            value: s.totalStudents || 0,
            prefix: "",
            suffix: "+",
          },
          {
            key: "centers",
            label: "Exam Centers",
            value: s.totalCenters || 0,
            prefix: "",
            suffix: "+",
          },
          {
            key: "notices",
            label: "Published Notices",
            value: s.totalNotices || 0,
            prefix: "",
            suffix: "",
          },
          {
            key: "results",
            label: "Results Published",
            value: s.publishedResults || 0,
            prefix: "",
            suffix: "",
          },
        ]);
      } catch {
        /* keep HOME_STATS fallback */
      }
    })();
  }, []);

  return (
    <section className="portal-section-pad bg-gradient-to-br from-[#0F172A] via-[#13233f] to-[#0e7490] text-white">
      <div className="container-page" ref={ref}>
        <SectionReveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-accent">
              Live Statistics
            </p>
            <h2 className="mt-2 font-heading text-3xl font-extrabold sm:text-4xl">
              Competition Snapshot
            </h2>
            <p className="mt-2 text-sm text-blue-100">
              Live figures from the exam portal database.
            </p>
          </div>
        </SectionReveal>

        <div className={portalStats.grid}>
          {stats.map((stat) => (
            <StatItem
              key={stat.key}
              label={stat.label}
              value={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
              active={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
