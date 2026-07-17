"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa";
import { EXAM_SLOTS, SITE } from "@/constants/site";

const particles = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${(i * 17) % 100}%`,
  top: `${(i * 23) % 90}%`,
  size: 3 + (i % 4) * 2,
  duration: 6 + (i % 5),
  delay: i * 0.2,
}));

export function HeroSection() {
  return (
    <section
      className="portal-hero-bg relative text-white"
      aria-labelledby="hero-heading"
    >
      <div className="portal-hero-blob portal-hero-blob-1" aria-hidden />
      <div className="portal-hero-blob portal-hero-blob-2" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 portal-grid-pattern opacity-30"
        aria-hidden
      />

      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="pointer-events-none absolute rounded-full bg-white/25"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
          animate={{ y: [0, -24, 0], opacity: [0.15, 0.6, 0.15] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          aria-hidden
        />
      ))}

      <div className="container-page relative grid items-center gap-10 py-14 md:py-16 lg:grid-cols-2 lg:gap-12 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <p className="badge bg-dark mb-3 d-inline-flex align-items-center gap-2 px-3 py-2">
            <Image
              src="/icons/icons.png"
              alt="Rurally Smile Foundation"
              width={100}
              height={52}
              className="object-contain"
              style={{ height: 28, width: "auto" }}
            />
            <span className="text-warning">{SITE.orgHindi}</span>
          </p>
          <h1 id="hero-heading" className="display-5 fw-bold lh-sm">
            {SITE.titleHindi}
          </h1>
          <p className="mt-3 text-base font-medium text-cyan-100 sm:text-lg">
            केवल कक्षा 8, 9 एवं 10 ({SITE.medium}) · चार विषय मिलकर 100 अंक
          </p>

          <div className="card portal-hero-info mt-6">
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex gap-3 py-3">
                <FaMapMarkerAlt className="mt-1 shrink-0 text-warning fs-5" aria-hidden />
                <span>
                  <span className="fw-semibold">परीक्षा केन्द्र</span>
                  <br />
                  <span className="small opacity-90">{SITE.examCentreFull}</span>
                </span>
              </li>
              <li className="list-group-item d-flex gap-3 py-3">
                <FaCalendarAlt className="mt-1 shrink-0 text-warning fs-5" aria-hidden />
                <span>
                  <span className="fw-semibold">परीक्षा तिथि</span>
                  <br />
                  <span className="small opacity-90">{SITE.examDateLabelHindi}</span>
                </span>
              </li>
              <li className="list-group-item py-3">
                <div className="d-flex gap-3">
                  <FaClock className="mt-1 shrink-0 text-warning fs-5" aria-hidden />
                  <div className="w-100">
                    <p className="fw-semibold mb-2">परीक्षा समय</p>
                    <div className="row g-2">
                      {[EXAM_SLOTS.junior, EXAM_SLOTS.senior].map((slot) => (
                        <div key={slot.classesLabelEn} className="col-sm-6">
                          <div className="rounded-3 border border-white border-opacity-25 bg-dark bg-opacity-25 px-3 py-2">
                            <p className="small text-info mb-0">
                              {slot.classesLabelEn} / {slot.classesLabel}
                            </p>
                            <p className="fw-semibold tabular-nums mb-0">
                              {slot.examTime}
                            </p>
                            <p className="small opacity-75 mb-0">
                              Report · {slot.reportingTime}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-4 d-flex flex-wrap gap-2 gap-md-3">
            <Link href="/registration" className="btn btn-success btn-lg rounded-pill px-4 shadow">
              <i className="bi bi-pencil-square me-2" aria-hidden />
              Register Now
            </Link>
            <Link
              href="/admit-card"
              className="btn btn-outline-light btn-lg rounded-pill px-4"
            >
              <i className="bi bi-card-heading me-2" aria-hidden />
              Admit Card
            </Link>
            <Link
              href="/result"
              className="btn btn-outline-light btn-lg rounded-pill px-4"
            >
              <i className="bi bi-bar-chart me-2" aria-hidden />
              Check Result
            </Link>
            <Link href="/marksheet" className="btn btn-warning btn-lg rounded-pill px-4 text-white">
              <i className="bi bi-file-earmark-text me-2" aria-hidden />
              Marksheet
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="relative portal-float"
        >
          <div className="absolute -inset-1 rounded-[28px] portal-border-animated opacity-70 blur-sm" />
          <div className="card border-0 shadow-lg overflow-hidden">
            <div className="card-header bg-dark text-white d-flex align-items-center gap-3 py-3">
              <Image
                src="/icons/icons.png"
                alt="Rurally Smile Foundation"
                width={120}
                height={63}
                className="object-contain"
                style={{ height: 44, width: "auto" }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-info mb-0">प्रतिभा खोज 2026</p>
              </div>
              <span className="badge bg-warning text-dark ms-auto">
                ADMIT CARD
              </span>
            </div>

            <div className="card-body p-4 text-dark">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1.5 text-xs">
                  <p>
                    <span className="font-semibold text-slate-500">Name / नाम</span>
                    <br />
                    <span className="font-bold">Student Name</span>
                  </p>
                  <p>
                    <span className="font-semibold text-slate-500">Roll / रोल</span>
                    <br />
                    <span className="font-mono font-bold text-[#1399A2]">
                      RSF26-000001
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-slate-500">Class / कक्षा</span>
                    <br />
                    <span className="font-bold">Class 8</span>
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto h-20 w-16 overflow-hidden rounded-lg border-2 border-cyan-200 bg-gradient-to-b from-cyan-50 to-slate-100">
                    <div className="flex h-full items-center justify-center text-2xl text-slate-300">
                      👤
                    </div>
                  </div>
                  <div className="mt-2 flex h-14 w-14 items-center justify-center rounded-lg border border-slate-200 bg-white text-[10px] text-slate-400">
                    QR
                  </div>
                </div>
              </div>

              <div className="alert alert-success py-2 small mb-0">
                <p className="fw-bold mb-1">Exam · {SITE.examDateLabel}</p>
                <p className="mb-0 tabular-nums">
                  Class 8: {EXAM_SLOTS.junior.examTime} · Class 9–10:{" "}
                  {EXAM_SLOTS.senior.examTime}
                </p>
              </div>

              <div className="mt-3 d-flex align-items-center justify-content-between border-top pt-3">
                <Image
                  src="/icons/icons.png"
                  alt=""
                  width={72}
                  height={28}
                  className="object-contain"
                  style={{ height: 28, width: "auto" }}
                />
                <span className="badge bg-dark font-monospace">OFFICIAL</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 -mb-px leading-[0]" aria-hidden>
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className="h-14 w-full text-ui-bg md:h-20"
        >
          <path
            fill="currentColor"
            d="M0,64 C240,120 480,0 720,40 C960,80 1200,100 1440,40 L1440,100 L0,100 Z"
          />
        </svg>
      </div>
    </section>
  );
}
