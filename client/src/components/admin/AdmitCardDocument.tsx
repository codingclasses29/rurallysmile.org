"use client";

import {
  EXAM_INSTRUCTIONS_EN,
  SITE,
  getExamSlotForClass,
} from "@/constants/site";
import { StudentPhoto } from "@/components/StudentPhoto";
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

function docId(roll?: string) {
  const digits = String(roll || "")
    .replace(/\D/g, "")
    .slice(-7)
    .padStart(7, "0");
  return `PK2026/${digits}`;
}

/** F4 admit card preview — matches PDF template */
export function AdmitCardDocument({ student, admit, zoom = 1 }: Props) {
  const center =
    typeof admit.examCenter === "object" && admit.examCenter
      ? (admit.examCenter as ExamCenter)
      : null;
  const centerName =
    center?.centerName || center?.name || SITE.examCentreEn;
  const centerAddress = center?.address || "Ratnpura, District Siwan (Bihar)";
  const slot = getExamSlotForClass(student.class);
  const admitId = docId(student.rollNumber);

  const infoRows: [string, string][] = [
    ["Name", (student.name || "—").toUpperCase()],
    ["Father's Name", (student.fatherName || "—").toUpperCase()],
    ["Class", `${student.class} (${slot.classesLabelEn})`],
    ["Roll No.", student.rollNumber || "—"],
    ["Registration No.", student.registrationNumber || "—"],
    ["School", (student.schoolName || "—").toUpperCase()],
    ["Exam", "PRATIBHA KHOJ EXAM (COMBINED PAPER)"],
    ["Subjects", "HINDI · MATH · GK · GS"],
  ];

  const detailBoxes = [
    { label: "EXAM DATE", value: fmtDateEn(admit.examDate) },
    { label: "EXAM TIME", value: slot.examTime },
    { label: "EXAM CENTRE", value: `${centerName}\n${centerAddress}` },
    { label: "REPORTING", value: slot.reportingTime },
  ];

  return (
    <div
      className="admit-card-f4 doc-with-watermark portal-doc-print"
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: "top center",
      }}
    >
      <div className="doc-f4-inner">
        <div className="d-flex align-items-start justify-content-between gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO}
            alt="Rurally Smile Foundation"
            className="bg-dark rounded p-1"
            style={{ width: 72, height: "auto", objectFit: "contain" }}
          />
          <div className="flex-grow-1 text-center px-1">
            <div className="fw-bold" style={{ color: "#0F766E", fontSize: 15 }}>
              RURALLY SMILE FOUNDATION
            </div>
            <div className="fw-bold text-dark" style={{ fontSize: 12 }}>
              PRATIBHA KHOJ COMPETITION 2026
            </div>
            <div className="mt-2">
              <span
                className="badge rounded-pill px-4 py-2"
                style={{ background: "#0F766E", fontSize: 12 }}
              >
                ADMIT CARD
              </span>
            </div>
            <div className="small text-muted mt-1">
              (Pratibha Khoj Exam — Combined Paper)
            </div>
          </div>
          <div className="text-end" style={{ minWidth: 110 }}>
            <div className="small text-muted" style={{ fontSize: 10 }}>
              ADMIT CARD ID
            </div>
            <div className="fw-bold text-danger font-monospace small">
              {admitId}
            </div>
          </div>
        </div>

        <hr className="my-2 border-success opacity-50" />

        <div className="row g-3 mb-2">
          <div className="col">
            <table className="table table-sm table-borderless mb-0 small">
              <tbody>
                {infoRows.map(([k, v]) => (
                  <tr key={k}>
                    <th className="text-muted fw-semibold pe-2" style={{ width: "34%" }}>
                      {k}:
                    </th>
                    <td className="fw-semibold">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-auto text-center">
            <StudentPhoto
              src={student.photo}
              width={88}
              height={108}
              className="mx-auto mb-2 rounded-0"
            />
            <div
              className="border border-2 border-info d-flex align-items-center justify-content-center bg-white mx-auto"
              style={{ width: 72, height: 72 }}
            >
              <i className="bi bi-qr-code fs-1 text-primary" />
            </div>
            <div className="small text-muted mt-1" style={{ fontSize: 9 }}>
              Scan to Verify
            </div>
          </div>
        </div>

        <div
          className="text-white fw-bold small px-2 py-1 mb-2"
          style={{ background: "#0F766E" }}
        >
          EXAM DETAILS
        </div>
        <div className="row g-2 mb-2">
          {detailBoxes.map((b) => (
            <div className="col-6 col-md-3" key={b.label}>
              <div
                className="rounded-3 h-100 text-center p-2"
                style={{
                  border: "1px solid #99F6E4",
                  background: "#F8FFFE",
                  minHeight: 72,
                }}
              >
                <div
                  className="fw-bold small"
                  style={{ color: "#0F766E", fontSize: 10 }}
                >
                  {b.label}
                </div>
                <div
                  className="fw-semibold small mt-1"
                  style={{ whiteSpace: "pre-line", fontSize: 11 }}
                >
                  {b.value}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="small text-muted fst-italic mb-2">
          Note: Late entry may not be allowed after reporting closes. Carry Admit
          Card + valid photo ID.
        </p>

        <div className="row g-3 mb-2">
          <div className="col-md-7">
            <div
              className="rounded-3 p-3 h-100"
              style={{ border: "1px solid #0D9488", background: "#ECFEFF" }}
            >
              <div className="fw-bold small mb-2" style={{ color: "#0F766E" }}>
                IMPORTANT INSTRUCTIONS
              </div>
              <ul className="small mb-0 ps-3">
                {EXAM_INSTRUCTIONS_EN.map((line) => (
                  <li key={line} className="mb-1">
                    {line}
                  </li>
                ))}
                <li className="mb-0">
                  Keep the bottom portion of this admit card safe for records.
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-5 text-center">
            <div
              className="fw-semibold mb-1"
              style={{
                fontFamily: '"Segoe Script","Brush Script MT",cursive',
                fontSize: 18,
                color: "#1e3a5f",
              }}
            >
              {SITE.aboutFoundation.authorizedSignatory}
            </div>
            <div className="fw-bold small">
              {SITE.aboutFoundation.authorizedSignatory}
            </div>
            <div className="text-muted" style={{ fontSize: 11 }}>
              Managing Director · Rurally Smile Foundation
            </div>
            <div
              className="rounded-circle border border-2 mx-auto mt-3 d-flex align-items-center justify-content-center"
              style={{
                width: 72,
                height: 72,
                borderColor: "#0F766E",
                color: "#0F766E",
                fontSize: 9,
              }}
            >
              <div className="text-center fw-bold">
                RSF
                <br />
                SIWAN
              </div>
            </div>
          </div>
        </div>

        <div className="position-relative text-center my-3">
          <hr className="border-success border-dashed opacity-75" />
          <span
            className="position-absolute top-50 start-50 translate-middle badge rounded-pill px-3"
            style={{ background: "#0F766E" }}
          >
            KEEP THIS PORTION SAFE
          </span>
        </div>

        <div
          className="rounded-3 p-3 small mb-2"
          style={{ background: "#F0FDFA", border: "1px solid #99F6E4" }}
        >
          <div className="row g-2">
            <div className="col-md-6">
              <div>
                <strong>Name:</strong> {(student.name || "—").toUpperCase()}
              </div>
              <div>
                <strong>Roll No.:</strong> {student.rollNumber || "—"}
              </div>
              <div>
                <strong>Exam Date:</strong> {fmtDateEn(admit.examDate)}
              </div>
            </div>
            <div className="col-md-6">
              <div>
                <strong>Centre:</strong> {centerName}
              </div>
              <div>
                <strong>Exam:</strong> Combined Paper · Class {student.class}
              </div>
              <div>
                <strong>Helpline:</strong> {SITE.phones.join(" / ")}
              </div>
            </div>
          </div>
        </div>

        <div
          className="text-center text-white small py-2 rounded-1"
          style={{ background: "#0F766E" }}
        >
          www.rurallysmile.org · {SITE.aboutFoundation.tagline} · Siwan, Bihar ·
          F4 Print
        </div>
      </div>
    </div>
  );
}
