import { getSitemapEntries } from "./sitemap-routes";
import { absoluteUrl, SITE_URL } from "./seo";

/**
 * IndexNow key (hex). Hosted at `/{key}.txt` so Bing/Yandex/etc. can verify ownership.
 * Override with INDEXNOW_KEY if rotating keys in production.
 * @see https://www.indexnow.org/documentation
 */
export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY?.trim() || "0ab1a0df4c4fb4cbd0c3cd2bbabf8d30";

export function indexNowKeyLocation(): string {
  return absoluteUrl(`/${INDEXNOW_KEY}.txt`);
}

export function indexNowHost(): string {
  return new URL(SITE_URL).host;
}

/** Cap per IndexNow request (protocol allows up to 10,000). */
const MAX_URLS_PER_REQUEST = 10_000;

/**
 * Collect absolute URLs to notify: full sitemap by default, or a filtered list.
 */
export function getIndexNowUrlList(urls?: string[]): string[] {
  if (urls && urls.length > 0) {
    return [...new Set(urls)].slice(0, MAX_URLS_PER_REQUEST);
  }
  return getSitemapEntries()
    .map((entry) => entry.url)
    .slice(0, MAX_URLS_PER_REQUEST);
}

export type IndexNowSubmitResult = {
  ok: boolean;
  status: number;
  endpoint: string;
  urlCount: number;
  body: string;
};

/**
 * POST URL set to the public IndexNow endpoint (shared by Bing and partners).
 */
export async function submitToIndexNow(
  urls?: string[],
): Promise<IndexNowSubmitResult> {
  const urlList = getIndexNowUrlList(urls);
  const endpoint = "https://api.indexnow.org/indexnow";
  const payload = {
    host: indexNowHost(),
    key: INDEXNOW_KEY,
    keyLocation: indexNowKeyLocation(),
    urlList,
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  const body = await response.text().catch(() => "");

  return {
    // 200 / 202 accepted; 422 invalid URL set; some engines return 200 empty
    ok: response.status === 200 || response.status === 202,
    status: response.status,
    endpoint,
    urlCount: urlList.length,
    body: body.slice(0, 500),
  };
}
