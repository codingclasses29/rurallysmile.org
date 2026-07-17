"use client";

import { FaPhoneAlt, FaGlobe, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { SITE } from "@/constants/site";
import { SectionReveal } from "@/components/home/SectionReveal";

export function Contact() {
  return (
    <section id="contact" className="portal-section-pad scroll-mt-28 bg-section-soft">
      <div className="container-page">
        <SectionReveal>
          <div className="overflow-hidden rounded-ui-lg border border-brand-border bg-white shadow-card dark:border-slate-700 dark:bg-slate-900 lg:grid lg:grid-cols-2">
            <div className="p-8 md:p-10">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-secondary">
                Get in Touch
              </p>
              <h2 className="section-title mt-2">Contact</h2>
              <p className="mt-4 flex items-start gap-2 font-heading text-xl font-bold text-brand-primary dark:text-white">
                <FaMapMarkerAlt className="mt-1 text-brand-secondary" aria-hidden />
                {SITE.org}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-600">Exam Office</p>
              <p className="mt-3 text-slate-700 dark:text-slate-300">
                उत्क्रमित उच्च विद्यालय
                <br />
                रतनपुरा
                <br />
                {SITE.district}, {SITE.state}
              </p>

              <div className="mt-6 space-y-3">
                {SITE.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone}`}
                    className="flex items-center gap-3 text-sm font-semibold text-brand-primary hover:text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary dark:text-white"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-ui bg-blue-50 text-brand-secondary dark:bg-slate-800">
                      <FaPhoneAlt size={14} aria-hidden />
                    </span>
                    {phone}
                  </a>
                ))}
                <a
                  href={`mailto:${SITE.supportEmail}`}
                  className="flex items-center gap-3 text-sm font-semibold text-brand-primary hover:text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary dark:text-white"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-ui bg-blue-50 text-brand-secondary dark:bg-slate-800">
                    <FaEnvelope size={14} aria-hidden />
                  </span>
                  {SITE.supportEmail}
                </a>
                <a
                  href={SITE.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm font-semibold text-brand-primary hover:text-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary dark:text-white"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-ui bg-blue-50 text-brand-secondary dark:bg-slate-800">
                    <FaGlobe size={14} aria-hidden />
                  </span>
                  www.rurallysmile.org
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-brand-primary to-brand-secondary p-8 text-white md:p-10">
              <h3 className="font-heading text-2xl font-bold">कार्यालय समय</h3>
              <p className="mt-3 text-blue-100">
                सोमवार – शनिवार · प्रातः 10 बजे – सायं 5 बजे
              </p>
              <div className="mt-8 rounded-ui-lg bg-white/10 p-5 backdrop-blur">
                <p className="text-sm font-semibold text-brand-accent">Helpline</p>
                <p className="mt-2 font-mono text-xl font-bold">
                  {SITE.phones[0]} / {SITE.phones[1]}
                </p>
                <p className="mt-3 text-sm text-blue-100">
                  पंजीकरण, एडमिट कार्ड और परिणाम संबंधी सहायता के लिए संपर्क करें।
                </p>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
