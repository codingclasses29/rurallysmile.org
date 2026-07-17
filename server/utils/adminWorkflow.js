import ApiError from "./ApiError.js";

export const escapeRegex = (value = "") =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const parsePagination = (page, limit, maxLimit = 100) => {
  const parsedPage = Math.max(1, Number.parseInt(page, 10) || 1);
  const parsedLimit = Math.min(
    maxLimit,
    Math.max(1, Number.parseInt(limit, 10) || 20)
  );
  return {
    page: parsedPage,
    limit: parsedLimit,
    skip: (parsedPage - 1) * parsedLimit,
  };
};

export const parseStrictBoolean = (value, field = "value", optional = false) => {
  if (optional && value === undefined) return undefined;
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  throw new ApiError(400, `${field} must be true or false`);
};

export const parseDateRange = (from, to, field = "createdAt") => {
  if (!from && !to) return {};
  const range = {};
  if (from) {
    const date = new Date(from);
    if (Number.isNaN(date.getTime())) throw new ApiError(400, "Invalid dateFrom");
    date.setHours(0, 0, 0, 0);
    range.$gte = date;
  }
  if (to) {
    const date = new Date(to);
    if (Number.isNaN(date.getTime())) throw new ApiError(400, "Invalid dateTo");
    date.setHours(23, 59, 59, 999);
    range.$lte = date;
  }
  if (range.$gte && range.$lte && range.$gte > range.$lte) {
    throw new ApiError(400, "dateFrom must be before dateTo");
  }
  return { [field]: range };
};

export const buildSafeSort = (
  value,
  allowed = ["createdAt", "name", "class", "status", "registrationNumber"],
  fallback = { createdAt: -1 }
) => {
  if (!value) return fallback;
  const descending = String(value).startsWith("-");
  const field = String(value).replace(/^-/, "");
  if (!allowed.includes(field)) {
    throw new ApiError(400, `Unsupported sort field: ${field}`);
  }
  return { [field]: descending ? -1 : 1, _id: 1 };
};

export async function mapWithConcurrency(items, concurrency, worker) {
  const output = new Array(items.length);
  let cursor = 0;
  const count = Math.min(Math.max(1, concurrency), items.length || 1);
  await Promise.all(
    Array.from({ length: count }, async () => {
      while (cursor < items.length) {
        const index = cursor++;
        output[index] = await worker(items[index], index);
      }
    })
  );
  return output;
}

export function assignCompetitionRanks(rows) {
  const byClass = new Map();
  for (const row of rows) {
    const key = String(row.studentClass || "");
    if (!byClass.has(key)) byClass.set(key, []);
    byClass.get(key).push(row);
  }

  const ranked = [];
  for (const classRows of byClass.values()) {
    classRows.sort(
      (a, b) =>
        b.score - a.score ||
        String(a.rollNumber || "").localeCompare(String(b.rollNumber || "")) ||
        String(a.id).localeCompare(String(b.id))
    );
    let previousScore;
    let rank = 0;
    classRows.forEach((row, index) => {
      if (index === 0 || row.score !== previousScore) rank = index + 1;
      previousScore = row.score;
      ranked.push({ ...row, rank });
    });
  }
  return ranked;
}
