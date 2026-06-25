import { Suspense } from "react";
import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { getAllArticles, readingTime } from "@/lib/articles";
import { formatDisplayDate, isPublished } from "@/lib/dates";
import { TagPills } from "@/components/tag-pills";
import { BackLink } from "@/components/back-link";

/** Metadata shape from MDX frontmatter. Keep in sync with individual .mdx exports. */
export interface MdxMetadata {
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
  author?: string;
  draft?: boolean;
  image?: string;
  [key: string]: unknown;
}

/** Cached MDX entry: the rendered component, parsed metadata, and raw body text. */
interface MdxEntry {
  default: React.ComponentType;
  metadata: MdxMetadata;
  body: string;
}

const mdxCache = new Map<string, MdxEntry>();

/**
 * Remove the top-level `export const metadata = { ... }` block from a raw source
 * string so it does not leak into the article body. Uses a simple brace-depth
 * counter — MDX metadata blocks never contain braces inside string literals
 * that would foil a plain counter.
 */
function stripMetadata(raw: string): string {
  const start = raw.indexOf("export const metadata");
  if (start === -1) return raw;
  const brace = raw.indexOf("{", start);
  if (brace === -1) return raw;
  let depth = 0;
  for (let i = brace; i < raw.length; i++) {
    const current = raw[i];
    if (current === "{") {
      depth++;
    } else if (current === "}") {
      depth--;
      if (depth === 0) {
        return raw.slice(0, start) + raw.slice(i + 1);
      }
    }
  }
  return raw;
}

/** Strip MDX/JSX/HTML markup, leaving plain text for reading-time estimation. */
function stripMarkup(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, "")           // HTML/JSX tags
    .replace(/\{[^}]*\}/g, "")         // JSX expressions + KaTeX formulas
    .replace(/[#*`~\[\]|]/g, "")       // Markdown sigils
    .replace(/export const \w+[\s\S]*?\n/g, "") // other exports
    .replace(/\n{2,}/g, "\n")          // collapse blank lines
    .trim();
}

async function getMDX(slug: string): Promise<MdxEntry | null> {
  if (mdxCache.has(slug)) return mdxCache.get(slug)!;
  try {
    const mod = await import(`@/content/${slug}.mdx`);
    const raw = await fs.readFile(
      path.join(process.cwd(), "content", `${slug}.mdx`),
      "utf-8",
    );
    const body = stripMetadata(raw).trimStart();
    const entry: MdxEntry = {
      default: mod.default,
      metadata: mod.metadata,
      body,
    };
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
  if (!mdx || !isPublished(mdx.metadata)) notFound();

  const {
    default: MDXContent,
    metadata,
    body,
  } = mdx;
  const estRead = readingTime(stripMarkup(body));
  const displayDate = formatDisplayDate(metadata.date ?? "");

  return (
    <article>
      {/* Article header — blockSpacing: 48px */}
      <header className="mb-12">
        {/* h1 — mobile: 28px/36px, sm: 36px/44px, lg: 48px/56px */}
        <h1 className="font-sans text-[28px] leading-[36px] sm:text-[36px] sm:leading-[44px] lg:text-[48px] lg:leading-[56px] font-bold text-ink tracking-[-0.03em] mb-4">
          {metadata.title}
        </h1>

        {/* caption — mobile: 13px/20px, desktop: 14px/24px */}
        <div className="caption">
          {[
            metadata.author && `@${metadata.author}`,
            displayDate,
            `${estRead} min read`,
          ]
            .filter(Boolean)
            .join(" · ")}
        </div>

        {(metadata.tags?.length ?? 0) > 0 && (
          <div className="mt-6">
            <TagPills tags={metadata.tags!} link />
          </div>
        )}
      </header>

      {/* Article body */}
      <div className="max-w-none prose-article">
        <Suspense
          fallback={
            <div className="h-64 flex items-center justify-center text-ink-tertiary">
              加载中…
            </div>
          }
        >
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
  if (!mdx || !isPublished(mdx.metadata)) return { title: "Not Found" };
  const { metadata } = mdx;

  return {
    title: metadata.title,
    description: metadata.description,
    ...(metadata.image && {
      openGraph: { images: [metadata.image] },
    }),
  };
}
