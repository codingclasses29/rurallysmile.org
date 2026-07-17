"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaPhoneAlt,
  FaRoute,
} from "react-icons/fa";
import { SITE } from "@/constants/site";
import { SectionReveal } from "@/components/home/SectionReveal";
import { centerService, type PublicExamCenter } from "@/services/center.service";

export function ExamCenter() {
  const [center, setCenter] = useState<PublicExamCenter | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await centerService.list();
        const list = res.data?.centers || [];
        if (list.length) setCenter(list[0]);
      } catch {
        /* keep SITE fallback */
      }
    })();
  }, []);

  const name =
    center?.centerNameHindi ||
    center?.centerName ||
    center?.name ||
    "उत्क्रमित उच्च विद्यालय";
  const address = center?.address || SITE.examCentreEn;
  const district = center?.district || SITE.district;
  const state = center?.state || SITE.state;
  const reporting = center?.reportingTime;
  const phone = center?.mobile || SITE.phones[0];

  return (
    <section
      className="portal-section-pad portal-exam-centre-section"
      id="exam-centre"
    >
      <div className="container-page">
        <SectionReveal>
          <div className="card portal-exam-centre-card">
            <div className="row g-0">
              <div className="col-lg-6 portal-exam-centre-left p-4 p-md-5">
                <p className="fs-1 mb-2" aria-hidden>
                  🏫
                </p>
                <p className="small fw-semibold text-warning text-uppercase mb-2 tracking-wide">
                  Exam Centre
                </p>
                <h2 className="h2 fw-bold text-white mb-2">{name}</h2>
                <p className="text-info-emphasis fs-5 opacity-90 mb-4" style={{ color: "#bae6fd" }}>
                  {address}
                </p>
                <ul className="list-unstyled small mb-4" style={{ color: "#e0f2fe" }}>
                  <li className="mb-2 d-flex align-items-center gap-2">
                    <FaMapMarkerAlt className="text-warning" aria-hidden />
                    {district} · {state}
                  </li>
                  {reporting ? <li className="mb-2">Reporting — {reporting}</li> : null}
                  {center?.capacity ? (
                    <li className="mb-2">Capacity — {center.capacity}</li>
                  ) : null}
                </ul>

                <div className="d-flex flex-wrap gap-2 position-relative" style={{ zIndex: 1 }}>
                  <a
                    href={SITE.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary rounded-pill"
                  >
                    <FaExternalLinkAlt className="me-2" size={12} aria-hidden />
                    Google Map
                  </a>
                  <a
                    href={SITE.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-light rounded-pill"
                  >
                    <FaRoute className="me-2" size={12} aria-hidden />
                    Download Route
                  </a>
                  <Link href="/contact" className="btn btn-warning rounded-pill text-white">
                    <FaPhoneAlt className="me-2" size={12} aria-hidden />
                    Contact Office
                  </Link>
                </div>
              </div>

              <div className="col-lg-6 portal-exam-centre-right p-4 p-md-5 d-flex align-items-center justify-content-center">
                <div className="card border-0 shadow-sm w-100 text-center bg-white bg-opacity-90">
                  <div className="card-body py-5">
                    <FaMapMarkerAlt className="text-primary fs-1 mb-3" aria-hidden />
                    <h3 className="h5 fw-bold text-dark mb-1">{name}</h3>
                    <p className="text-muted small mb-2">
                      {district}, {state}
                    </p>
                    {phone ? (
                      <a
                        href={`tel:${phone}`}
                        className="fw-semibold text-primary text-decoration-none"
                      >
                        {phone}
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
