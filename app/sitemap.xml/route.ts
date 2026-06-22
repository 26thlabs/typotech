import { getAllArticles } from "@/lib/articles";
import { site } from "@/lib/site";

export async function GET() {
  const articles = await getAllArticles();

  const staticPages = ["", "/blog"].map(
    (path) =>
      `  <url>
    <loc>${site.url}${path}</loc>
    <changefreq>daily</changefreq>
    <priority>${path === "" ? "1.0" : "0.8"}</priority>
  </url>`
  );

  const articlePages = articles.map(
    (a) =>
      `  <url>
    <loc>${site.url}/blog/${a.slug}</loc>
    <lastmod>${a.date.replaceAll(".", "-")}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
  );

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.join("\n")}
${articlePages.join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
