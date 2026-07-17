"use client";

import {
  EXAM_INSTRUCTIONS_EN,
  EXAM_INSTRUCTIONS_SHORT,
  SITE,
  getExamSlotForClass,
} from "@/constants/site";
import type {
  AdminStudent,
  AdmitCardRow,
  ExamCenter,
} from "@/services/admin.service";

const LOGO = "/icons/icons.png";

type Props = {
  student: AdminStudent;
  admit: AdmitCardRow;
  zoom?: number;
};

function fmtDateEn(d?: string) {
  if (!d) return SITE.examDateLabel;
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

/** A4 admit card — Bootstrap 5 + logo watermark · print / PDF download A4 */
export function AdmitCardDocument({ student, admit, zoom = 1 }: Props) {
  const center =
    typeof admit.examCenter === "object" && admit.examCenter
      ? (admit.examCenter as ExamCenter)
      : null;
  const centerName =
    center?.centerName || center?.name || SITE.examCentre;
  const centerAddress = center?.address || SITE.examCentreFull;
  const slot = getExamSlotForClass(student.class);

  const rows: [string, string][] = [
    ["Name / नाम", student.name],
    ["Father / पिता", student.fatherName || "—"],
    ["Class / कक्षा", String(student.class)],
    ["Roll No. / रोल", student.rollNumber || "—"],
    ["Reg. No. / पंजीकरण", student.registrationNumber || "—"],
    ["School / विद्यालय", student.schoolName || "—"],
    ["Exam Date / परीक्षा तिथि", fmtDateEn(admit.examDate)],
    [
      "Exam Time / परीक्षा समय",
      `${slot.examTime} (${slot.classesLabelEn})`,
    ],
    [
      "Reporting / रिपोर्टिंग",
      `${slot.reportingTime} (${slot.classesLabelEn})`,
    ],
    ["Centre / केंद्र", centerName],
    [
      "Room / Seat · कक्ष",
      `${admit.roomNumber || "—"} / ${admit.seatNumber || "—"}`,
    ],
  ];

  return (
    <div
      className="admit-card-a4 doc-with-watermark portal-doc-print"
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: "top center",
      }}
    >
      <div
        style={{
          height: 6,
          background: "linear-gradient(90deg,#0f766e,#1399a2,#f97316)",
        }}
      />

      <div className="d-flex align-items-start justify-content-between gap-2 px-3 px-md-4 pt-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO}
          alt="Rurally Smile Foundation"
          className="bg-dark rounded p-1"
          style={{ width: 120, height: "auto", objectFit: "contain" }}
        />
        <div className="flex-grow-1 text-center px-1">
          <div className="fw-bold text-primary small">
            Rurally Smile Foundation
          </div>
          <div className="fw-bold text-dark" style={{ fontSize: 14 }}>
            Pratibha Khoj Competition 2026
          </div>
          <div className="small text-muted">प्रतिभा खोज प्रतियोगिता 2026</div>
          <div className="fw-bold text-success mt-1" style={{ fontSize: 16 }}>
            ADMIT CARD / प्रवेश पत्र
          </div>
          <div className="badge text-bg-secondary mt-1">A4 Print / Download</div>
        </div>
        <div className="text-center" style={{ width: 88 }}>
          <div
            className="border border-info border-2 d-flex align-items-center justify-content-center bg-white mx-auto rounded"
            style={{ width: 72, height: 72 }}
          >
            <i className="bi bi-qr-code fs-1 text-primary" />
          </div>
          <div
            className="small font-monospace mt-1 text-muted"
            style={{ fontSize: 9 }}
          >
            {student.registrationNumber}
          </div>
        </div>
      </div>

      <hr className="mx-3 my-2 border-primary opacity-100" />

      <div className="px-3 px-md-4 pb-4">
        <div className="row g-3 mb-3">
          <div className="col">
            <table className="table table-sm table-borderless mb-0 small">
              <tbody>
                {rows.map(([k, v]) => (
                  <tr key={k}>
                    <th
                      className="text-muted fw-semibold text-nowrap pe-2"
                      style={{ width: "42%" }}
                    >
                      {k}
                    </th>
                    <td className="fw-semibold font-monospace text-dark">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-auto text-center">
            <div
              className="border border-2 border-primary-subtle bg-light mx-auto overflow-hidden rounded mb-2"
              style={{ width: 78, height: 95 }}
            >
              {student.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={student.photo}
                  alt=""
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div className="h-100 d-flex align-items-center justify-content-center text-muted small">
                  Photo
                </div>
              )}
            </div>
            <span className="badge text-bg-success">{slot.classesLabelEn}</span>
          </div>
        </div>

        <div className="alert alert-success py-2 mb-3">
          <strong>Your slot / आपकी समय सारिणी</strong>
          <div className="fw-bold tabular-nums mt-1">
            {slot.examTime} · Report {slot.reportingTime}
          </div>
          <div className="small mt-1">
            Classes 7–8: 09:00–10:30 (Report 08:30) · Classes 9–10: 10:00–11:30
            (Report 09:30)
          </div>
        </div>

        <div className="alert alert-warning py-2 mb-3">
          <strong>Important Instructions / महत्वपूर्ण निर्देश</strong>
          <ol className="mb-0 mt-2 ps-3 small">
            {EXAM_INSTRUCTIONS_SHORT.map((hi, i) => (
              <li key={i} className="mb-2">
                <div>{hi}</div>
                <div className="text-muted" style={{ fontSize: 11 }}>
                  {EXAM_INSTRUCTIONS_EN[i]}
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="small text-muted mb-3">{centerAddress}</p>

        <div className="d-flex justify-content-between align-items-end pt-2 border-top">
          <div className="text-center small text-muted">
            <div
              className="border-bottom border-dark mb-1 mx-auto"
              style={{ width: 120, height: 28 }}
            />
            Candidate Signature
          </div>
          <div className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO}
              alt=""
              className="bg-dark rounded p-1 mb-1"
              style={{ height: 32, width: "auto", objectFit: "contain" }}
            />
            <div className="bg-dark text-white px-3 py-1 rounded font-monospace fw-bold small">
              {student.rollNumber || student.registrationNumber}
            </div>
          </div>
          <div className="text-center small text-muted">
            <div
              className="mb-0 mx-auto fw-semibold"
              style={{
                fontFamily: '"Segoe Script","Brush Script MT",cursive',
                fontSize: 16,
                color: "#1e3a5f",
                lineHeight: 1.1,
                minHeight: 26,
              }}
            >
              {SITE.aboutFoundation.authorizedSignatory}
            </div>
            <div
              className="border-bottom border-dark mb-1 mx-auto"
              style={{ width: 130 }}
            />
            Authorized Signatory
            <div style={{ fontSize: 10 }}>
              {SITE.aboutFoundation.managingDirectorTitle}
            </div>
          </div>
        </div>

        {/* Foundation about — fills blank A4 space (rurallysmile.org) */}
        <div
          className="mt-3 p-3 rounded border border-primary-subtle"
          style={{ background: "rgba(19, 153, 162, 0.06)" }}
        >
          <div className="d-flex flex-wrap justify-content-between align-items-baseline gap-2 mb-1">
            <div className="fw-bold text-primary small mb-0">
              {SITE.aboutFoundation.title}
              <span className="text-muted fw-normal ms-1">
                / {SITE.aboutFoundation.titleHi}
              </span>
            </div>
            <a
              href={SITE.website}
              target="_blank"
              rel="noopener noreferrer"
              className="small fw-semibold text-decoration-none"
            >
              {SITE.website.replace(/^https?:\/\//, "")}
            </a>
          </div>
          <p className="small mb-2 text-dark" style={{ lineHeight: 1.45 }}>
            {SITE.aboutFoundation.welcome}
          </p>
          <p className="small mb-2 text-secondary" style={{ lineHeight: 1.4 }}>
            <span className="fw-semibold text-dark">Our Mission: </span>
            {SITE.aboutFoundation.missionEn}
          </p>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 small">
            <span className="text-muted">
              <span className="fw-semibold text-dark">
                {SITE.aboutFoundation.managingDirector}
              </span>
              {" · "}
              {SITE.aboutFoundation.managingDirectorTitle}
              {" · "}
              {SITE.aboutFoundation.location}
            </span>
            <span className="text-primary fw-semibold">
              Transforming Rural Areas with Joy and Quality Education
            </span>
          </div>
        </div>

        <div className="text-center small text-muted mt-3 pt-2 border-top">
          Helpline: {SITE.phones.join(" / ")} ·{" "}
          <a
            href={SITE.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted"
          >
            www.rurallysmile.org
          </a>{" "}
          · PDF download is A4 (English)
        </div>
      </div>
    </div>
  );
}
