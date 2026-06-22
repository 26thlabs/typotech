import { cache } from "react";
import { promises as fs } from "fs";
import path from "path";

export interface ArticleMeta {
  slug: string;
  title: string;
  date: string;
  year: string;
  sort: number;
  author?: string;
  description?: string;
  tags?: string[];
}

const contentDir = path.join(process.cwd(), "content");

/** 扫描 content/ 下所有 .mdx 文章，返回排序后的元数据列表 */
export const getAllArticles = cache(async (): Promise<ArticleMeta[]> => {
  const files = await fs.readdir(contentDir);
  const articles: ArticleMeta[] = [];

  for (const file of files) {
    if (!file.endsWith(".mdx")) continue;
    const mod = await import(`@/content/${file}`);
    if (!mod.metadata || mod.metadata.draft) continue;

    if (!mod.metadata.date) continue; // 无日期 = 不可发布
    const date = mod.metadata.date;

    articles.push({
      slug: file.replace(/\.mdx$/, ""),
      title: mod.metadata.title,
      date,
      year: date.split(".")[0],
      sort: Number(date.replace(/\./g, "")),
      author: mod.metadata.author,
      description: mod.metadata.description,
      tags: mod.metadata.tags,
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
  for (const a of articles) {
    for (const t of a.tags || []) {
      map.set(t, (map.get(t) || 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

