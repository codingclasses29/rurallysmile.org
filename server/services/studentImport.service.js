import path from "path";
import ExcelJS from "exceljs";
import yauzl from "yauzl";
import yazl from "yazl";
import Student from "../models/Student.js";
import Registration from "../models/Registration.js";
import ApiError from "../utils/ApiError.js";
import { generateRegistration } from "../utils/generateRegistration.js";
import { uploadImage } from "./upload.service.js";

const MAX_EXCEL_BYTES = 8 * 1024 * 1024;
const MAX_ZIP_BYTES = 50 * 1024 * 1024;
const MAX_MEDIA_BYTES = 3 * 1024 * 1024;
const MAX_UNCOMPRESSED_BYTES = 100 * 1024 * 1024;
const MAX_ROWS = 1000;
const MAX_ENTRIES = 2500;
const CLASSES = new Set(["8", "9", "10"]);
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const normKey = (value) =>
  String(value || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");

const valueFrom = (raw, aliases) => {
  const values = new Map(
    Object.entries(raw || {}).map(([key, value]) => [normKey(key), value])
  );
  for (const alias of aliases) {
    const value = values.get(normKey(alias));
    if (value !== undefined && value !== null && String(value).trim() !== "") return value;
  }
  return "";
};

const clean = (value, max = 200) => String(value ?? "").trim().slice(0, max);
const normalizePhone = (value) => clean(value, 20).replace(/[^\d+]/g, "");
const normalizeEmail = (value) => clean(value, 254).toLowerCase();

export function normalizeStudentRow(raw, rowNumber) {
  const studentClass = clean(valueFrom(raw, ["Class", "Student Class"]), 2);
  const mobile = normalizePhone(valueFrom(raw, ["Mobile", "Phone", "Mobile Number"]));
  const email = normalizeEmail(valueFrom(raw, ["Email", "Email Address"]));
  const dobRaw = valueFrom(raw, ["DOB", "Date of Birth"]);
  const dob = dobRaw ? new Date(dobRaw) : null;
  const genderRaw = clean(valueFrom(raw, ["Gender"]), 10).toLowerCase();
  const gender = genderRaw
    ? `${genderRaw.charAt(0).toUpperCase()}${genderRaw.slice(1)}`
    : undefined;
  const data = {
    name: clean(valueFrom(raw, ["Name", "Student Name"])),
    fatherName: clean(valueFrom(raw, ["Father Name", "FatherName"])),
    motherName: clean(valueFrom(raw, ["Mother Name", "MotherName"])),
    dob,
    gender,
    category: clean(valueFrom(raw, ["Category"]), 20) || "General",
    medium: clean(valueFrom(raw, ["Medium"]), 30) || "Hindi",
    mobile,
    parentMobile: normalizePhone(valueFrom(raw, ["Parent Mobile", "ParentMobile"])),
    whatsapp: normalizePhone(valueFrom(raw, ["WhatsApp", "Whatsapp Number"])) || mobile,
    email: email || undefined,
    class: studentClass,
    schoolName: clean(valueFrom(raw, ["School", "School Name"])),
    state: clean(valueFrom(raw, ["State"]), 100) || "Bihar",
    district: clean(valueFrom(raw, ["District"]), 100),
    block: clean(valueFrom(raw, ["Block"]), 100),
    village: clean(valueFrom(raw, ["Village"]), 100),
    pinCode: clean(valueFrom(raw, ["PIN", "Pin Code", "Pincode"]), 10),
    address: clean(valueFrom(raw, ["Address"]), 500),
    photoFilename: clean(valueFrom(raw, ["Photo", "Photo Filename"]), 255),
    signatureFilename: clean(valueFrom(raw, ["Signature", "Signature Filename"]), 255),
  };
  const errors = [];
  if (!data.name) errors.push("Name is required");
  if (!CLASSES.has(data.class)) errors.push("Class must be 8, 9 or 10");
  if (!/^\+?\d{10,15}$/.test(data.mobile)) errors.push("Valid mobile is required");
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Email is invalid");
  }
  if (dobRaw && (!dob || Number.isNaN(dob.getTime()))) errors.push("DOB is invalid");
  if (data.gender && !["Male", "Female", "Other"].includes(data.gender)) {
    errors.push("Gender must be Male, Female or Other");
  }
  if (!data.photoFilename) errors.push("Photo filename is required");
  if (!data.signatureFilename) errors.push("Signature filename is required");
  return { row: rowNumber, data, errors };
}

const inspectOfficeZip = async (buffer) => {
  let zip;
  try {
    zip = await openZip(buffer);
  } catch {
    throw new ApiError(400, "Excel file is invalid or corrupted");
  }
  await new Promise((resolve, reject) => {
    let entries = 0;
    let expanded = 0;
    zip.on("error", reject);
    zip.on("entry", (entry) => {
      entries += 1;
      expanded += entry.uncompressedSize;
      if (entries > 200 || expanded > 50 * 1024 * 1024) {
        zip.close();
        reject(new ApiError(413, "Excel expands beyond safe limits"));
        return;
      }
      zip.readEntry();
    });
    zip.on("end", resolve);
    zip.readEntry();
  });
};

export async function parseStudentWorkbook(file) {
  if (!file?.buffer) throw new ApiError(400, "excel file is required");
  if (file.size > MAX_EXCEL_BYTES) throw new ApiError(413, "Excel file exceeds 8 MB");
  const ext = path.extname(file.originalname || "").toLowerCase();
  if (ext !== ".xlsx") {
    throw new ApiError(400, "excel must be an .xlsx file");
  }
  await inspectOfficeZip(file.buffer);
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(file.buffer, {
      ignoreNodes: ["dataValidations", "drawing", "extLst"],
    });
  } catch {
    throw new ApiError(400, "Excel file is invalid or corrupted");
  }
  const worksheet = workbook.worksheets[0];
  if (!worksheet) throw new ApiError(400, "Excel has no worksheets");
  const headers = [];
  worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell, column) => {
    headers[column] = clean(cell.value);
  });
  const rows = [];
  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return;
    const item = {};
    headers.forEach((header, column) => {
      if (header) item[header] = row.getCell(column).value ?? "";
    });
    if (Object.values(item).some((value) => String(value ?? "").trim())) rows.push(item);
  });
  if (!rows.length) throw new ApiError(400, "Excel is empty");
  if (rows.length > MAX_ROWS) throw new ApiError(413, `Excel exceeds ${MAX_ROWS} rows`);
  return { rows, sheetName: worksheet.name };
}

export const isUnsafeZipPath = (name) => {
  const normalized = String(name || "").replace(/\\/g, "/");
  return (
    !normalized ||
    normalized.startsWith("/") ||
    /^[a-zA-Z]:/.test(normalized) ||
    normalized.split("/").includes("..") ||
    normalized.includes("\0")
  );
};

const openZip = (buffer) =>
  new Promise((resolve, reject) => {
    yauzl.fromBuffer(buffer, { lazyEntries: true, validateEntrySizes: true }, (err, zip) =>
      err ? reject(err) : resolve(zip)
    );
  });

const readEntry = (zip, entry) =>
  new Promise((resolve, reject) => {
    zip.openReadStream(entry, (err, stream) => {
      if (err) return reject(err);
      const chunks = [];
      let size = 0;
      stream.on("data", (chunk) => {
        size += chunk.length;
        if (size > MAX_MEDIA_BYTES) stream.destroy(new Error("Media file exceeds 3 MB"));
        else chunks.push(chunk);
      });
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks)));
    });
  });

const hasExpectedImageSignature = (buffer, extension) => {
  if (extension === ".png") {
    return buffer.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    );
  }
  if (extension === ".jpg" || extension === ".jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (extension === ".webp") {
    return (
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }
  return false;
};

export async function readMediaZip(file) {
  if (!file?.buffer) throw new ApiError(400, "mediaZip file is required");
  if (file.size > MAX_ZIP_BYTES) throw new ApiError(413, "mediaZip exceeds 50 MB");
  if (path.extname(file.originalname || "").toLowerCase() !== ".zip") {
    throw new ApiError(400, "mediaZip must be a .zip file");
  }
  let zip;
  try {
    zip = await openZip(file.buffer);
  } catch {
    throw new ApiError(400, "mediaZip is invalid or corrupted");
  }
  return new Promise((resolve, reject) => {
    const files = new Map();
    let entries = 0;
    let expanded = 0;
    const fail = (error) => {
      zip.close();
      reject(error instanceof ApiError ? error : new ApiError(400, error.message));
    };
    zip.on("error", fail);
    zip.on("entry", async (entry) => {
      try {
        entries += 1;
        if (entries > MAX_ENTRIES) throw new ApiError(413, "mediaZip has too many entries");
        if (isUnsafeZipPath(entry.fileName)) throw new ApiError(400, "Unsafe path in mediaZip");
        if (/\/$/.test(entry.fileName)) return zip.readEntry();
        const extension = path.extname(entry.fileName).toLowerCase();
        if (!IMAGE_EXTENSIONS.has(extension)) {
          throw new ApiError(400, `Unsupported media type: ${entry.fileName}`);
        }
        if (entry.uncompressedSize > MAX_MEDIA_BYTES) {
          throw new ApiError(413, `Media exceeds 3 MB: ${entry.fileName}`);
        }
        expanded += entry.uncompressedSize;
        if (expanded > MAX_UNCOMPRESSED_BYTES) {
          throw new ApiError(413, "mediaZip expands beyond 100 MB");
        }
        const key = entry.fileName.replace(/\\/g, "/").toLowerCase();
        const basename = path.posix.basename(key);
        if (files.has(key) || files.has(basename)) {
          throw new ApiError(400, `Duplicate media filename: ${entry.fileName}`);
        }
        const buffer = await readEntry(zip, entry);
        if (!hasExpectedImageSignature(buffer, extension)) {
          throw new ApiError(400, `Media content does not match extension: ${entry.fileName}`);
        }
        const media = {
          buffer,
          size: buffer.length,
          originalname: path.posix.basename(entry.fileName),
          mimetype:
            extension === ".png"
              ? "image/png"
              : extension === ".webp"
                ? "image/webp"
                : "image/jpeg",
        };
        files.set(key, media);
        if (basename !== key) files.set(basename, media);
        zip.readEntry();
      } catch (error) {
        fail(error);
      }
    });
    zip.on("end", () => resolve(files));
    zip.readEntry();
  });
}

const findMedia = (media, filename) => {
  const key = String(filename || "").replace(/\\/g, "/").toLowerCase();
  return media.get(key) || media.get(path.posix.basename(key));
};

export async function validateStudentImport(excelFile, mediaZipFile) {
  const { rows, sheetName } = await parseStudentWorkbook(excelFile);
  const media = await readMediaZip(mediaZipFile);
  const normalized = rows.map((row, index) => normalizeStudentRow(row, index + 2));
  const mobiles = normalized.map((item) => item.data.mobile).filter(Boolean);
  const emails = normalized.map((item) => item.data.email).filter(Boolean);
  const [existingMobiles, existingEmails] = await Promise.all([
    Student.find({ mobile: { $in: mobiles } }).distinct("mobile"),
    Student.find({ email: { $in: emails } }).distinct("email"),
  ]);
  const dbMobiles = new Set(existingMobiles);
  const dbEmails = new Set(existingEmails.map((email) => String(email).toLowerCase()));
  const seenMobiles = new Set();
  const seenEmails = new Set();

  for (const item of normalized) {
    const { data, errors } = item;
    if (seenMobiles.has(data.mobile)) errors.push("Duplicate mobile in workbook");
    else seenMobiles.add(data.mobile);
    if (data.email) {
      if (seenEmails.has(data.email)) errors.push("Duplicate email in workbook");
      else seenEmails.add(data.email);
    }
    if (dbMobiles.has(data.mobile)) errors.push("Mobile already exists");
    if (data.email && dbEmails.has(data.email)) errors.push("Email already exists");
    if (data.photoFilename && !findMedia(media, data.photoFilename)) {
      errors.push(`Photo not found in ZIP: ${data.photoFilename}`);
    }
    if (data.signatureFilename && !findMedia(media, data.signatureFilename)) {
      errors.push(`Signature not found in ZIP: ${data.signatureFilename}`);
    }
  }
  const reportRows = normalized.map(({ row, data, errors }) => ({
    row,
    status: errors.length ? "invalid" : "ready",
    name: data.name,
    mobile: data.mobile,
    email: data.email || null,
    class: data.class,
    errors,
  }));
  return {
    sheetName,
    total: normalized.length,
    valid: reportRows.filter((row) => row.status === "ready").length,
    invalid: reportRows.filter((row) => row.status === "invalid").length,
    rows: reportRows,
    normalized,
    media,
  };
}

export async function importStudents(excelFile, mediaZipFile) {
  const validation = await validateStudentImport(excelFile, mediaZipFile);
  const report = [];
  let created = 0;
  for (const item of validation.normalized) {
    if (item.errors.length) {
      report.push({ row: item.row, status: "failed", errors: item.errors });
      continue;
    }
    const { photoFilename, signatureFilename, ...studentData } = item.data;
    let student;
    try {
      const [photo, signature] = await Promise.all([
        uploadImage(findMedia(validation.media, photoFilename), "examportal/students"),
        uploadImage(findMedia(validation.media, signatureFilename), "examportal/students"),
      ]);
      student = await Student.create({
        ...studentData,
        registrationNumber: await generateRegistration(studentData.class),
        photo: photo.secure_url,
        signature: signature.secure_url,
        status: "Pending",
      });
      await Registration.create({
        student: student._id,
        registrationDate: new Date(),
        paymentStatus: "Free",
        verified: false,
      });
      created += 1;
      report.push({
        row: item.row,
        status: "created",
        studentId: String(student._id),
        registrationNumber: student.registrationNumber,
      });
    } catch (error) {
      if (student) await Student.deleteOne({ _id: student._id }).catch(() => {});
      report.push({
        row: item.row,
        status: "failed",
        errors: [error.code === 11000 ? "Duplicate record detected during import" : error.message],
      });
    }
  }
  return {
    sheetName: validation.sheetName,
    total: validation.total,
    created,
    failed: validation.total - created,
    rows: report,
  };
}

export async function buildStudentImportSample() {
  const rows = [{
    Name: "Sample Student",
    FatherName: "Sample Father",
    DOB: "2012-01-15",
    Gender: "Male",
    Class: "8",
    Mobile: "9876543210",
    Email: "student@example.com",
    SchoolName: "Sample School",
    District: "Patna",
    Photo: "9876543210-photo.png",
    Signature: "9876543210-signature.png",
  }];
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Students");
  worksheet.columns = Object.keys(rows[0]).map((header) => ({
    header,
    key: header,
    width: Math.max(14, header.length + 2),
  }));
  worksheet.addRows(rows);
  return Buffer.from(await workbook.xlsx.writeBuffer());
}

export function buildStudentMediaSample() {
  const pixel = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Z2S8AAAAASUVORK5CYII=",
    "base64"
  );
  const zip = new yazl.ZipFile();
  zip.addBuffer(pixel, "9876543210-photo.png");
  zip.addBuffer(pixel, "9876543210-signature.png");
  zip.end();
  return new Promise((resolve, reject) => {
    const chunks = [];
    zip.outputStream.on("data", (chunk) => chunks.push(chunk));
    zip.outputStream.on("error", reject);
    zip.outputStream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

export const STUDENT_IMPORT_LIMITS = {
  maxRows: MAX_ROWS,
  maxExcelBytes: MAX_EXCEL_BYTES,
  maxZipBytes: MAX_ZIP_BYTES,
  maxMediaBytes: MAX_MEDIA_BYTES,
};
