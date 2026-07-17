"use client";

import Link from "next/link";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaGlobe } from "react-icons/fa";
import { SITE } from "@/constants/site";

export function TopBar() {
  return (
    <div className="hidden border-b border-slate-200 bg-white text-slate-700 md:block">
      <div className="container-page flex items-center justify-between gap-4 py-1.5 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <FaMapMarkerAlt className="text-[#1399A2]" aria-hidden />
            {SITE.district}, {SITE.state}
          </span>
          <a
            href={`mailto:${SITE.email}`}
            className="inline-flex items-center gap-1.5 transition hover:text-[#1399A2]"
            aria-label={`Email ${SITE.email}`}
          >
            <FaEnvelope className="text-[#F97316]" aria-hidden />
            {SITE.email}
          </a>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden lg:inline text-slate-500">
            Exam:{" "}
            <strong className="text-[#0F172A]">{SITE.examDateLabel}</strong>
          </span>
          <a
            href={`tel:${SITE.phones[0]}`}
            className="inline-flex items-center gap-1.5 transition hover:text-[#1399A2]"
            aria-label={`Helpline ${SITE.phones[0]}`}
          >
            <FaPhoneAlt aria-hidden /> Helpline
          </a>
          <Link
            href={SITE.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition hover:text-[#1399A2]"
            aria-label="Official website"
          >
            <FaGlobe aria-hidden /> Website
          </Link>
        </div>
      </div>
    </div>
  );
}
