import assert from "node:assert/strict";
import mongoose from "mongoose";
import "../config/env.js";
import config from "../config/index.js";
import Student from "../models/Student.js";
import Registration from "../models/Registration.js";
import AdmitCard from "../models/AdmitCard.js";
import Result from "../models/Result.js";
import Notice from "../models/Notice.js";
import Gallery from "../models/Gallery.js";
import ExamCenter from "../models/ExamCenter.js";
import Admin from "../models/Admin.js";

const API = process.env.SMOKE_API_URL || "https://rurallysmile-org-4.onrender.com/api/v1";
const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
const registrationNumber = `SMOKE${suffix}`;
const centerCode = `SMOKE-${suffix}`;
const noticeTitle = `Smoke notice ${suffix}`;
const galleryTitle = `Smoke gallery ${suffix}`;
let cookie = "";
let studentId;
let resultId;
let centerId;
let noticeId;
let galleryId;
let createdAdminId;

async function request(path, options = {}, expected = 200) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      ...(options.body && !(options.body instanceof FormData)
        ? { "content-type": "application/json" }
        : {}),
      ...(cookie ? { cookie } : {}),
      ...options.headers,
    },
  });
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.arrayBuffer();
  assert.equal(
    response.status,
    expected,
    `${options.method || "GET"} ${path}: expected ${expected}, got ${response.status} ${
      body?.message || ""
    }`
  );
  return { response, body };
}

async function cleanup() {
  const student = studentId
    ? { _id: studentId }
    : { registrationNumber };
  const foundStudent = await Student.findOne(student).select("_id");
  if (foundStudent) {
    await Promise.all([
      Registration.deleteMany({ student: foundStudent._id }),
      AdmitCard.deleteMany({ student: foundStudent._id }),
      Result.deleteMany({ student: foundStudent._id }),
    ]);
    await Student.deleteOne({ _id: foundStudent._id });
  }
  await Promise.all([
    Notice.deleteMany({ $or: [{ _id: noticeId }, { title: noticeTitle }] }),
    Gallery.deleteMany({ $or: [{ _id: galleryId }, { title: galleryTitle }] }),
    ExamCenter.deleteMany({ $or: [{ _id: centerId }, { centerCode }] }),
    Admin.deleteMany({
      $or: [
        { _id: createdAdminId },
        { email: `smoke-${suffix}@example.com` },
      ],
    }),
  ]);
}

async function run() {
  await mongoose.connect(config.MONGO_URI);
  try {
    const login = await request(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
        }),
      },
      200
    );
    assert.equal(login.body.success, true);
    assert.equal(login.body.data.role, "SUPER_ADMIN");
    cookie = (login.response.headers.getSetCookie?.() || [])
      .map((value) => value.split(";")[0])
      .join("; ");
    assert.ok(cookie.includes("accessToken="), "Access cookie was not set");

    for (const path of [
      "/auth/profile",
      "/admin/dashboard",
      "/dashboard/admin",
      "/dashboard/statistics",
      "/student?page=1&limit=5",
      "/registration/admin/list?page=1&limit=5",
      "/admit?page=1&limit=5",
      "/result?page=1&limit=5",
      "/notice/manage",
      "/center?all=1",
      "/settings",
      "/ai/status",
      "/result/import/config",
      "/result/import/sample",
      "/student/import/sample",
      "/student/import/media-sample",
    ]) {
      await request(path);
    }

    const [studentExcel, studentMedia, resultExcel] = await Promise.all([
      request("/student/import/sample"),
      request("/student/import/media-sample"),
      request("/result/import/sample"),
    ]);
    const studentPreviewForm = new FormData();
    studentPreviewForm.append(
      "excel",
      new Blob([studentExcel.body]),
      "student-import-sample.xlsx"
    );
    studentPreviewForm.append(
      "mediaZip",
      new Blob([studentMedia.body]),
      "student-media-sample.zip"
    );
    await request("/student/import/preview", {
      method: "POST",
      body: studentPreviewForm,
    });
    const resultPreviewForm = new FormData();
    resultPreviewForm.append(
      "file",
      new Blob([resultExcel.body]),
      "result-import-sample.xlsx"
    );
    await request("/result/import/excel/preview", {
      method: "POST",
      body: resultPreviewForm,
    });

    const currentSettings = await request("/settings");
    const setting = currentSettings.body.data.setting;
    await request("/settings", {
      method: "PUT",
      body: JSON.stringify({
        siteName: setting.siteName,
        registrationOpen: setting.registrationOpen,
        resultPublished: setting.resultPublished,
        admitAvailable: setting.admitAvailable,
        examDate: setting.examDate,
        medium: setting.medium,
        contactPhone: setting.contactPhone,
        contactEmail: setting.contactEmail,
        contactWebsite: setting.contactWebsite,
      }),
    });

    const createdAdmin = await request(
      "/admin/create",
      {
        method: "POST",
        body: JSON.stringify({
          name: "API Smoke Admin",
          email: `smoke-${suffix}@example.com`,
          password: `Smoke-${suffix}!`,
          role: "ADMIN",
        }),
      },
      201
    );
    createdAdminId = createdAdmin.body.data.admin.id;

    const student = await Student.create({
      registrationNumber,
      name: "API Smoke Student",
      fatherName: "API Smoke Parent",
      mobile: `9${suffix.slice(-9)}`,
      class: "8",
      schoolName: "API Smoke School",
      district: "Siwan",
      photo: "https://example.com/smoke-photo.png",
      signature: "https://example.com/smoke-signature.png",
      status: "Pending",
    });
    studentId = String(student._id);
    await Registration.create({
      student: student._id,
      paymentStatus: "Free",
      verified: false,
    });

    await request(`/student/${studentId}`);
    await request(`/admin/students/${studentId}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ reason: "Disposable smoke rejection" }),
    });
    await request(`/student/${studentId}/restore`, {
      method: "PUT",
      body: JSON.stringify({}),
    });
    const approved = await request(`/admin/students/${studentId}/approve`, {
      method: "PATCH",
      body: JSON.stringify({}),
    });
    const rollNumber = approved.body.data.student.rollNumber;
    assert.ok(rollNumber);

    const admit = await request("/admit/generate", {
      method: "POST",
      body: JSON.stringify({ studentId }),
    }, 201);
    const admitId = admit.body.data.admitCard._id;
    await request("/admit/generate/bulk", {
      method: "POST",
      body: JSON.stringify({ studentIds: [studentId] }),
    });
    await request(`/admit/lookup?studentId=${studentId}`);
    await request(`/admit/download/${admitId}`);
    await request(`/admit/regenerate/${admitId}`, {
      method: "PUT",
      body: JSON.stringify({}),
    }, 201);

    const result = await request("/result", {
      method: "POST",
      body: JSON.stringify({ rollNumber, marks: 88 }),
    });
    resultId = result.body.data.result._id;
    await request(`/result/${resultId}`, {
      method: "PUT",
      body: JSON.stringify({ marks: 90 }),
    });
    await request(`/result/lookup?studentId=${studentId}`);
    await request("/result/publish", {
      method: "POST",
      body: JSON.stringify({ published: false, studentIds: [studentId] }),
    });
    await request("/result/publish", {
      method: "POST",
      body: JSON.stringify({ published: true, studentIds: [studentId] }),
    });
    await request(`/result/${resultId}/publish`, {
      method: "POST",
      body: JSON.stringify({ published: true }),
    });
    await request("/result/merit/recalculate", {
      method: "POST",
      body: JSON.stringify({ class: "8" }),
    });
    await request(`/marksheet/admin/download/${resultId}`);

    const notice = await request(
      "/notice",
      {
        method: "POST",
        body: JSON.stringify({
          title: noticeTitle,
          description: "Disposable API smoke notice",
          published: false,
        }),
      },
      201
    );
    noticeId = notice.body.data.notice._id;
    await request(`/notice/${noticeId}`, {
      method: "PUT",
      body: JSON.stringify({
        title: `${noticeTitle} updated`,
        description: "Updated",
        published: false,
      }),
    });
    await request(`/notice/${noticeId}`, { method: "DELETE" });
    noticeId = undefined;

    const gallery = await request(
      "/gallery",
      {
        method: "POST",
        body: JSON.stringify({
          title: galleryTitle,
          imageUrl: "https://example.com/smoke-gallery.png",
          category: "foundation_activities",
        }),
      },
      201
    );
    galleryId = gallery.body.data.item._id;
    await request(`/gallery/${galleryId}`, { method: "DELETE" });
    galleryId = undefined;

    const center = await request(
      "/center",
      {
        method: "POST",
        body: JSON.stringify({
          centerCode,
          centerName: "API Smoke Center",
          district: "Siwan",
          capacity: 10,
        }),
      },
      201
    );
    centerId = center.body.data.center._id;
    await request(`/center/${centerId}`, {
      method: "PUT",
      body: JSON.stringify({ centerName: "API Smoke Center Updated" }),
    });
    await request(`/center/${centerId}`, { method: "DELETE" });

    await request(`/result/${resultId}`, { method: "DELETE" });
    resultId = undefined;
    await request(`/student/${studentId}`, { method: "DELETE" });
    studentId = undefined;
    await request("/auth/logout", { method: "POST", body: JSON.stringify({}) });

    console.log("Admin API smoke test passed");
  } finally {
    await cleanup();
    await mongoose.disconnect();
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
