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
    init.body = await request.text();
  }

  const upstream = await fetch(targetUrl, init);
  const responseHeaders = new Headers();

  upstream.headers.forEach((value, key) => {
    if (HOP_BY_HOP_RESPONSE.has(key.toLowerCase())) {
      return;
    }
    responseHeaders.append(key, value);
  });

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
