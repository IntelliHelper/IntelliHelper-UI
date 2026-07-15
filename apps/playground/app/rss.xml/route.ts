import { CATALOG, CATEGORY_META } from "../../lib/catalog";
import {
  absoluteUrl,
  BRAND_NAME,
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "../../lib/seo";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const buildDate = new Date().toUTCString();

  const items = [
    {
      title: "Getting started with Intelli UI",
      link: absoluteUrl("/getting-started"),
      description:
        "Install Liquid Glass components with the CLI, agent plugin, or MCP for AI agents.",
      pubDate: buildDate,
    },
    ...CATALOG.map((item) => ({
      title: `${item.title} Component`,
      link: absoluteUrl(`/components/${item.slug}`),
      description: `${item.description} (${CATEGORY_META[item.category].label})`,
      pubDate: buildDate,
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${SITE_NAME} by ${BRAND_NAME}`)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml(DEFAULT_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${escapeXml(absoluteUrl("/rss.xml"))}" rel="self" type="application/rss+xml"/>
${items
  .map(
    (item) => `    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.link)}</guid>
      <description><![CDATA[${item.description}]]></description>
      <pubDate>${item.pubDate}</pubDate>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
