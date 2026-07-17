import test from "node:test";
import assert from "node:assert/strict";
import {
  assignCompetitionRanks,
  buildSafeSort,
  escapeRegex,
  parsePagination,
  parseStrictBoolean,
} from "../utils/adminWorkflow.js";
import {
  isUnsafeZipPath,
  normalizeStudentRow,
  buildStudentImportSample,
  buildStudentMediaSample,
  parseStudentWorkbook,
  readMediaZip,
} from "../services/studentImport.service.js";

test("pagination is bounded and sort fields are allowlisted", () => {
  assert.deepEqual(parsePagination("-2", "999"), { page: 1, limit: 100, skip: 0 });
  assert.deepEqual(buildSafeSort("-name"), { name: -1, _id: 1 });
  assert.throws(() => buildSafeSort("$where"), /Unsupported sort field/);
});

test("regex input is escaped and booleans are strict", () => {
  assert.equal(escapeRegex("a.*(b)"), "a\\.\\*\\(b\\)");
  assert.equal(parseStrictBoolean("false"), false);
  assert.throws(() => parseStrictBoolean("yes", "published"), /must be true or false/);
});

test("competition ranking is class-aware and skips after ties", () => {
  const ranked = assignCompetitionRanks([
    { id: "a", studentClass: "6", rollNumber: "2", score: 90 },
    { id: "b", studentClass: "6", rollNumber: "1", score: 90 },
    { id: "c", studentClass: "6", rollNumber: "3", score: 80 },
    { id: "d", studentClass: "7", rollNumber: "1", score: 70 },
  ]);
  assert.deepEqual(
    ranked.map(({ id, rank }) => [id, rank]),
    [["b", 1], ["a", 1], ["c", 3], ["d", 1]]
  );
});

test("ZIP traversal paths are rejected", () => {
  assert.equal(isUnsafeZipPath("../photo.png"), true);
  assert.equal(isUnsafeZipPath("C:\\temp\\photo.png"), true);
  assert.equal(isUnsafeZipPath("/root/photo.png"), true);
  assert.equal(isUnsafeZipPath("class-6/photo.png"), false);
});

test("student row normalization returns focused validation errors", () => {
  const valid = normalizeStudentRow(
    {
      Name: "Asha",
      Class: 8,
      Mobile: "98765 43210",
      Email: "ASHA@example.com",
      Gender: "female",
      Photo: "asha.png",
      Signature: "asha-sign.png",
    },
    2
  );
  assert.deepEqual(valid.errors, []);
  assert.equal(valid.data.class, "8");
  assert.equal(valid.data.email, "asha@example.com");
  assert.equal(valid.data.gender, "Female");

  const invalid = normalizeStudentRow({ Name: "", Class: 12 }, 3);
  assert.ok(invalid.errors.length >= 4);
});

test("generated import samples round-trip through hardened parsers", async () => {
  const excel = await buildStudentImportSample();
  const parsed = await parseStudentWorkbook({
    buffer: excel,
    size: excel.length,
    originalname: "sample.xlsx",
  });
  assert.equal(parsed.rows.length, 1);
  assert.equal(parsed.rows[0].Name, "Sample Student");

  const mediaZip = await buildStudentMediaSample();
  const media = await readMediaZip({
    buffer: mediaZip,
    size: mediaZip.length,
    originalname: "sample.zip",
  });
  assert.ok(media.has("9876543210-photo.png"));
  assert.ok(media.has("9876543210-signature.png"));
});
