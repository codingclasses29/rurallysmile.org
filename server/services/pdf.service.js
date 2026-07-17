import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateQRBuffer } from "./qr.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BRAND = {
  teal: "#1399A2",
  orange: "#F37021",
  navy: "#0F172A",
  green: "#166534",
  muted: "#64748B",
};

const EXAM_SLOTS = {
  junior: {
    label: "Class 8",
    reportingTime: "08:30 AM",
    examTime: "09:00 AM – 10:30 AM",
  },
  senior: {
    label: "Class 9 to 10",
    reportingTime: "09:30 AM",
    examTime: "10:00 AM – 11:30 AM",
  },
};

const EXAM_INSTRUCTIONS_EN = [
  "Report to the exam centre at least 30 minutes early. Carry Admit Card and a valid photo ID.",
  "Mobile phones, smart watches, calculators, Bluetooth or any electronic devices are strictly prohibited.",
  "Do not leave the hall before submitting the answer booklet. Follow all centre rules and invigilator instructions.",
];

const HELPLINE = "Helpline: 9934276672 / 7016772619  ·  www.rurallysmile.org";

const ABOUT_FOUNDATION = {
  title: "About Rurally Smile Foundation",
  welcome:
    "At Rurally Smile Foundation, nestled in the heart of Siwan, Bihar, we are dedicated to transforming lives through education. Our mission is empowering children in rural communities with the tools and opportunities they need to thrive academically and beyond.",
  mission:
    "Our Mission: Ensure every child in Siwan has access to quality education — a fundamental right and a catalyst for social change and economic empowerment.",
  md: "Amritanshu Pandey · Managing Director · Siwan, Bihar",
  tagline: "Transforming Rural Areas with Joy and Quality Education",
  web: "www.rurallysmile.org",
  founders: [
    ["Amritanshu Pandey", "Managing Director"],
    ["Krishshna Chandra Pandey", "Director"],
    ["Bhola Yadav", "Director"],
    ["Sunil Yadav", "Director"],
  ],
};

const SUBJECTS = [
  { key: "hindi", label: "Hindi (हिंदी)" },
  { key: "math", label: "Math (गणित)" },
  { key: "gk", label: "GK (सामान्य ज्ञान)" },
  { key: "gs", label: "General Studies (सामान्य अध्ययन)" },
];

function getExamSlotForClass(cls) {
  const n = Number(String(cls || "").replace(/\D/g, ""));
  if (n >= 9) return EXAM_SLOTS.senior;
  return EXAM_SLOTS.junior;
}

function resolveLogoPath() {
  const candidates = [
    path.join(__dirname, "../assets/logo.png"),
    path.join(__dirname, "../../client/public/icons/icons.png"),
    path.join(process.cwd(), "assets/logo.png"),
    path.join(process.cwd(), "../client/public/icons/icons.png"),
  ];
  return candidates.find((p) => fs.existsSync(p)) || null;
}

/** Load image for PDF — http(s) URL, local uploads path, or absolute file */
async function loadImageBuffer(src) {
  if (!src || typeof src !== "string") return null;
  const trimmed = src.trim();
  if (!trimmed) return null;

  try {
    if (/^https?:\/\//i.test(trimmed)) {
      const res = await fetch(trimmed, {
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) return null;
      const buf = Buffer.from(await res.arrayBuffer());
      return buf.length > 100 ? buf : null;
    }

    const rel = trimmed.replace(/^\/+/, "");
    const locals = [
      trimmed,
      path.join(__dirname, "..", trimmed),
      path.join(__dirname, "..", rel),
      path.join(process.cwd(), trimmed),
      path.join(process.cwd(), "uploads", path.basename(trimmed)),
    ];
    for (const p of locals) {
      if (fs.existsSync(p) && fs.statSync(p).isFile()) {
        return fs.readFileSync(p);
      }
    }
  } catch {
    return null;
  }
  return null;
}

export const createPDF = (options = {}) => {
  return new PDFDocument({
    size: "A4",
    margin: 28,
    autoFirstPage: true,
    bufferPages: true,
    ...options,
  });
};

export const pdfToBuffer = (doc) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
};

function drawLogo(doc, x, y, w = 88) {
  const logo = resolveLogoPath();
  if (!logo) return false;
  try {
    doc.image(logo, x, y, { width: w });
    return true;
  } catch {
    return false;
  }
}

/** Faint centered logo watermark (admit + marksheet PDF) */
function drawWatermark(doc) {
  const logo = resolveLogoPath();
  if (!logo) return;
  try {
    const pageW = doc.page.width;
    const pageH = doc.page.height;
    const w = 280;
    doc.save();
    doc.opacity(0.07);
    doc.image(logo, (pageW - w) / 2, (pageH - w * 0.52) / 2, { width: w });
    doc.restore();
  } catch {
    /* skip watermark */
  }
}

function drawPhotoBox(doc, x, y, w, h, photoBuf) {
  doc.rect(x, y, w, h).strokeColor("#94a3b8").lineWidth(1).stroke();
  if (photoBuf) {
    try {
      doc.image(photoBuf, x + 1, y + 1, {
        fit: [w - 2, h - 2],
        align: "center",
        valign: "center",
      });
      return true;
    } catch {
      /* fall through */
    }
  }
  doc
    .fontSize(8)
    .fillColor(BRAND.muted)
    .text("PHOTO", x, y + h / 2 - 6, { width: w, align: "center" });
  return false;
}

function drawDocHeader(doc, { titleEn, subtitleEn, accent }) {
  doc.rect(0, 0, 595, 8).fill(accent);

  const hasLogo = drawLogo(doc, 40, 18, 100);
  const textX = hasLogo ? 155 : 40;

  doc
    .fillColor(BRAND.teal)
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("Rurally Smile Foundation", textX, 22, { width: 280 });
  doc
    .fillColor(BRAND.navy)
    .fontSize(13)
    .text("Pratibha Khoj Competition 2026", textX, 42, { width: 300 });
  doc
    .fillColor(accent)
    .fontSize(14)
    .text(titleEn, textX, 62, { width: 300 });
  if (subtitleEn) {
    doc
      .fillColor(BRAND.muted)
      .font("Helvetica")
      .fontSize(8)
      .text(subtitleEn, textX, 80, { width: 300 });
  }

  doc
    .moveTo(36, 100)
    .lineTo(559, 100)
    .strokeColor(accent)
    .lineWidth(1.5)
    .stroke();

  return 112;
}

function drawFooter(doc) {
  const bottom = doc.page.height - 32;
  doc
    .fontSize(8)
    .fillColor(BRAND.muted)
    .text(HELPLINE, 36, bottom, {
      align: "center",
      width: doc.page.width - 72,
      lineBreak: false,
    });
}

/**
 * Compact single-page English Admit Card (exam hall-ticket style)
 * — photo embedded, everything fits on 1 A4 page
 */
export const createAdmitCardPDF = async (student, admitCard) => {
  const doc = createPDF({ margin: 28 });
  const done = pdfToBuffer(doc);
  const pageW = doc.page.width;
  const pageH = doc.page.height;
  const left = 28;
  const right = pageW - 28;
  const contentW = right - left;

  const slot = getExamSlotForClass(student.class);
  const photoBuf = await loadImageBuffer(student.photo);
  const signatureBuf = await loadImageBuffer(student.signature);

  drawWatermark(doc);

  // Outer border
  doc
    .rect(18, 18, pageW - 36, pageH - 36)
    .lineWidth(1.5)
    .strokeColor(BRAND.green)
    .stroke();
  doc
    .rect(22, 22, pageW - 44, pageH - 44)
    .lineWidth(0.5)
    .strokeColor("#86EFAC")
    .stroke();

  doc.rect(28, 28, contentW, 5).fill(BRAND.green);

  let y = 40;
  const hasLogo = drawLogo(doc, left, y, 72);
  const textX = hasLogo ? left + 82 : left;

  doc
    .fillColor(BRAND.teal)
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Rurally Smile Foundation", textX, y + 2, { width: 260 });
  doc
    .fillColor(BRAND.navy)
    .fontSize(11)
    .text("Pratibha Khoj Competition 2026", textX, y + 16, { width: 280 });
  doc
    .fillColor(BRAND.green)
    .fontSize(15)
    .text("ADMIT CARD", textX, y + 32, { width: 280 });

  try {
    const qr = await generateQRBuffer(
      JSON.stringify({
        type: "admit",
        reg: student.registrationNumber,
        roll: student.rollNumber,
      })
    );
    doc.image(qr, right - 64, y, { width: 58 });
    doc
      .fontSize(6)
      .fillColor(BRAND.muted)
      .text(String(student.registrationNumber || ""), right - 72, y + 60, {
        width: 74,
        align: "center",
      });
  } catch {
    /* skip */
  }

  y = 112;
  doc
    .moveTo(left, y)
    .lineTo(right, y)
    .strokeColor(BRAND.green)
    .lineWidth(1)
    .stroke();
  y += 8;

  // Passport photo
  const photoW = 90;
  const photoH = 110;
  const photoX = right - photoW;
  drawPhotoBox(doc, photoX, y, photoW, photoH, photoBuf);

  const examDateLabel = admitCard.examDate
    ? new Date(admitCard.examDate).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Saturday, 05 September 2026";

  const centre =
    admitCard.examCenter?.centerName ||
    admitCard.examCenter?.name ||
    "Utkramit Uchch Vidyalaya, Ratnpura";

  const rows = [
    ["Student Name", student.name],
    ["Father's Name", student.fatherName],
    ["Mother's Name", student.motherName],
    ["Class", `${student.class} (${slot.label})`],
    ["Roll Number", student.rollNumber],
    ["Registration No.", student.registrationNumber],
    ["School Name", student.schoolName],
    ["Exam Date", examDateLabel],
    ["Exam Time", slot.examTime],
    ["Reporting Time", slot.reportingTime],
    ["Exam Centre", centre],
    [
      "Room / Seat",
      `${admitCard.roomNumber || "—"} / ${admitCard.seatNumber || "—"}`,
    ],
  ];

  const detailsRight = photoX - 12;
  doc.fontSize(9).fillColor(BRAND.navy);
  rows.forEach(([label, value]) => {
    doc.font("Helvetica-Bold").text(`${label}:`, left, y, {
      width: 115,
      lineBreak: false,
    });
    doc.font("Helvetica").text(String(value || "—"), left + 118, y, {
      width: detailsRight - left - 118,
      lineBreak: false,
      ellipsis: true,
    });
    y += 14;
  });

  y = Math.max(y + 6, 120 + photoH + 8);

  // Schedule
  doc.roundedRect(left, y, contentW, 30, 3).fillAndStroke("#ECFDF5", "#86EFAC");
  doc
    .fillColor(BRAND.green)
    .font("Helvetica-Bold")
    .fontSize(8)
    .text("Official Schedule", left + 8, y + 4);
  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor(BRAND.navy)
    .text(
      "Class 8: 09:00 AM – 10:30 AM (Report 08:30 AM)  |  Class 9–10: 10:00 AM – 11:30 AM (Report 09:30 AM)",
      left + 8,
      y + 16,
      { width: contentW - 16 }
    );
  y += 38;

  // Instructions
  const instrH = 62;
  doc.roundedRect(left, y, contentW, instrH, 3).fillAndStroke("#FEF3C7", "#F59E0B");
  doc
    .fillColor("#92400E")
    .font("Helvetica-Bold")
    .fontSize(8)
    .text("Important Instructions", left + 8, y + 4);
  doc.font("Helvetica").fontSize(7).fillColor("#78350F");
  EXAM_INSTRUCTIONS_EN.forEach((line, i) => {
    doc.text(`${i + 1}. ${line}`, left + 8, y + 16 + i * 14, {
      width: contentW - 16,
      height: 13,
      ellipsis: true,
      lineBreak: false,
    });
  });
  y += instrH + 8;

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(BRAND.navy)
    .text(
      admitCard.examCenter?.address ||
        "Utkramit Uchch Vidyalaya, Ratnpura, District Siwan (Bihar)",
      left,
      y,
      { width: contentW, height: 16, lineBreak: false, ellipsis: true }
    );
  y += 18;

  // Roll bar
  doc.rect(left + 140, y, contentW - 280, 20).fill(BRAND.navy);
  doc
    .fillColor("#fff")
    .font("Helvetica-Bold")
    .fontSize(10)
    .text(
      String(student.rollNumber || student.registrationNumber || ""),
      left + 140,
      y + 4,
      { width: contentW - 280, align: "center" }
    );
  y += 32;

  // Signatures
  const sigY = Math.min(y + 8, pageH - 200);
  if (signatureBuf) {
    try {
      doc.image(signatureBuf, left, sigY - 30, {
        fit: [120, 28],
        align: "center",
      });
    } catch {
      /* skip */
    }
  }
  doc
    .moveTo(left, sigY)
    .lineTo(left + 130, sigY)
    .strokeColor("#94a3b8")
    .lineWidth(0.8)
    .stroke();
  doc
    .fontSize(7)
    .fillColor(BRAND.muted)
    .text("Candidate Signature", left, sigY + 4, { width: 130 });

  doc.moveTo(right - 130, sigY).lineTo(right, sigY).stroke();
  doc
    .font("Helvetica-Oblique")
    .fontSize(11)
    .fillColor("#1e3a5f")
    .text(ABOUT_FOUNDATION.founders[0][0], right - 130, sigY - 16, {
      width: 130,
      align: "center",
      lineBreak: false,
    });
  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor(BRAND.muted)
    .text("Authorized Signatory", right - 130, sigY + 4, {
      width: 130,
      align: "center",
    });
  doc
    .fontSize(6)
    .text("Managing Director", right - 130, sigY + 14, {
      width: 130,
      align: "center",
    });

  // About foundation — fills blank space above footer (rurallysmile.org)
  let aboutY = sigY + 22;
  const aboutBottom = pageH - 48;
  const aboutH = Math.max(72, Math.min(120, aboutBottom - aboutY));
  if (aboutH >= 64) {
    doc
      .roundedRect(left, aboutY, contentW, aboutH, 4)
      .fillAndStroke("#ECFEFF", BRAND.teal);
    doc
      .fillColor(BRAND.teal)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text(ABOUT_FOUNDATION.title, left + 8, aboutY + 6, {
        width: contentW - 110,
        lineBreak: false,
      });
    doc
      .fillColor(BRAND.teal)
      .font("Helvetica")
      .fontSize(7)
      .text(ABOUT_FOUNDATION.web, left + 8, aboutY + 6, {
        width: contentW - 16,
        align: "right",
        lineBreak: false,
      });
    doc
      .fillColor(BRAND.navy)
      .font("Helvetica")
      .fontSize(7)
      .text(ABOUT_FOUNDATION.welcome, left + 8, aboutY + 18, {
        width: contentW - 16,
        height: 32,
        align: "left",
      });
    doc
      .fillColor(BRAND.muted)
      .fontSize(6.5)
      .text(ABOUT_FOUNDATION.mission, left + 8, aboutY + 52, {
        width: contentW - 16,
        height: 22,
      });
    doc
      .fillColor(BRAND.navy)
      .font("Helvetica-Bold")
      .fontSize(7)
      .text(ABOUT_FOUNDATION.md, left + 8, aboutY + aboutH - 18, {
        width: contentW - 16,
        lineBreak: false,
      });
    doc
      .fillColor(BRAND.orange)
      .font("Helvetica")
      .fontSize(6.5)
      .text(ABOUT_FOUNDATION.tagline, left + 8, aboutY + aboutH - 18, {
        width: contentW - 16,
        align: "right",
        lineBreak: false,
      });
  }

  // Footer on same page only
  doc
    .fontSize(7)
    .fillColor(BRAND.muted)
    .text(HELPLINE, left, pageH - 40, {
      width: contentW,
      align: "center",
      lineBreak: false,
    });

  // Drop any accidental extra blank pages
  const range = doc.bufferedPageRange();
  if (range.count > 1) {
    // Keep only first page content — pdfkit doesn't delete easily;
    // layout is designed for 1 page so this shouldn't happen.
  }

  doc.end();
  return done;
};

export const createMarksheetPDF = async (student, result) => {
  const doc = createPDF();
  const done = pdfToBuffer(doc);

  drawWatermark(doc);

  let y = drawDocHeader(doc, {
    titleEn: "MARKSHEET",
    subtitleEn: "Official Digital Marksheet — Pratibha Khoj 2026",
    accent: BRAND.teal,
  });

  const photoBuf = await loadImageBuffer(student.photo);
  drawPhotoBox(doc, 480, y, 70, 88, photoBuf);

  try {
    const qr = await generateQRBuffer(
      JSON.stringify({
        type: "marksheet",
        roll: student.rollNumber,
        total: result.total ?? result.marks,
        pct: result.percentage,
      })
    );
    doc.image(qr, 480, y + 95, { width: 70 });
  } catch {
    /* skip */
  }

  doc.fontSize(10).fillColor(BRAND.navy);
  const info = [
    ["Name", student.name],
    ["Father", student.fatherName],
    ["Class", student.class],
    ["Roll No.", student.rollNumber],
    ["School", student.schoolName],
  ];
  info.forEach(([label, value]) => {
    doc.font("Helvetica-Bold").text(`${label}:`, 40, y, { width: 100 });
    doc.font("Helvetica").text(String(value || "—"), 145, y, { width: 300 });
    y += 16;
  });

  y = Math.max(y, 220);
  doc.rect(40, y, 515, 22).fill(BRAND.navy);
  doc.fillColor("#fff").font("Helvetica-Bold").fontSize(9);
  doc.text("Particulars", 48, y + 6, { width: 200 });
  doc.text("Full", 260, y + 6, { width: 60, align: "center" });
  doc.text("Pass", 330, y + 6, { width: 60, align: "center" });
  doc.text("Obtained", 420, y + 6, { width: 70, align: "center" });
  y += 22;

  const obtained = result.total ?? result.marks ?? 0;
  doc.rect(40, y, 515, 36).fill("#F8FAFC");
  doc.fillColor(BRAND.navy).font("Helvetica").fontSize(9);
  doc.text("Pratibha Khoj Exam (Combined Paper)", 48, y + 8, { width: 200 });
  doc.text("Hindi · Math · GK · GS", 48, y + 20, { width: 200 });
  doc.text("100", 260, y + 12, { width: 60, align: "center" });
  doc.text("33", 330, y + 12, { width: 60, align: "center" });
  doc.font("Helvetica-Bold").fontSize(12).text(String(obtained), 420, y + 12, {
    width: 70,
    align: "center",
  });
  y += 36;

  doc.rect(40, y, 515, 26).fill("#ECFDF5");
  doc.fillColor(BRAND.green).font("Helvetica-Bold").fontSize(10);
  doc.text("Grand Total", 48, y + 7, { width: 200 });
  doc.text("100", 260, y + 7, { width: 60, align: "center" });
  doc.text(String(obtained), 420, y + 7, { width: 70, align: "center" });
  y += 40;

  const isPass = String(result.status || "").toLowerCase() === "pass";
  doc.font("Helvetica").fontSize(11).fillColor(BRAND.navy);
  doc.text(`Percentage: ${result.percentage ?? 0}%`, 40, y);
  doc
    .fillColor(isPass ? BRAND.green : "#DC2626")
    .font("Helvetica-Bold")
    .text(`Result: ${result.status || "—"}`, 220, y);
  doc.fillColor(BRAND.teal).text(`Grade: ${result.grade || "—"}`, 380, y);
  y += 28;

  // Authorized digital signature — Amritanshu Pandey
  doc
    .font("Helvetica-Oblique")
    .fontSize(12)
    .fillColor("#1e3a5f")
    .text("Amritanshu Pandey", 400, y, {
      width: 150,
      align: "center",
      lineBreak: false,
    });
  doc
    .moveTo(410, y + 16)
    .lineTo(540, y + 16)
    .strokeColor("#334155")
    .lineWidth(0.8)
    .stroke();
  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor(BRAND.muted)
    .text("अधिकृत हस्ताक्षर / Authorized Signatory", 400, y + 20, {
      width: 150,
      align: "center",
    });
  doc
    .fontSize(6)
    .text("Managing Director", 400, y + 30, {
      width: 150,
      align: "center",
    });
  y += 48;

  // About foundation + founders — fill blank space, keep 1 page
  const pageH = doc.page.height;
  const aboutBottom = pageH - 48;
  const aboutH = Math.max(110, Math.min(160, aboutBottom - y - 8));
  if (aboutH >= 100) {
    doc
      .roundedRect(40, y, 515, aboutH, 4)
      .fillAndStroke("#ECFEFF", BRAND.teal);
    doc
      .fillColor(BRAND.teal)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text(ABOUT_FOUNDATION.title, 48, y + 6, {
        width: 360,
        lineBreak: false,
      });
    doc
      .fillColor(BRAND.teal)
      .font("Helvetica")
      .fontSize(7)
      .text(ABOUT_FOUNDATION.web, 48, y + 6, {
        width: 499,
        align: "right",
        lineBreak: false,
      });
    doc
      .fillColor(BRAND.navy)
      .font("Helvetica")
      .fontSize(7)
      .text(ABOUT_FOUNDATION.welcome, 48, y + 18, {
        width: 499,
        height: 28,
      });
    doc
      .fillColor(BRAND.muted)
      .fontSize(6.5)
      .text(ABOUT_FOUNDATION.mission, 48, y + 48, {
        width: 499,
        height: 18,
      });
    doc
      .fillColor(BRAND.navy)
      .font("Helvetica-Bold")
      .fontSize(7)
      .text("Our Main Faces / Founders", 48, y + 68, { lineBreak: false });

    const colW = 120;
    ABOUT_FOUNDATION.founders.forEach(([name, role], i) => {
      const fx = 48 + i * colW;
      doc
        .fillColor(BRAND.navy)
        .font("Helvetica-Bold")
        .fontSize(7)
        .text(name, fx, y + 80, { width: colW - 8, lineBreak: false });
      doc
        .fillColor(BRAND.muted)
        .font("Helvetica")
        .fontSize(6)
        .text(role, fx, y + 92, { width: colW - 8, lineBreak: false });
    });

    doc
      .fillColor(BRAND.orange)
      .font("Helvetica")
      .fontSize(6.5)
      .text(
        `${ABOUT_FOUNDATION.tagline} · Siwan, Bihar`,
        48,
        y + aboutH - 14,
        { width: 499, lineBreak: false }
      );
  }

  drawFooter(doc);
  doc.end();
  return done;
};

export const createRegistrationReceiptPDF = async (student) => {
  const doc = createPDF();
  const done = pdfToBuffer(doc);

  let y = drawDocHeader(doc, {
    titleEn: "REGISTRATION RECEIPT",
    subtitleEn: "Registration Acknowledgement — Pratibha Khoj 2026",
    accent: BRAND.orange,
  });

  const photoBuf = await loadImageBuffer(student.photo);
  drawPhotoBox(doc, 450, y, 80, 100, photoBuf);

  doc.fillColor(BRAND.navy).fontSize(11).font("Helvetica");
  const rows = [
    ["Registration No", student.registrationNumber],
    ["Student Name", student.name],
    ["Father Name", student.fatherName],
    ["Class", student.class],
    ["School", student.schoolName],
    ["Mobile", student.mobile],
    ["District", student.district],
    ["Exam Centre", "Utkramit Uchch Vidyalaya, Ratnpura"],
    ["Status", student.status || "Pending"],
    [
      "Date",
      student.createdAt
        ? new Date(student.createdAt).toLocaleString("en-IN")
        : new Date().toLocaleString("en-IN"),
    ],
  ];

  rows.forEach(([label, value]) => {
    doc.font("Helvetica-Bold").text(`${label}: `, 50, y, { continued: true });
    doc.font("Helvetica").text(String(value || "N/A"));
    y += 18;
  });

  try {
    const qr = await generateQRBuffer(
      JSON.stringify({
        reg: student.registrationNumber,
        name: student.name,
        class: student.class,
      })
    );
    doc.image(qr, 450, y + 20, { width: 90 });
  } catch {
    /* skip */
  }

  drawFooter(doc);
  doc.end();
  return done;
};

export default {
  createPDF,
  pdfToBuffer,
  createAdmitCardPDF,
  createMarksheetPDF,
  createRegistrationReceiptPDF,
};
