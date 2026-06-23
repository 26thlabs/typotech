import { Suspense } from "react";
import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { getAllArticles, readingTime } from "@/lib/articles";
import { TagPills } from "@/components/tag-pills";
import { BackLink } from "@/components/back-link";

// 缓存 MDX import + 正文文本，避免 generateMetadata 和 Page 重复编译
const mdxCache = new Map<string, { default: any; metadata: any; body: string }>();

/** 移除文件顶部的 `export const metadata = { ... }`（大括号计数，容忍 } 在字符串中） */
function stripMetadata(raw: string): string {
  const start = raw.indexOf("export const metadata");
  if (start === -1) return raw;
  const brace = raw.indexOf("{", start);
  if (brace === -1) return raw;
  let depth = 0;
  for (let i = brace; i < raw.length; i++) {
    if (raw[i] === "{") depth++;
    else if (raw[i] === "}") { depth--; if (depth === 0) return raw.slice(0, start) + raw.slice(i + 1); }
  }
  return raw;
}

/** 剥离 MDX/JSX/HTML 标记，提取纯文本用于阅读时间计算 */
function stripMarkup(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, "")           // HTML/JSX 标签
    .replace(/\{[^}]*\}/g, "")         // JSX 表达式 + KaTeX 公式
    .replace(/[#*`~\[\]|]/g, "")       // Markdown 标记
    .replace(/export const \w+[\s\S]*?\n/g, "") // 其他 export
    .replace(/\n{2,}/g, "\n")          // 合并空行
    .trim();
}

async function getMDX(slug: string) {
  if (mdxCache.has(slug)) return mdxCache.get(slug)!;
  try {
    const mod = await import(`@/content/${slug}.mdx`);
    const raw = await fs.readFile(path.join(process.cwd(), "content", `${slug}.mdx`), "utf-8");
    const body = stripMetadata(raw).trimStart();
    const entry = { default: mod.default, metadata: mod.metadata, body };
    mdxCache.set(slug, entry);
    return entry;
  } catch {
    return null;
  }
}

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const mdx = await getMDX(params.slug);
  if (!mdx || mdx.metadata.draft) notFound();
  const { default: MDXContent, metadata, body } = mdx;
  const estRead = readingTime(stripMarkup(body));
  const displayDate = metadata.date?.replaceAll(".", "-");

  return (
    <article>
      {/* 文章页头 — blockSpacing: 48px */}
      <header className="mb-12">
        {/* h1 — mobile: 28px/36px, sm: 36px/44px, lg: 48px/56px */}
        <h1 className="font-sans text-[28px] leading-[36px] sm:text-[36px] sm:leading-[44px] lg:text-[48px] lg:leading-[56px] font-bold text-ink tracking-[-0.03em] mb-4">
          {metadata.title}
        </h1>

        {/* caption — mobile: 13px/20px, desktop: 14px/24px */}
        <div className="text-ink-secondary font-sans font-medium text-[13px] leading-[20px] sm:text-[14px] sm:leading-[24px] tracking-[0.01em]">
          {[
            metadata.author && `@${metadata.author}`,
            displayDate,
            `${estRead} min read`,
          ].filter(Boolean).join(" · ")}
        </div>

        {metadata.tags?.length > 0 && (
          <div className="mt-6">
            <TagPills tags={metadata.tags} link />
          </div>
        )}
      </header>

      {/* 文章正文 */}
      <div className="max-w-none prose-article">
        <Suspense fallback={<div className="h-64 flex items-center justify-center text-ink-tertiary">加载中…</div>}>
          <MDXContent />
        </Suspense>
      </div>

      <BackLink />
    </article>
  );
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const mdx = await getMDX(params.slug);
  if (!mdx || mdx.metadata.draft) return { title: "Not Found" };
  const { metadata } = mdx;

  return {
    title: metadata.title,
    description: metadata.description,
    ...(metadata.image && {
      openGraph: { images: [metadata.image] },
    }),
  };
}
