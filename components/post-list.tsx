import Link from "next/link";
import type { ArticleMeta } from "@/lib/articles";

interface PostListProps {
  articles: ArticleMeta[];
}

/** 按年份分组、倒序排列的文章列表，posts 目录页和标签页共用 */
export function PostList({ articles }: PostListProps) {
  if (articles.length === 0) {
    return <p className="text-ink-tertiary">No articles found.</p>;
  }

  // 按年份降序排列，同年内按日期降序
  const sorted = [...articles].sort(
    (a, b) => b.sort - a.sort || b.date.localeCompare(a.date)
  );

  const grouped: Record<string, ArticleMeta[]> = {};
  for (const item of sorted) {
    (grouped[item.year] ??= []).push(item);
  }

  // 年份降序
  const years = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <ul className="list-none pl-0 space-y-8">
      {years.map((year) => (
        <li key={year}>
          {/* 年份标题 — mobile: 20px/28px, desktop: 22px/30px, semibold */}
          <h2 className="font-sans text-[20px] leading-[28px] sm:text-[22px] sm:leading-[30px] font-semibold text-ink tracking-[-0.02em] mb-4">
            {year}
          </h2>
          <div className="space-y-6">
            {(grouped[year] ?? []).map(({ slug, date, title }) => (
              <div
                key={slug}
                className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6"
              >
                {/* caption — mobile: 13px/22px, desktop: 14px/24px */}
                <time
                  dateTime={date?.replaceAll(".", "-") ?? ""}
                  className="font-sans font-normal text-ink-secondary text-[13px] leading-[22px] sm:text-[14px] sm:leading-[24px] tracking-[0.01em] shrink-0 sm:w-24 tabular-nums"
                >
                  {date?.replaceAll(".", "-") ?? "—"}
                </time>
                <Link
                  href={`/blog/${slug}`}
                  className="font-sans font-medium hover:text-accent leading-snug transition-colors"
                >
                  {title ?? "Untitled"}
                </Link>
              </div>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
