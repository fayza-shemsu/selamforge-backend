import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/auth";
import { TOKEN_COOKIE } from "@/lib/auth-constants";
import { getApiBaseUrl } from "@/lib/config";

type RouteContext = {
  params: { path: string[] };
};

const uuidPattern =
  "[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}";

function isAllowedRoute(path: string, method: string) {
  if (path === "employees") {
    return method === "GET" || method === "POST";
  }
  if (path === "employees/import") {
    return method === "POST";
  }
  if (new RegExp(`^employees/${uuidPattern}$`, "i").test(path)) {
    return ["GET", "PATCH", "DELETE"].includes(method);
  }
  if (
    new RegExp(`^employees/${uuidPattern}/(reports-chain|direct-reports|leave-balance)$`, "i").test(path)
  ) {
    return method === "GET";
  }
  if (path === "org-units" || path === "org-units/tree") {
    return method === "GET" || (path === "org-units" && method === "POST");
  }
  if (new RegExp(`^org-units/${uuidPattern}$`, "i").test(path)) {
    return method === "PATCH" || method === "DELETE";
  }
  if (path === "attendance") {
    return method === "GET";
  }
  if (path === "attendance/clock-in" || path === "attendance/clock-out") {
    return method === "POST";
  }
  return false;
}

async function proxy(request: NextRequest, { params }: RouteContext) {
  const path = params.path.join("/");
  const method = request.method;

  if (!isAllowedRoute(path, method)) {
    return NextResponse.json({ detail: "Not found" }, { status: 404 });
  }

  const token = await getToken();
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  const upstreamUrl = new URL(`/api/v1/${path}`, getApiBaseUrl());
  upstreamUrl.search = new URL(request.url).search;

  const headers = new Headers({ Authorization: `Bearer ${token}` });
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  try {
    const upstream = await fetch(upstreamUrl, {
      method,
      headers,
      body: method === "GET" ? undefined : await request.arrayBuffer(),
      cache: "no-store"
    });
    const response = new NextResponse(await upstream.text(), {
      status: upstream.status,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": upstream.headers.get("content-type") ?? "application/json"
      }
    });
    if (upstream.status === 401) {
      response.cookies.delete(TOKEN_COOKIE);
    }
    return response;
  } catch {
    return NextResponse.json(
      { detail: "Backend service is unavailable." },
      { status: 502 }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const DELETE = proxy;