"use client";

import { SITE } from "@/constants/site";
import type { AdminStudent, ResultRow } from "@/services/admin.service";

const LOGO = "/icons/icons.png";

type Props = {
  student: Partial<AdminStudent> & { motherName?: string; dob?: string };
  result: ResultRow;
  zoom?: number;
};

const PAPER_MAX = 100;
const PASS_MARKS = 33;

/** Marksheet — Bootstrap 5 + logo watermark · total out of 100 */
export function MarksheetDocument({ student, result, zoom = 1 }: Props) {
  const obtained = result.total ?? result.marks ?? 0;
  const maxMarks = result.maxMarks || PAPER_MAX;
  const isPass = (result.status || "").toLowerCase() === "pass";
  const pct = result.percentage ?? 0;
  const remark =
    pct >= 80
      ? "उत्कृष्ट प्रदर्शन"
      : pct >= 60
        ? "अच्छा प्रदर्शन"
        : isPass
          ? "संतोषजनक"
          : "पुनः प्रयास करें";

  const infoRows: [string, string][] = [
    ["नाम / Name", student.name || "—"],
    ["पिता / Father", student.fatherName || "—"],
    ["माता / Mother", student.motherName || "—"],
    ["कक्षा / Class", student.class ? String(student.class) : "—"],
    ["रोल नं. / Roll", student.rollNumber || "—"],
    ["पंजीकरण / Reg.", student.registrationNumber || "—"],
    ["विद्यालय / School", student.schoolName || "—"],
  ];

  return (
    <div
      className="marksheet-doc-sheet doc-with-watermark portal-doc-print"
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: "top center",
      }}
    >
      <div
        style={{
          height: 6,
          background: "linear-gradient(90deg,#1399a2,#f97316)",
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
        <div className="flex-grow-1 text-center">
          <div className="fw-bold text-primary small">
            Rurally Smile Foundation
          </div>
          <div className="fw-bold text-dark" style={{ fontSize: 15 }}>
            प्रतिभा खोज प्रतियोगिता 2026
          </div>
          <div className="fw-bold text-primary mt-1" style={{ fontSize: 16 }}>
            अंक पत्र (MARKSHEET)
          </div>
          <div className="small text-muted">
            Total Marks · {PAPER_MAX} · Pass {PASS_MARKS}%
          </div>
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
            {student.rollNumber}
          </div>
        </div>
      </div>

      <hr className="mx-3 my-2 border-primary opacity-75" />

      <div className="marksheet-document-content px-3 px-md-4 pb-5">
        <div className="row g-3 mb-3">
          <div className="col">
            <table className="table table-sm table-borderless mb-0 small">
              <tbody>
                {infoRows.map(([k, v]) => (
                  <tr key={k}>
                    <th
                      className="text-muted fw-semibold pe-2"
                      style={{ width: "40%" }}
                    >
                      {k}
                    </th>
                    <td className="fw-semibold">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-auto text-center">
            <div
              className="border border-2 border-primary-subtle bg-light mx-auto overflow-hidden rounded"
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
          </div>
        </div>

        <table className="table table-bordered table-sm mb-3">
          <thead className="table-dark">
            <tr>
              <th>Particulars</th>
              <th className="text-center">पूर्णांक</th>
              <th className="text-center">उत्तीर्ण</th>
              <th className="text-center">प्राप्तांक</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                Pratibha Khoj Exam / प्रतिभा खोज परीक्षा
                <div className="small text-muted">
                  Combined paper (Hindi · Math · GK · GS)
                </div>
              </td>
              <td className="text-center fw-bold">{maxMarks}</td>
              <td className="text-center">{PASS_MARKS}</td>
              <td className="text-center fs-5 fw-bold text-primary">
                {obtained}
              </td>
            </tr>
            <tr className="table-success fw-bold">
              <td>Grand Total</td>
              <td className="text-center">{maxMarks}</td>
              <td className="text-center">{PASS_MARKS}%</td>
              <td className="text-center">{obtained}</td>
            </tr>
          </tbody>
        </table>

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-2">
          <div>
            <div className="small text-muted">Percentage</div>
            <div className="fw-bold fs-5 text-primary">{pct.toFixed(2)}%</div>
            <div className="small mt-1">
              Remark: <strong>{remark}</strong>
            </div>
          </div>
          <div className="text-center">
            <span
              className={`badge fs-6 px-3 py-2 ${
                isPass ? "text-bg-success" : "text-bg-danger"
              }`}
            >
              {result.status || "—"}
            </span>
            <div className="mt-2">
              <span className="badge text-bg-info">
                Grade: {result.grade || "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="small text-muted mb-2" style={{ fontSize: 11 }}>
          Grade: A+ ≥80% · A ≥70% · B+ ≥60% · B ≥50% · C ≥40% · D ≥33% · E
          &lt;33%
        </div>

        {/* Foundation + founder — fills blank A4 space, single page */}
        <div
          className="p-3 rounded border border-primary-subtle mb-2"
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
            Our Main Faces / संस्था के प्रमुख
          </div>
          <div className="row g-1 small mb-2">
            {SITE.aboutFoundation.founders.map((f) => (
              <div className="col-6 col-md-3" key={f.name}>
                <div className="fw-semibold text-dark">{f.name}</div>
                <div className="text-muted" style={{ fontSize: 11 }}>
                  {f.role}
                </div>
              </div>
            ))}
          </div>
          <div className="small text-primary fw-semibold">
            {SITE.aboutFoundation.tagline} · {SITE.aboutFoundation.location}
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-end pt-2 border-top">
          <div className="small text-muted" style={{ maxWidth: "55%" }}>
            यह डिजिटल मार्कशीट {SITE.org} द्वारा जारी। सत्यापन: QR / website।
          </div>
          <div className="text-center small">
            <div
              className="mb-0 mx-auto fw-semibold"
              style={{
                fontFamily: '"Segoe Script","Brush Script MT",cursive',
                fontSize: 18,
                color: "#1e3a5f",
                lineHeight: 1.1,
                minHeight: 28,
              }}
            >
              {SITE.aboutFoundation.authorizedSignatory}
            </div>
            <div
              className="border-bottom border-dark mb-1 mx-auto"
              style={{ width: 130 }}
            />
            <div className="text-muted" style={{ fontSize: 11 }}>
              {SITE.aboutFoundation.authorizedSignatoryLabel}
            </div>
            <div className="text-muted" style={{ fontSize: 10 }}>
              {SITE.aboutFoundation.managingDirectorTitle}
            </div>
          </div>
        </div>

        <div className="marksheet-document-footer text-center small text-muted pt-2 border-top">
          Helpline: {SITE.phones.join(" / ")} ·{" "}
          <a
            href={SITE.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted"
          >
            www.rurallysmile.org
          </a>
        </div>
      </div>
    </div>
  );
}
