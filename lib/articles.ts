import { cache } from "react";
import { promises as fs } from "fs";
import path from "path";
import { isPublished } from "./dates";

export interface ArticleMeta {
  readonly slug: string;
  readonly title: string;
  readonly date: string;
  readonly year: string;
  readonly sort: number;
  author?: string;
  description?: string;
  tags?: string[];
}

const contentDir = path.join(process.cwd(), "content");

/** 校验日期格式 YYYY.MM.DD，返回 sort key；不合法则返回 null */
function parseDate(raw: unknown): { year: string; sort: number } | null {
  if (typeof raw !== "string") return null;
  const m = raw.match(/^(\d{4})\.(\d{2})\.(\d{2})$/);
  if (!m) return null;
  const [, y, mo, d] = m;
  return {
    year: y!,
    sort: Number(y! + mo! + d!),
  };
}

/** 扫描 content/ 下所有 .mdx 文章，返回排序后的元数据列表 */
export const getAllArticles = cache(async (): Promise<ArticleMeta[]> => {
  let files: string[];
  try {
    files = await fs.readdir(contentDir);
  } catch {
    // content/ 目录不存在或不可读 → 返回空列表
    return [];
  }

  const articles: ArticleMeta[] = [];

  for (const file of files) {
    if (!file.endsWith(".mdx")) continue;

    let mod: { default: unknown; metadata: Record<string, unknown> };
    try {
      mod = await import(`@/content/${file}`);
    } catch (e) {
      console.error(`[articles] failed to import ${file}:`, e);
      continue;
    }

    if (!isPublished(mod.metadata)) continue;

    // 校验必填字段
    const title: unknown = mod.metadata.title;
    if (!title || typeof title !== "string") {
      console.warn(`[articles] skipping ${file}: missing or invalid title`);
      continue;
    }

    const rawDate: unknown = mod.metadata.date;
    const parsed = parseDate(rawDate);
    if (!parsed) {
      console.warn(`[articles] skipping ${file}: missing or invalid date (expected YYYY.MM.DD, got "${String(rawDate)}")`);
      continue;
    }
    const date = rawDate as string;

    // 过滤非字符串标签
    const rawTags: unknown[] = Array.isArray(mod.metadata.tags) ? mod.metadata.tags : [];
    const tags = rawTags.filter((t): t is string => typeof t === "string");

    articles.push({
      slug: file.replace(/\.mdx$/, ""),
      title,
      date,
      year: parsed.year,
      sort: parsed.sort,
      author: typeof mod.metadata.author === "string" ? mod.metadata.author : undefined,
      description: typeof mod.metadata.description === "string" ? mod.metadata.description : undefined,
      tags,
    });
  }

  articles.sort((a, b) => b.sort - a.sort);
  return articles;
});

/** 估算阅读时间（分钟），兼容中英文混排 */
export function readingTime(text: string): number {
  const trimmed = text.trim();
  // 英文：按空格分词 ~200 wpm；中文：按字符数 ~300 cpm（≈ 2 字/词）
  const latinWords = trimmed.split(/\s+/).filter((w) => /[a-zA-Z]/.test(w)).length;
  const cjkChars = (trimmed.match(/\p{Script=Han}/gu) || []).length;
  const totalWords = latinWords + Math.ceil(cjkChars / 2);
  return Math.max(1, Math.ceil(totalWords / 200));
}

/** 从所有文章中收集标签及其出现次数，按次数降序排列 */
export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const articles = await getAllArticles();
  const map = new Map<string, number>();
  for (const article of articles) {
    for (const t of article.tags || []) {
      map.set(t, (map.get(t) || 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
