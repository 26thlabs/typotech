import { getAllArticles } from "@/lib/articles";
import { site } from "@/lib/site";

/** XML 文本内容转义 */
function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function GET() {
  const articles = await getAllArticles();

  const items = articles
    .map(
      (a) =>
        `    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${site.url}/blog/${a.slug}</link>
      <guid isPermaLink="true">${site.url}/blog/${a.slug}</guid>
      <description><![CDATA[${a.description || a.title}]]></description>
      <pubDate>${new Date(a.date.replaceAll(".", "-")).toUTCString()}</pubDate>${
        a.tags
          ? "\n" + a.tags.map((t) => `      <category>${esc(t)}</category>`).join("\n")
          : ""
      }
    </item>`
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${site.name}</title>
    <description>${site.description}</description>
    <link>${site.url}</link>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
