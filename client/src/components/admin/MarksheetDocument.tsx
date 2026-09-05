"use client";

import { SITE } from "@/constants/site";
import { StudentPhoto } from "@/components/StudentPhoto";
import type { AdminStudent, ResultRow } from "@/services/admin.service";

const LOGO = "/icons/icons.png";

type Props = {
  student: Partial<AdminStudent> & { motherName?: string; dob?: string };
  result: ResultRow;
  zoom?: number;
};

const PAPER_MAX = 40;
const PASS_MARKS = 14;

function docId(roll?: string) {
  const digits = String(roll || "")
    .replace(/\D/g, "")
    .slice(-7)
    .padStart(7, "0");
  return `PK2026/${digits}`;
}

/** F4 official marksheet preview — matches PDF template */
export function MarksheetDocument({ student, result, zoom = 1 }: Props) {
  const obtained = result.total ?? result.marks ?? 0;
  const maxMarks = result.maxMarks || PAPER_MAX;
  const isPass = (result.status || "").toLowerCase() === "pass";
  const pct = result.percentage ?? 0;
  const marksheetId = docId(student.rollNumber);

  const infoRows: [string, string][] = [
    ["Name", (student.name || "—").toUpperCase()],
    ["Father's Name", (student.fatherName || "—").toUpperCase()],
    ["Class", student.class ? String(student.class) : "—"],
    ["Roll No.", student.rollNumber || "—"],
    ["School", (student.schoolName || "—").toUpperCase()],
    ["Exam", "PRATIBHA KHOJ EXAM (COMBINED PAPER)"],
    ["Subjects", "HINDI · MATH · GK · GS"],
  ];

  const issueDate = new Date(
    result.updatedAt || result.createdAt || Date.now()
  ).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className="marksheet-doc-f4 doc-with-watermark portal-doc-print"
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
          <div className="flex-grow-1 text-center">
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
                OFFICIAL MARKSHEET
              </span>
            </div>
            <div className="small text-muted mt-1">
              Official Digital Marksheet — Pratibha Khoj 2026
            </div>
          </div>
          <div className="text-end" style={{ minWidth: 110 }}>
            <div className="small text-muted" style={{ fontSize: 10 }}>
              MARKSHEET ID
            </div>
            <div className="fw-bold text-danger font-monospace small">
              {marksheetId}
            </div>
          </div>
        </div>

        <hr className="my-2 border-success opacity-50" />

        <div className="row g-3 mb-3">
          <div className="col">
            <table className="table table-sm table-borderless mb-0 small">
              <tbody>
                {infoRows.map(([k, v]) => (
                  <tr key={k}>
                    <th
                      className="text-muted fw-semibold pe-2"
                      style={{ width: "34%" }}
                    >
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

        <table className="table table-bordered table-sm mb-3">
          <thead style={{ background: "#0F766E", color: "#fff" }}>
            <tr>
              <th>PARTICULARS</th>
              <th className="text-center">FULL MARKS</th>
              <th className="text-center">PASS MARKS</th>
              <th className="text-center">OBTAINED MARKS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                Pratibha Khoj Exam
                <div className="small text-muted">
                  Combined Paper — Hindi · Math · GK · GS
                </div>
              </td>
              <td className="text-center fw-bold">{maxMarks}</td>
              <td className="text-center">{PASS_MARKS}</td>
              <td className="text-center fs-4 fw-bold text-success">
                {obtained}
              </td>
            </tr>
            <tr className="table-success fw-bold">
              <td>GRAND TOTAL</td>
              <td className="text-center">{maxMarks}</td>
              <td className="text-center">—</td>
              <td className="text-center text-success fs-5">{obtained}</td>
            </tr>
          </tbody>
        </table>

        <div className="row g-2 mb-3">
          {[
            {
              label: "PERCENTAGE",
              value: `${Number(pct).toFixed(0)}%`,
              color: "#166534",
            },
            {
              label: "RESULT",
              value: (result.status || "—").toUpperCase(),
              color: isPass ? "#166534" : "#DC2626",
            },
            {
              label: "GRADE",
              value: (result.grade || "—").toUpperCase(),
              color: "#F37021",
            },
          ].map((box) => (
            <div className="col-4" key={box.label}>
              <div className="border rounded-3 text-center py-3 px-1 h-100 bg-white">
                <div className="small text-muted" style={{ fontSize: 10 }}>
                  {box.label}
                </div>
                <div className="fw-bold" style={{ color: box.color, fontSize: 26 }}>
                  {box.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <div
              className="rounded-circle border border-2 d-flex align-items-center justify-content-center mb-2"
              style={{ width: 72, height: 72, borderColor: "#0F766E", color: "#0F766E" }}
            >
              <div className="text-center fw-bold" style={{ fontSize: 9 }}>
                RSF
                <br />
                SIWAN
              </div>
            </div>
            <div className="fw-bold text-danger small">
              DATE OF ISSUE : {issueDate.toUpperCase()}
            </div>
          </div>
          <div className="text-center">
            <div
              className="fw-semibold"
              style={{
                fontFamily: '"Segoe Script","Brush Script MT",cursive',
                fontSize: 20,
                color: "#1e3a5f",
              }}
            >
              {SITE.aboutFoundation.authorizedSignatory}
            </div>
            <div className="fw-bold small">
              {SITE.aboutFoundation.authorizedSignatory}
            </div>
            <div className="text-muted" style={{ fontSize: 11 }}>
              Managing Director
            </div>
          </div>
        </div>

        <div
          className="p-3 rounded-3 mb-2"
          style={{ background: "#F0FDFA", border: "1px solid #0D9488" }}
        >
          <div className="d-flex flex-wrap justify-content-between gap-2 mb-1">
            <div className="fw-bold small" style={{ color: "#0F766E" }}>
              ABOUT RURALLY SMILE FOUNDATION
            </div>
            <a
              href={SITE.website}
              target="_blank"
              rel="noopener noreferrer"
              className="small fw-semibold text-decoration-none"
            >
              www.rurallysmile.org
            </a>
          </div>
          <p className="small mb-2 text-dark" style={{ lineHeight: 1.4 }}>
            {SITE.aboutFoundation.welcome}
          </p>
          <p className="small mb-2 text-secondary" style={{ lineHeight: 1.35 }}>
            <span className="fw-semibold text-dark">Our Mission: </span>
            {SITE.aboutFoundation.missionEn}
          </p>
          <div className="small fw-semibold text-dark mb-1">
            OUR MAIN FACES / FOUNDERS
          </div>
          <div className="row g-1 small mb-2">
            {SITE.aboutFoundation.founders.map((f) => (
              <div className="col-6 col-md-3" key={f.name}>
                <div className="fw-semibold">{f.name}</div>
                <div className="text-muted" style={{ fontSize: 11 }}>
                  {f.role}
                </div>
              </div>
            ))}
          </div>
          <div className="small fw-semibold" style={{ color: "#F37021" }}>
            {SITE.aboutFoundation.tagline} · {SITE.aboutFoundation.location}
          </div>
        </div>

        <div
          className="text-center text-white small py-2 rounded-1"
          style={{ background: "#0F766E" }}
        >
          Helpline: {SITE.phones.join(" / ")} · www.rurallysmile.org · Computer
          generated · F4 Print
        </div>
      </div>
    </div>
  );
}
