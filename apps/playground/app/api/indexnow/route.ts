import { NextResponse } from "next/server";
import {
  getIndexNowUrlList,
  indexNowHost,
  indexNowKeyLocation,
  INDEXNOW_KEY,
  submitToIndexNow,
} from "../../../lib/indexnow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Auth for IndexNow submit:
 * - Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`
 * - Manual: same header with CRON_SECRET or INDEXNOW_SUBMIT_SECRET
 */
function isAuthorized(request: Request): boolean {
  const secret =
    process.env.CRON_SECRET?.trim() ||
    process.env.INDEXNOW_SUBMIT_SECRET?.trim();
  if (!secret) {
    // Local/dev convenience when no secret is configured
    return process.env.NODE_ENV !== "production";
  }
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return false;
  return header.slice("Bearer ".length) === secret;
}

async function handleSubmit(request: Request, urls?: string[]) {
  try {
    const result = await submitToIndexNow(urls);
    return NextResponse.json(
      {
        submitted: result.ok,
        status: result.status,
        endpoint: result.endpoint,
        urlCount: result.urlCount,
        host: indexNowHost(),
        keyLocation: indexNowKeyLocation(),
        engineBody: result.body || null,
      },
      { status: result.ok ? 200 : 502 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "IndexNow failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET — Vercel Cron hits this path daily.
 * - `?dry=1` → status only (no IndexNow notify)
 * - otherwise → submit full sitemap URL set
 */
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  if (searchParams.get("dry") === "1") {
    const urls = getIndexNowUrlList();
    return NextResponse.json({
      ready: true,
      dryRun: true,
      host: indexNowHost(),
      key: INDEXNOW_KEY,
      keyLocation: indexNowKeyLocation(),
      urlCount: urls.length,
      sample: urls.slice(0, 5),
      hint: "Omit ?dry=1 (or POST) to submit URLs to IndexNow.",
    });
  }

  return handleSubmit(request);
}

/**
 * POST — manual/deploy hook submit.
 * Optional JSON body: `{ "urlList": ["https://…"] }`
 */
export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let urls: string[] | undefined;
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const json = (await request.json()) as { urlList?: string[] };
      if (Array.isArray(json.urlList) && json.urlList.length > 0) {
        urls = json.urlList.filter((u) => typeof u === "string");
      }
    }
  } catch {
    // empty body is fine — submit full sitemap
  }

  return handleSubmit(request, urls);
}
