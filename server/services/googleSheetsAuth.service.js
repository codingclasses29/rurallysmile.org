import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";
const TOKEN_URI = "https://oauth2.googleapis.com/token";

let cachedCreds = null;
let cachedToken = null; // { access_token, expires_at }

function base64url(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/** Load service-account JSON from env or credentials file (FREE Sheets API) */
export function loadServiceAccount() {
  if (cachedCreds) return cachedCreds;

  const fromEnv = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (fromEnv) {
    try {
      cachedCreds = JSON.parse(fromEnv);
      return cachedCreds;
    } catch {
      throw new Error(
        "GOOGLE_SERVICE_ACCOUNT_JSON is invalid JSON. Paste the full service-account key JSON in one line."
      );
    }
  }

  const rel =
    process.env.GOOGLE_SERVICE_ACCOUNT_PATH?.trim() ||
    "credentials/google-service-account.json";
  const candidates = [
    path.isAbsolute(rel) ? rel : path.join(process.cwd(), rel),
    path.join(__dirname, "..", rel),
    path.join(__dirname, "../credentials/google-service-account.json"),
  ];

  for (const p of candidates) {
    if (fs.existsSync(p) && fs.statSync(p).isFile()) {
      cachedCreds = JSON.parse(fs.readFileSync(p, "utf8"));
      cachedCreds.__path = p;
      return cachedCreds;
    }
  }

  return null;
}

export function getServiceAccountEmail() {
  const creds = loadServiceAccount();
  return creds?.client_email || null;
}

export function hasServiceAccount() {
  try {
    return Boolean(loadServiceAccount()?.client_email && loadServiceAccount()?.private_key);
  } catch {
    return false;
  }
}

function createSignedJwt(creds) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64url(
    JSON.stringify({
      iss: creds.client_email,
      scope: SHEETS_SCOPE,
      aud: TOKEN_URI,
      exp: now + 3600,
      iat: now,
    })
  );
  const unsigned = `${header}.${claim}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const sig = base64url(signer.sign(creds.private_key));
  return `${unsigned}.${sig}`;
}

export async function getGoogleAccessToken() {
  const creds = loadServiceAccount();
  if (!creds?.client_email || !creds?.private_key) {
    return null;
  }

  if (cachedToken && cachedToken.expires_at > Date.now() + 60_000) {
    return cachedToken.access_token;
  }

  const assertion = createSignedJwt(creds);
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  });

  const res = await fetch(TOKEN_URI, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    signal: AbortSignal.timeout(20000),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.access_token) {
    throw new Error(
      json.error_description ||
        json.error ||
        `Google OAuth token failed (${res.status})`
    );
  }

  cachedToken = {
    access_token: json.access_token,
    expires_at: Date.now() + (Number(json.expires_in) || 3600) * 1000,
  };
  return cachedToken.access_token;
}

/**
 * Read private spreadsheet via Service Account (FREE quota).
 * Sheet must be shared with the service account email as Viewer.
 */
export async function fetchSheetValuesWithServiceAccount(
  spreadsheetId,
  range = "A:Z"
) {
  const token = await getGoogleAccessToken();
  if (!token) return null;

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
    range
  )}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(30000),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json?.error?.message || `HTTP ${res.status}`;
    const email = getServiceAccountEmail();
    if (res.status === 403 || /PERMISSION|not have permission/i.test(msg)) {
      throw new Error(
        `Service Account cannot read this sheet. Open Share → add "${email}" as Viewer (keep sheet private). Then Sync again.`
      );
    }
    if (/has not been used|disabled/i.test(msg)) {
      throw new Error(
        "Enable Google Sheets API (free): https://console.cloud.google.com/apis/library/sheets.googleapis.com"
      );
    }
    throw new Error(msg);
  }

  return {
    values: json.values || [],
    range: json.range,
    email: getServiceAccountEmail(),
  };
}

export function valuesToObjects(values) {
  if (!values?.length || values.length < 2) return [];
  const headers = values[0].map((h) => String(h || "").trim());
  return values.slice(1).map((line) => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h || `col${i}`] = line[i] ?? "";
    });
    return obj;
  });
}

export default {
  loadServiceAccount,
  getServiceAccountEmail,
  hasServiceAccount,
  getGoogleAccessToken,
  fetchSheetValuesWithServiceAccount,
  valuesToObjects,
};
