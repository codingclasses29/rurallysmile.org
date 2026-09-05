import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateQRBuffer } from "./qr.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** F4 folio — 210mm × 330mm (one page admit / marksheet) */
const F4 = [595.28, 935.43];

const BRAND = {
  teal: "#0D9488",
  tealDeep: "#0F766E",
  orange: "#F37021",
  navy: "#0F172A",
  green: "#166534",
  muted: "#64748B",
  soft: "#F0FDFA",
  line: "#99F6E4",
  red: "#DC2626",
};

const EXAM_SLOTS = {
  junior: {
    label: "Classes 7–8",
    reportingTime: "08:30 AM",
    examTime: "09:00 AM – 10:30 AM",
  },
  senior: {
    label: "Classes 9–10",
    reportingTime: "09:30 AM",
    examTime: "10:00 AM – 11:30 AM",
  },
};

const EXAM_INSTRUCTIONS_EN = [
  "Carry this Admit Card and a valid photo ID to the exam centre.",
  "Report at least 30 minutes before the exam start time.",
  "Mobile phones, smart watches, calculators and electronic devices are prohibited.",
  "Sit only at the allotted room / seat as printed on this card.",
  "Do not leave the hall before submitting the answer booklet.",
  "Follow all centre rules and invigilator instructions.",
  "Late entry may not be permitted after the gate closing time.",
  "Keep the bottom portion of this admit card safe for records.",
];

const HELPLINE = "Helpline: 9934276672 / 7016772619";
const WEB = "www.rurallysmile.org";

const ABOUT_FOUNDATION = {
  title: "ABOUT RURALLY SMILE FOUNDATION",
  welcome:
    "At Rurally Smile Foundation, nestled in the heart of Siwan, Bihar, we are dedicated to transforming lives through education. Our mission is empowering children in rural communities with the tools and opportunities they need to thrive academically and beyond.",
  mission:
    "Our Mission: Ensure every child in Siwan has access to quality education — a fundamental right and a catalyst for social change and economic empowerment.",
  tagline: "Transforming Rural Areas with Joy and Quality Education · Siwan, Bihar",
  web: WEB,
  founders: [
    ["Amritanshu Pandey", "Managing Director"],
    ["Krishshna Chandra Pandey", "Director"],
    ["Bhola Yadav", "Director"],
    ["Sunil Yadav", "Director"],
  ],
};

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

/** PDFKit can only embed JPEG and PNG — anything else must be converted first. */
function isValidImageBuffer(buf) {
  if (!Buffer.isBuffer(buf) || buf.length < 100) return false;
  // Reject UTF-8-mangled binaries (a proxy read the body as text)
  let fffd = 0;
  for (let i = 0; i < Math.min(buf.length, 600) - 2; i += 1) {
    if (buf[i] === 0xef && buf[i + 1] === 0xbf && buf[i + 2] === 0xbd) fffd += 1;
  }
  if (fffd > 8) return false;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;
  return buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
}

function cloudinaryImageCandidates(url) {
  const list = [url];
  if (!/res\.cloudinary\.com/i.test(url)) return list;
  if (url.includes("/raw/upload/")) {
    const asImage = url.replace("/raw/upload/", "/image/upload/");
    list.push(asImage);
    list.push(asImage.replace("/upload/", "/upload/f_jpg,q_auto/"));
  } else if (url.includes("/image/upload/") && !url.includes("/f_")) {
    // Covers WEBP/AVIF/HEIC originals that PDFKit cannot embed directly.
    list.push(url.replace("/upload/", "/upload/f_jpg,q_auto/"));
  }
  return list;
}

async function fetchImageBuffer(url) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(15000),
    headers: { Accept: "image/jpeg,image/png,image/webp,image/*;q=0.8,*/*;q=0.5" },
  });
  if (!res.ok) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  return isValidImageBuffer(buf) ? buf : null;
}

async function loadImageBuffer(src) {
  if (!src || typeof src !== "string") return null;
  const trimmed = src.trim();
  if (!trimmed) return null;
  try {
    if (/^https?:\/\//i.test(trimmed)) {
      for (const candidate of cloudinaryImageCandidates(trimmed)) {
        const buf = await fetchImageBuffer(candidate);
        if (buf) return buf;
      }
      return null;
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
        const buf = fs.readFileSync(p);
        if (isValidImageBuffer(buf)) return buf;
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

const createF4PDF = (options = {}) =>
  createPDF({ size: F4, margin: 24, ...options });

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

function drawWatermark(doc) {
  const logo = resolveLogoPath();
  if (!logo) return;
  try {
    const pageW = doc.page.width;
    const pageH = doc.page.height;
    const w = 300;
    doc.save();
    doc.opacity(0.06);
    doc.image(logo, (pageW - w) / 2, (pageH - w * 0.55) / 2, { width: w });
    doc.restore();
  } catch {
    /* skip */
  }
}

function drawOrnateBorder(doc) {
  const pageW = doc.page.width;
  const pageH = doc.page.height;
  doc
    .rect(14, 14, pageW - 28, pageH - 28)
    .lineWidth(1.6)
    .strokeColor(BRAND.tealDeep)
    .stroke();
  doc
    .rect(18, 18, pageW - 36, pageH - 36)
    .lineWidth(0.6)
    .strokeColor(BRAND.line)
    .stroke();
  doc
    .rect(22, 22, pageW - 44, pageH - 44)
    .lineWidth(0.4)
    .strokeColor("#CCFBF1")
    .stroke();
}

function drawPhotoBox(doc, x, y, w, h, photoBuf) {
  doc.rect(x, y, w, h).lineWidth(1.4).strokeColor(BRAND.tealDeep).stroke();
  doc.rect(x + 2, y + 2, w - 4, h - 4).lineWidth(0.5).strokeColor(BRAND.line).stroke();
  if (photoBuf) {
    try {
      doc.image(photoBuf, x + 3, y + 3, {
        fit: [w - 6, h - 6],
        align: "center",
        valign: "center",
      });
      return true;
    } catch {
      /* fall through */
    }
  }

  doc.save();
  doc.dash(3, { space: 2 });
  doc.rect(x + 5, y + 5, w - 10, h - 10).lineWidth(0.8).strokeColor("#94A3B8").stroke();
  doc.undash();
  doc.restore();

  doc
    .fontSize(8)
    .font("Helvetica-Bold")
    .fillColor(BRAND.tealDeep)
    .text("AFFIX PHOTO", x, y + h / 2 - 8, { width: w, align: "center" });
  doc
    .fontSize(6.5)
    .font("Helvetica")
    .fillColor(BRAND.muted)
    .text("Passport Size", x, y + h / 2 + 3, { width: w, align: "center" });
  return false;
}

function drawSeal(doc, cx, cy, r = 34) {
  doc.circle(cx, cy, r).lineWidth(1.8).strokeColor(BRAND.tealDeep).stroke();
  doc.circle(cx, cy, r - 5).lineWidth(0.6).strokeColor(BRAND.teal).stroke();
  doc
    .fillColor(BRAND.tealDeep)
    .font("Helvetica-Bold")
    .fontSize(6)
    .text("RURALLY SMILE", cx - r + 4, cy - 12, { width: r * 2 - 8, align: "center" });
  doc.text("FOUNDATION", cx - r + 4, cy - 2, { width: r * 2 - 8, align: "center" });
  doc.fontSize(5.5).text("SIWAN · BIHAR", cx - r + 4, cy + 10, {
    width: r * 2 - 8,
    align: "center",
  });
}

function docIdFromRoll(roll) {
  const digits = String(roll || "").replace(/\D/g, "").slice(-7).padStart(7, "0");
  return `PK2026/${digits}`;
}

function upper(v) {
  return String(v || "—").toUpperCase();
}

function drawPill(doc, text, y, pageW) {
  const w = 200;
  const x = (pageW - w) / 2;
  doc.roundedRect(x, y, w, 22, 11).fill(BRAND.tealDeep);
  doc
    .fillColor("#fff")
    .font("Helvetica-Bold")
    .fontSize(11)
    .text(text, x, y + 5, { width: w, align: "center" });
}

function drawFooterBar(doc, left, contentW, pageH, extra = "") {
  doc.rect(left, pageH - 42, contentW, 24).fill(BRAND.tealDeep);
  doc
    .fillColor("#fff")
    .font("Helvetica")
    .fontSize(7)
    .text(
      `${WEB}  ·  ${ABOUT_FOUNDATION.tagline}${extra ? `  ·  ${extra}` : ""}`,
      left + 6,
      pageH - 34,
      { width: contentW - 12, align: "center", lineBreak: false }
    );
}

function drawDocHeader(doc, { titleEn, subtitleEn, accent }) {
  doc.rect(0, 0, doc.page.width, 8).fill(accent);
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
  doc.fillColor(accent).fontSize(14).text(titleEn, textX, 62, { width: 300 });
  if (subtitleEn) {
    doc
      .fillColor(BRAND.muted)
      .font("Helvetica")
      .fontSize(8)
      .text(subtitleEn, textX, 80, { width: 300 });
  }
  doc
    .moveTo(36, 100)
    .lineTo(doc.page.width - 36, 100)
    .strokeColor(accent)
    .lineWidth(1.5)
    .stroke();
  return 112;
}

function drawFooter(doc) {
  // Keep clear of the bottom margin — overflowing it makes PDFKit add a page.
  const bottom = doc.page.height - doc.page.margins.bottom - 14;
  doc
    .fontSize(8)
    .fillColor(BRAND.muted)
    .text(`${HELPLINE}  ·  ${WEB}`, 36, bottom, {
      align: "center",
      width: doc.page.width - 72,
      lineBreak: false,
    });
}

/**
 * Single-page F4 Admit Card — template layout
 */
export const createAdmitCardPDF = async (student, admitCard) => {
  const doc = createF4PDF();
  const done = pdfToBuffer(doc);
  const pageW = doc.page.width;
  const pageH = doc.page.height;
  const left = 32;
  const right = pageW - 32;
  const contentW = right - left;

  const slot = getExamSlotForClass(student.class);
  const photoBuf = await loadImageBuffer(student.photo);
  const admitId = docIdFromRoll(student.rollNumber);

  drawOrnateBorder(doc);
  drawWatermark(doc);

  // Header
  let y = 34;
  drawLogo(doc, left, y, 70);

  doc
    .fillColor(BRAND.muted)
    .font("Helvetica")
    .fontSize(7)
    .text("ADMIT CARD ID", right - 130, y, { width: 130, align: "right" });
  doc
    .fillColor(BRAND.red)
    .font("Helvetica-Bold")
    .fontSize(11)
    .text(admitId, right - 130, y + 12, { width: 130, align: "right" });

  doc
    .fillColor(BRAND.tealDeep)
    .font("Helvetica-Bold")
    .fontSize(14)
    .text("RURALLY SMILE FOUNDATION", left + 80, y + 6, {
      width: contentW - 220,
      align: "center",
    });
  doc
    .fillColor(BRAND.navy)
    .fontSize(11)
    .text("PRATIBHA KHOJ COMPETITION 2026", left + 80, y + 24, {
      width: contentW - 220,
      align: "center",
    });

  y = 78;
  drawPill(doc, "ADMIT CARD", y, pageW);
  doc
    .fillColor(BRAND.muted)
    .font("Helvetica")
    .fontSize(8)
    .text("(Pratibha Khoj Exam — Combined Paper)", left, y + 26, {
      width: contentW,
      align: "center",
    });

  y = 118;
  const photoW = 88;
  const photoH = 108;
  const photoX = right - photoW;
  drawPhotoBox(doc, photoX, y, photoW, photoH, photoBuf);

  try {
    const qr = await generateQRBuffer(
      JSON.stringify({
        type: "admit",
        id: admitId,
        reg: student.registrationNumber,
        roll: student.rollNumber,
      })
    );
    doc.image(qr, photoX + 9, y + photoH + 8, { width: 70 });
    doc
      .fillColor(BRAND.muted)
      .fontSize(6.5)
      .text("Scan to Verify", photoX, y + photoH + 82, {
        width: photoW,
        align: "center",
      });
  } catch {
    /* skip */
  }

  const info = [
    ["Name", upper(student.name)],
    ["Father's Name", upper(student.fatherName)],
    ["Class", `${student.class || "—"} (${slot.label})`],
    ["Roll No.", String(student.rollNumber || "—")],
    ["Registration No.", String(student.registrationNumber || "—")],
    ["School", upper(student.schoolName)],
    ["Exam", "PRATIBHA KHOJ EXAM (COMBINED PAPER)"],
    ["Subjects", "HINDI · MATH · GK · GS"],
  ];
  doc.fontSize(10).fillColor(BRAND.navy);
  info.forEach(([label, value]) => {
    doc.font("Helvetica-Bold").text(`${label}:`, left, y, { width: 120 });
    doc.font("Helvetica").text(value, left + 125, y, { width: photoX - left - 140 });
    y += 17;
  });

  y = Math.max(y + 10, 118 + photoH + 100);

  // Exam details bar + 4 boxes
  doc.rect(left, y, contentW, 20).fill(BRAND.tealDeep);
  doc
    .fillColor("#fff")
    .font("Helvetica-Bold")
    .fontSize(9)
    .text("EXAM DETAILS", left + 8, y + 5);

  y += 26;
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
  const centreAddr =
    admitCard.examCenter?.address || "Ratnpura, District Siwan (Bihar)";

  const boxes = [
    ["EXAM DATE", examDateLabel],
    ["EXAM TIME", slot.examTime],
    ["EXAM CENTRE", `${centre}\n${centreAddr}`],
    ["REPORTING", slot.reportingTime],
  ];
  const gap = 8;
  const boxW = (contentW - gap * 3) / 4;
  const boxH = 58;
  boxes.forEach(([label, value], i) => {
    const bx = left + i * (boxW + gap);
    doc.roundedRect(bx, y, boxW, boxH, 5).lineWidth(1).strokeColor(BRAND.line).fillAndStroke("#F8FFFE", BRAND.line);
    doc
      .fillColor(BRAND.tealDeep)
      .font("Helvetica-Bold")
      .fontSize(7)
      .text(label, bx + 4, y + 6, { width: boxW - 8, align: "center" });
    doc
      .fillColor(BRAND.navy)
      .font("Helvetica-Bold")
      .fontSize(7.5)
      .text(value, bx + 4, y + 20, { width: boxW - 8, align: "center", height: 34 });
  });
  y += boxH + 8;
  doc
    .fillColor(BRAND.muted)
    .font("Helvetica-Oblique")
    .fontSize(7)
    .text(
      "Note: Late entry may not be allowed after reporting closes. Carry Admit Card + valid photo ID.",
      left,
      y,
      { width: contentW }
    );
  y += 18;

  // Instructions + signature columns
  const colGap = 12;
  const leftColW = contentW * 0.58;
  const rightColW = contentW - leftColW - colGap;
  const instrH = 148;
  doc
    .roundedRect(left, y, leftColW, instrH, 5)
    .fillAndStroke("#ECFEFF", BRAND.teal);
  doc
    .fillColor(BRAND.tealDeep)
    .font("Helvetica-Bold")
    .fontSize(9)
    .text("IMPORTANT INSTRUCTIONS", left + 8, y + 8);
  EXAM_INSTRUCTIONS_EN.forEach((line, i) => {
    const itemY = y + 24 + i * 14;
    doc.circle(left + 12, itemY + 4, 1.6).fill(BRAND.tealDeep);
    doc
      .fillColor(BRAND.navy)
      .font("Helvetica")
      .fontSize(7)
      .text(line, left + 18, itemY, {
        width: leftColW - 26,
        height: 13,
        ellipsis: true,
        lineBreak: false,
      });
  });

  const rx = left + leftColW + colGap;
  doc
    .font("Helvetica-Oblique")
    .fontSize(14)
    .fillColor("#1e3a5f")
    .text("Amritanshu Pandey", rx, y + 18, { width: rightColW, align: "center" });
  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .fillColor(BRAND.navy)
    .text("Amritanshu Pandey", rx, y + 40, { width: rightColW, align: "center" });
  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor(BRAND.muted)
    .text("Managing Director", rx, y + 52, { width: rightColW, align: "center" });
  doc
    .fontSize(6.5)
    .text("Rurally Smile Foundation", rx, y + 64, {
      width: rightColW,
      align: "center",
    });
  drawSeal(doc, rx + rightColW / 2, y + 110, 30);

  y += instrH + 14;

  // Detachable stub
  doc
    .moveTo(left, y)
    .lineTo(right, y)
    .dash(3, { space: 3 })
    .strokeColor(BRAND.teal)
    .lineWidth(0.8)
    .stroke()
    .undash();
  doc
    .roundedRect(pageW / 2 - 70, y - 8, 140, 16, 8)
    .fill(BRAND.tealDeep);
  doc
    .fillColor("#fff")
    .font("Helvetica-Bold")
    .fontSize(7)
    .text("KEEP THIS PORTION SAFE", pageW / 2 - 70, y - 4, {
      width: 140,
      align: "center",
    });
  y += 16;

  doc.roundedRect(left, y, contentW, 72, 5).fillAndStroke("#F0FDFA", BRAND.line);
  const stub = [
    `Name: ${upper(student.name)}`,
    `Roll No.: ${student.rollNumber || "—"}`,
    `Exam Date: ${examDateLabel}`,
    `Centre: ${centre}`,
    `Exam: Pratibha Khoj Combined Paper · Class ${student.class || "—"}`,
    `${HELPLINE}`,
  ];
  doc.font("Helvetica").fontSize(7.5).fillColor(BRAND.navy);
  stub.forEach((line, i) => {
    const col = i < 3 ? 0 : 1;
    const row = i % 3;
    doc.text(line, left + 10 + col * (contentW / 2), y + 10 + row * 18, {
      width: contentW / 2 - 16,
      lineBreak: false,
      ellipsis: true,
    });
  });

  drawFooterBar(doc, left, contentW, pageH);
  doc.end();
  return done;
};

/**
 * Single-page F4 Official Marksheet — template layout
 */
export const createMarksheetPDF = async (student, result) => {
  const doc = createF4PDF();
  const done = pdfToBuffer(doc);
  const pageW = doc.page.width;
  const pageH = doc.page.height;
  const left = 32;
  const right = pageW - 32;
  const contentW = right - left;
  const marksheetId = docIdFromRoll(student.rollNumber);

  drawOrnateBorder(doc);
  drawWatermark(doc);

  let y = 34;
  drawLogo(doc, left, y, 70);

  doc
    .fillColor(BRAND.muted)
    .font("Helvetica")
    .fontSize(7)
    .text("MARKSHEET ID", right - 130, y, { width: 130, align: "right" });
  doc
    .fillColor(BRAND.red)
    .font("Helvetica-Bold")
    .fontSize(11)
    .text(marksheetId, right - 130, y + 12, { width: 130, align: "right" });

  doc
    .fillColor(BRAND.tealDeep)
    .font("Helvetica-Bold")
    .fontSize(14)
    .text("RURALLY SMILE FOUNDATION", left + 80, y + 6, {
      width: contentW - 220,
      align: "center",
    });
  doc
    .fillColor(BRAND.navy)
    .fontSize(11)
    .text("PRATIBHA KHOJ COMPETITION 2026", left + 80, y + 24, {
      width: contentW - 220,
      align: "center",
    });

  y = 78;
  drawPill(doc, "OFFICIAL MARKSHEET", y, pageW);
  doc
    .fillColor(BRAND.muted)
    .font("Helvetica")
    .fontSize(8)
    .text("Official Digital Marksheet — Pratibha Khoj 2026", left, y + 26, {
      width: contentW,
      align: "center",
    });

  y = 118;
  const photoBuf = await loadImageBuffer(student.photo);
  const photoW = 88;
  const photoH = 108;
  const photoX = right - photoW;
  drawPhotoBox(doc, photoX, y, photoW, photoH, photoBuf);

  try {
    const qr = await generateQRBuffer(
      JSON.stringify({
        type: "marksheet",
        id: marksheetId,
        roll: student.rollNumber,
        total: result.total ?? result.marks,
        pct: result.percentage,
      })
    );
    doc.image(qr, photoX + 9, y + photoH + 8, { width: 70 });
    doc
      .fillColor(BRAND.muted)
      .fontSize(6.5)
      .text("Scan to Verify", photoX, y + photoH + 82, {
        width: photoW,
        align: "center",
      });
  } catch {
    /* skip */
  }

  const info = [
    ["Name", upper(student.name)],
    ["Father's Name", upper(student.fatherName)],
    ["Class", String(student.class || "—")],
    ["Roll No.", String(student.rollNumber || "—")],
    ["School", upper(student.schoolName)],
    ["Exam", "PRATIBHA KHOJ EXAM (COMBINED PAPER)"],
    ["Subjects", "HINDI · MATH · GK · GS"],
  ];
  doc.fontSize(10).fillColor(BRAND.navy);
  info.forEach(([label, value]) => {
    doc.font("Helvetica-Bold").text(`${label}:`, left, y, { width: 120 });
    doc.font("Helvetica").text(value, left + 125, y, { width: photoX - left - 140 });
    y += 17;
  });

  y = Math.max(y + 12, 118 + photoH + 100);

  // Marks table
  const obtained = result.total ?? result.marks ?? 0;
  const maxMarks = result.maxMarks || 40;
  const passMarks = Math.ceil(maxMarks * 0.33);
  doc.rect(left, y, contentW, 24).fill(BRAND.tealDeep);
  doc.fillColor("#fff").font("Helvetica-Bold").fontSize(9);
  doc.text("PARTICULARS", left + 8, y + 7, { width: 220 });
  doc.text("FULL MARKS", left + 250, y + 7, { width: 80, align: "center" });
  doc.text("PASS MARKS", left + 340, y + 7, { width: 80, align: "center" });
  doc.text("OBTAINED MARKS", left + 430, y + 7, { width: 100, align: "center" });
  y += 24;

  doc.rect(left, y, contentW, 42).fill("#F8FAFC");
  doc
    .rect(left, y, contentW, 42)
    .lineWidth(0.5)
    .strokeColor("#E2E8F0")
    .stroke();
  doc.fillColor(BRAND.navy).font("Helvetica-Bold").fontSize(9);
  doc.text("Pratibha Khoj Exam", left + 8, y + 8, { width: 230 });
  doc
    .font("Helvetica")
    .fontSize(7.5)
    .fillColor(BRAND.muted)
    .text("Combined Paper — Hindi · Math · GK · GS", left + 8, y + 22, {
      width: 230,
    });
  doc.fillColor(BRAND.navy).font("Helvetica").fontSize(11);
  doc.text(String(maxMarks), left + 250, y + 14, { width: 80, align: "center" });
  doc.text(String(passMarks), left + 340, y + 14, { width: 80, align: "center" });
  doc
    .fillColor(BRAND.green)
    .font("Helvetica-Bold")
    .fontSize(14)
    .text(String(obtained), left + 430, y + 12, { width: 100, align: "center" });
  y += 42;

  doc.rect(left, y, contentW, 26).fill("#ECFDF5");
  doc.fillColor(BRAND.tealDeep).font("Helvetica-Bold").fontSize(10);
  doc.text("GRAND TOTAL", left + 8, y + 7, { width: 230 });
  doc.text(String(maxMarks), left + 250, y + 7, { width: 80, align: "center" });
  doc.text("—", left + 340, y + 7, { width: 80, align: "center" });
  doc
    .fillColor(BRAND.green)
    .text(String(obtained), left + 430, y + 7, { width: 100, align: "center" });
  y += 40;

  const isPass = String(result.status || "").toLowerCase() === "pass";
  const boxW = (contentW - 16) / 3;
  const summary = [
    { label: "PERCENTAGE", value: `${result.percentage ?? 0}%`, color: BRAND.green },
    {
      label: "RESULT",
      value: upper(result.status),
      color: isPass ? BRAND.green : BRAND.red,
    },
    { label: "GRADE", value: upper(result.grade), color: BRAND.orange },
  ];
  summary.forEach((box, i) => {
    const bx = left + i * (boxW + 8);
    doc
      .roundedRect(bx, y, boxW, 52, 6)
      .lineWidth(1)
      .strokeColor("#CBD5E1")
      .stroke();
    doc
      .fillColor(BRAND.muted)
      .font("Helvetica")
      .fontSize(7.5)
      .text(box.label, bx, y + 8, { width: boxW, align: "center" });
    doc
      .fillColor(box.color)
      .font("Helvetica-Bold")
      .fontSize(18)
      .text(box.value, bx, y + 24, { width: boxW, align: "center" });
  });
  y += 68;

  const issueDate = result.updatedAt || result.createdAt || new Date();
  const dateStr = new Date(issueDate)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();

  drawSeal(doc, left + 42, y + 32, 32);
  doc
    .fillColor(BRAND.red)
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(`DATE OF ISSUE : ${dateStr}`, left + 90, y + 26, { width: 220 });

  doc
    .font("Helvetica-Oblique")
    .fontSize(14)
    .fillColor("#1e3a5f")
    .text("Amritanshu Pandey", right - 180, y + 10, {
      width: 180,
      align: "center",
    });
  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .fillColor(BRAND.navy)
    .text("Amritanshu Pandey", right - 180, y + 32, {
      width: 180,
      align: "center",
    });
  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor(BRAND.muted)
    .text("Managing Director", right - 180, y + 44, {
      width: 180,
      align: "center",
    });
  y += 80;

  const aboutH = Math.min(150, pageH - y - 56);
  if (aboutH >= 100) {
    doc
      .roundedRect(left, y, contentW, aboutH, 5)
      .fillAndStroke(BRAND.soft, BRAND.teal);
    doc
      .fillColor(BRAND.tealDeep)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text(ABOUT_FOUNDATION.title, left + 10, y + 8, { width: 320 });
    doc
      .fillColor(BRAND.tealDeep)
      .font("Helvetica")
      .fontSize(7)
      .text(ABOUT_FOUNDATION.web, left + 10, y + 8, {
        width: contentW - 20,
        align: "right",
      });
    doc
      .fillColor(BRAND.navy)
      .font("Helvetica")
      .fontSize(7)
      .text(ABOUT_FOUNDATION.welcome, left + 10, y + 22, {
        width: contentW - 20,
        height: 34,
      });
    doc
      .fillColor(BRAND.muted)
      .fontSize(6.5)
      .text(ABOUT_FOUNDATION.mission, left + 10, y + 58, {
        width: contentW - 20,
        height: 20,
      });
    doc
      .fillColor(BRAND.navy)
      .font("Helvetica-Bold")
      .fontSize(7)
      .text("OUR MAIN FACES / FOUNDERS", left + 10, y + 82);
    const colW = contentW / 4;
    ABOUT_FOUNDATION.founders.forEach(([name, role], i) => {
      const fx = left + 10 + i * colW;
      doc
        .fillColor(BRAND.navy)
        .font("Helvetica-Bold")
        .fontSize(7)
        .text(name, fx, y + 96, { width: colW - 10 });
      doc
        .fillColor(BRAND.muted)
        .font("Helvetica")
        .fontSize(6)
        .text(role, fx, y + 108, { width: colW - 10 });
    });
    doc
      .fillColor(BRAND.orange)
      .font("Helvetica")
      .fontSize(7)
      .text(ABOUT_FOUNDATION.tagline, left + 10, y + aboutH - 16, {
        width: contentW - 20,
      });
  }

  drawFooterBar(
    doc,
    left,
    contentW,
    pageH,
    "Computer generated · No wet signature required"
  );
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
    [
      "Pratibha Khoj Roll No",
      student.rollNumber || "________________ (Office Use)",
    ],
    ["Student Name", student.name],
    ["Gender", student.gender || "N/A"],
    ["Father Name", student.fatherName],
    ["Class", `Class ${student.class}`],
    ["School Roll No", student.schoolRollNo || "N/A"],
    ["School Name", student.schoolName],
    ["Mobile", student.mobile || "N/A"],
    ["Village + Post", student.villagePost || student.village || "N/A"],
    ["Exam Centre", "Utkramit Uchch Vidyalaya, Ratnpura, Siwan"],
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
