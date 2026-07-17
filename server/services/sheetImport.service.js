import XLSX from "xlsx";
import Student from "../models/Student.js";
import Result from "../models/Result.js";
import Setting from "../models/Setting.js";
import ApiError from "../utils/ApiError.js";
import { recalculatePublishedMerit } from "./result.service.js";
import {
  fetchSheetValuesWithServiceAccount,
  getServiceAccountEmail,
  hasServiceAccount,
  valuesToObjects,
} from "./googleSheetsAuth.service.js";

const PAPER_MAX = 100;
const PASS_PCT = 33;

const DEFAULT_SHEET_URL =
  process.env.GOOGLE_SHEET_DEFAULT_URL?.trim() ||
  "https://docs.google.com/spreadsheets/d/1pe2tcdv1fGwP7o286uQn3Kv-38cu8UZZYWpkxNFWLWs/edit?usp=sharing";

/** Extract spreadsheet ID from Google Sheets URL */
export function extractSheetId(url) {
  if (!url || typeof url !== "string") return null;
  const m = url.trim().match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return m?.[1] || null;
}

export function sheetExportCsvUrl(sheetUrlOrId, gid = "0") {
  const id =
    extractSheetId(sheetUrlOrId) ||
    (/^[a-zA-Z0-9-_]+$/.test(String(sheetUrlOrId || "").trim())
      ? String(sheetUrlOrId).trim()
      : null);
  if (!id) throw new ApiError(400, "Invalid Google Sheet URL or ID");
  return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`;
}

function sheetGvizCsvUrl(sheetId, gid = "0") {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;
}

function isHtmlLoginPage(text) {
  if (!text) return true;
  const t = text.slice(0, 500).toLowerCase();
  return (
    t.includes("<!doctype html") ||
    t.includes("<html") ||
    t.includes("sign in") ||
    t.includes("accounts.google.com")
  );
}

function parseCsvTextToRows(text) {
  const wb = XLSX.read(text, { type: "string" });
  const sheetName = wb.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { defval: "" });
  return { sheetName, rows };
}

async function fetchCsvCandidate(url) {
  const res = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(30000),
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; PratibhaKhojExamPortal/1.0; +https://rurallysmile.org)",
      Accept: "text/csv,text/plain,*/*",
    },
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, text, url };
}

function normKey(k) {
  return String(k || "")
    .trim()
    .toLowerCase()
    .replace(/[\s._/-]+/g, "")
    .replace(/[^\w\u0900-\u097f]/g, "");
}

function pick(row, aliases) {
  const map = {};
  for (const [k, v] of Object.entries(row || {})) {
    map[normKey(k)] = v;
  }
  for (const a of aliases) {
    const key = normKey(a);
    if (map[key] !== undefined && map[key] !== null && map[key] !== "") {
      return map[key];
    }
  }
  return undefined;
}

function toMarks(n) {
  const v = Math.round(Number(n));
  if (!Number.isFinite(v)) return null;
  return Math.min(PAPER_MAX, Math.max(0, v));
}

/** Normalize one spreadsheet row → { rollNumber, marks } or error */
export function normalizeResultRow(raw, rowIndex) {
  const rollRaw = pick(raw, [
    "rollNumber",
    "roll",
    "rollno",
    "rollnumber",
    "रोल",
    "रोलनं",
    "रोलनंबर",
  ]);
  if (!rollRaw) {
    return { ok: false, row: rowIndex, error: "Missing roll number" };
  }
  const rollNumber = String(rollRaw).trim().toUpperCase();

  let marks = toMarks(
    pick(raw, ["marks", "total", "totalmarks", "obtained", "score", "अंक", "कुल"])
  );

  if (marks === null) {
    const hindi = Number(pick(raw, ["hindi", "हिंदी", "हिन्दी"]) || 0);
    const math = Number(pick(raw, ["math", "maths", "गणित"]) || 0);
    const gk = Number(pick(raw, ["gk", "gknow", "सामान्यज्ञान"]) || 0);
    const gs = Number(pick(raw, ["gs", "science", "विज्ञान"]) || 0);
    const sum = hindi + math + gk + gs;
    if (sum > 0) marks = toMarks(sum);
  }

  if (marks === null) {
    return {
      ok: false,
      row: rowIndex,
      rollNumber,
      error: "Missing marks / total (0–100)",
    };
  }

  return { ok: true, row: rowIndex, rollNumber, marks };
}

/** Parse buffer (xlsx/xls/csv) → raw objects */
export function parseWorkbookBuffer(buffer, filename = "file.xlsx") {
  const wb = XLSX.read(buffer, { type: "buffer", cellDates: true });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) throw new ApiError(400, "Excel has no sheets");
  const sheet = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  return { sheetName, rows, filename };
}

/** Fetch Google Sheet rows — Service Account (private, FREE) → API key → public CSV */
export async function fetchGoogleSheetRows(sheetUrl, gid = "0") {
  const sheetId =
    extractSheetId(sheetUrl) ||
    process.env.GOOGLE_SHEET_ID?.trim() ||
    null;
  if (!sheetId) throw new ApiError(400, "Invalid Google Sheet URL or ID");

  const range =
    process.env.GOOGLE_SHEET_RANGE?.trim() ||
    `${process.env.GOOGLE_SHEET_NAME?.trim() || "Sheet1"}!A:Z`;

  let hint = "";

  // 1) Service Account — private sheet, FREE Google quota
  if (hasServiceAccount()) {
    try {
      const result = await fetchSheetValuesWithServiceAccount(sheetId, range);
      if (result) {
        const rows = valuesToObjects(result.values);
        return {
          sheetId,
          sheetUrl,
          sheetName: process.env.GOOGLE_SHEET_NAME?.trim() || "Sheet1",
          rows,
          authMode: "service_account",
          serviceEmail: result.email,
          csvUrl: null,
        };
      }
    } catch (err) {
      // If SA is configured, surface that error (don't silently fall back to public)
      throw new ApiError(400, err.message || "Service Account sheet read failed");
    }
  }

  // 2) API key — only works if sheet is public
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY?.trim();
  if (apiKey) {
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
      range
    )}?key=${apiKey}`;
    try {
      const res = await fetch(apiUrl, { signal: AbortSignal.timeout(30000) });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        const rows = valuesToObjects(json.values || []);
        return {
          sheetId,
          sheetUrl,
          sheetName: "Sheet1",
          rows,
          authMode: "api_key",
          csvUrl: apiUrl,
        };
      }
      const msg = json?.error?.message || `HTTP ${res.status}`;
      hint = ` API key: ${msg}`;
      if (/has not been used|disabled/i.test(msg)) {
        throw new ApiError(
          400,
          "Google Sheets API disabled. Enable FREE API: https://console.cloud.google.com/apis/library/sheets.googleapis.com — Or use Service Account for private sheets (see server/.env.example)."
        );
      }
    } catch (err) {
      if (err instanceof ApiError) throw err;
      hint = ` API key failed: ${err.message}`;
    }
  } else {
    hint =
      " Tip: For private sheets use FREE Service Account (GOOGLE_SERVICE_ACCOUNT_PATH). Or Share → Anyone with the link → Viewer.";
  }

  // 3) Public CSV (Anyone with the link)
  const candidates = [
    sheetExportCsvUrl(sheetId, gid),
    sheetGvizCsvUrl(sheetId, gid),
    `https://docs.google.com/spreadsheets/d/${sheetId}/pub?output=csv`,
  ];

  let lastStatus = 0;
  for (const url of candidates) {
    try {
      const got = await fetchCsvCandidate(url);
      lastStatus = got.status;
      if (!got.ok || isHtmlLoginPage(got.text)) continue;
      const { sheetName, rows } = parseCsvTextToRows(got.text);
      return {
        sheetId,
        sheetUrl,
        sheetName,
        rows,
        authMode: "public_csv",
        csvUrl: url,
      };
    } catch {
      /* try next */
    }
  }

  throw new ApiError(
    400,
    `Google Sheet fetch failed (${lastStatus || 401}). Sheet is private.${hint}`
  );
}

/**
 * Validate + prepare rows using DSA:
 * - HashSet: duplicate rolls in file
 * - HashMap: rollNumber → Student (O(1) lookup)
 */
export async function validateAndMapRows(rawRows) {
  const normalized = [];
  const errors = [];
  const seen = new Set(); // Hash Set — duplicate detection
  let duplicate = 0;

  rawRows.forEach((raw, i) => {
    const row = normalizeResultRow(raw, i + 2); // +2 ≈ header + 1-based
    if (!row.ok) {
      errors.push(row);
      return;
    }
    if (seen.has(row.rollNumber)) {
      duplicate += 1;
      errors.push({
        ...row,
        ok: false,
        error: "Duplicate roll number in file",
      });
      return;
    }
    seen.add(row.rollNumber);
    normalized.push(row);
  });

  // Hash Map: roll → student
  const rolls = normalized.map((r) => r.rollNumber);
  const students = await Student.find({
    rollNumber: { $in: rolls },
  }).select("_id name class rollNumber schoolName");

  const studentByRoll = new Map();
  for (const s of students) {
    studentByRoll.set(String(s.rollNumber).toUpperCase(), s);
  }

  const ready = [];
  let missing = 0;
  for (const row of normalized) {
    const student = studentByRoll.get(row.rollNumber);
    if (!student) {
      missing += 1;
      errors.push({
        ...row,
        ok: false,
        error: "Student / roll number not found in portal",
      });
      continue;
    }
    ready.push({
      ...row,
      studentId: student._id,
      studentName: student.name,
      studentClass: student.class,
      schoolName: student.schoolName,
      percentage: Math.round((row.marks / PAPER_MAX) * 10000) / 100,
      status: (row.marks / PAPER_MAX) * 100 >= PASS_PCT ? "Pass" : "Fail",
    });
  }

  // Merit preview — Merge Sort style (stable sort by marks desc)
  const meritPreview = mergeSortByMarks([...ready]).slice(0, 10);

  return {
    total: rawRows.length,
    valid: ready.length,
    failed: errors.length,
    duplicate,
    missing,
    ready,
    errors: errors.slice(0, 100),
    meritPreview,
    preview: ready.slice(0, 25),
  };
}

/** Classic merge sort (DSA) — highest marks first */
function mergeSortByMarks(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSortByMarks(arr.slice(0, mid));
  const right = mergeSortByMarks(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const out = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i].marks >= right[j].marks) out.push(left[i++]);
    else out.push(right[j++]);
  }
  while (i < left.length) out.push(left[i++]);
  while (j < right.length) out.push(right[j++]);
  return out;
}

/** Persist validated rows → MongoDB results */
export async function importValidatedRows(ready, { publish = false, adminId } = {}) {
  let success = 0;
  let updated = 0;
  let created = 0;
  const failed = [];

  for (const row of ready) {
    try {
      let result = await Result.findOne({ student: row.studentId });
      const payload = {
        marks: row.marks,
        total: row.marks,
        maxMarks: PAPER_MAX,
        hindi: 0,
        math: 0,
        gk: 0,
        gs: 0,
      };
      if (result) {
        Object.assign(result, payload);
        if (publish) {
          result.published = true;
          result.publishedAt = new Date();
          result.publishedBy = adminId;
        }
        await result.save();
        updated += 1;
      } else {
        result = await Result.create({
          student: row.studentId,
          ...payload,
          ...(publish
            ? {
                published: true,
                publishedAt: new Date(),
                publishedBy: adminId,
              }
            : {}),
        });
        created += 1;
      }
      success += 1;
    } catch (err) {
      failed.push({
        rollNumber: row.rollNumber,
        error: err.message || "Save failed",
      });
    }
  }

  await recalculatePublishedMerit();

  return { success, created, updated, failed };
}

export async function saveSheetConfig(sheetUrl) {
  let setting = await Setting.findOne();
  if (!setting) setting = await Setting.create({});
  setting.googleSheetUrl = sheetUrl;
  setting.googleSheetLastSync = new Date();
  await setting.save();
  return setting;
}

export async function getSheetConfig() {
  const setting = await Setting.findOne().lean();
  const saEmail = getServiceAccountEmail();
  const hasSa = hasServiceAccount();
  const hasApiKey = Boolean(process.env.GOOGLE_SHEETS_API_KEY?.trim());
  return {
    sheetUrl: setting?.googleSheetUrl || DEFAULT_SHEET_URL,
    lastSync: setting?.googleSheetLastSync || null,
    defaultSheetUrl: DEFAULT_SHEET_URL,
    auth: {
      serviceAccount: hasSa,
      serviceAccountEmail: saEmail,
      apiKey: hasApiKey,
      mode: hasSa
        ? "service_account"
        : hasApiKey
          ? "api_key"
          : "public_csv",
      free: true,
      setupHint: hasSa
        ? `Private sheet OK — share Viewer with ${saEmail}`
        : "Add FREE Service Account JSON to keep sheet private (see server/.env.example)",
    },
  };
}

/** Build sample Excel buffer for download */
export function buildSampleResultExcel() {
  const data = [
    { rollNumber: "RTN260001", marks: 85 },
    { rollNumber: "RTN260002", marks: 92 },
    { rollNumber: "RTN260003", marks: 78 },
  ];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Results");
  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
}

export default {
  extractSheetId,
  sheetExportCsvUrl,
  parseWorkbookBuffer,
  fetchGoogleSheetRows,
  validateAndMapRows,
  importValidatedRows,
  saveSheetConfig,
  getSheetConfig,
  buildSampleResultExcel,
  DEFAULT_SHEET_URL,
};
