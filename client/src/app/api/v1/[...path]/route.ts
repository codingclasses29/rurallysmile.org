import { NextRequest, NextResponse } from "next/server";

const API_ORIGIN = (
  process.env.API_PROXY_TARGET ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://rurallysmile-org-4.onrender.com"
)
  .replace(/\/$/, "")
  .replace(/\/api\/v1$/, "");

function buildTargetUrl(path: string[], request: NextRequest) {
  const joinedPath = path.join("/");
  const search = request.nextUrl.search || "";
  return `${API_ORIGIN}/api/v1/${joinedPath}${search}`;
}

const HOP_BY_HOP_REQUEST = new Set([
  "host",
  "origin",
  "connection",
  "content-length",
  "accept-encoding",
  "transfer-encoding",
]);

const HOP_BY_HOP_RESPONSE = new Set([
  "content-encoding",
  "content-length",
  "transfer-encoding",
  "connection",
]);

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path = [] } = await context.params;
  const targetUrl = buildTargetUrl(path, request);
  const headers = new Headers();

  request.headers.forEach((value, key) => {
    if (HOP_BY_HOP_REQUEST.has(key.toLowerCase())) {
      return;
    }
    headers.set(key, value);
  });

  // Ask upstream for plain bytes. Node fetch decompresses gzip, so
  // forwarding Content-Encoding would break the browser (ERR_CONTENT_DECODING_FAILED).
  headers.set("accept-encoding", "identity");

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
  };

  if (!["GET", "HEAD"].includes(request.method)) {
    // Use binary body — request.text() UTF-8-mangles multipart photos/signatures
    // into U+FFFD and Cloudinary then stores unusable /raw/ files.
    init.body = Buffer.from(await request.arrayBuffer());
  }

  const upstream = await fetch(targetUrl, init);
  const responseHeaders = new Headers();

  upstream.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (HOP_BY_HOP_RESPONSE.has(lower)) return;
    // set-cookie is handled below via getSetCookie() — forEach can drop duplicates
    if (lower === "set-cookie") return;
    responseHeaders.append(key, value);
  });

  const setCookies =
    typeof upstream.headers.getSetCookie === "function"
      ? upstream.headers.getSetCookie()
      : [];
  for (const cookie of setCookies) {
    // Cookies are for the Vercel host (same-origin /api/v1), not Render.
    responseHeaders.append(
      "set-cookie",
      cookie.replace(/;\s*Domain=[^;]+/i, "")
    );
  }

  const body = await upstream.arrayBuffer();

  return new NextResponse(body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, context);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, context);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, context);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, context);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, context);
}

export async function OPTIONS(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, context);
}
