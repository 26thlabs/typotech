import Link from "next/link";
import type { ArticleMeta } from "@/lib/articles";

interface PostListProps {
  articles: ArticleMeta[];
}

/** 按年份分组的文章列表，posts 目录页和标签页共用 */
export function PostList({ articles }: PostListProps) {
  const grouped: Record<string, ArticleMeta[]> = {};
  for (const item of articles) {
    (grouped[item.year] ??= []).push(item);
  }

  if (articles.length === 0) {
    return <p className="text-ink-tertiary">No articles found.</p>;
  }

  return (
    <ul className="list-none pl-0 space-y-8">
      {Object.entries(grouped).map(([year, yearItems]) => (
        <li key={year}>
          {/* 年份标题 — scale.h4: 22px / 30px / semibold */}
          <h2 className="font-sans text-[22px] leading-[30px] font-semibold text-ink tracking-[-0.02em] mb-4">
            {year}
          </h2>
          <div className="space-y-6">
            {yearItems.map(({ slug, date, title }) => (
              <div
                key={slug}
                className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6"
              >
                {/* scale.caption: 14px / 24px / regular, color.secondary */}
                <time
                  dateTime={date}
                  className="font-sans font-normal text-ink-secondary text-[14px] leading-[24px] tracking-[0.01em] shrink-0 sm:w-24 tabular-nums"
                >
                  {date.replaceAll(".", "-")}
                </time>
                <Link
                  href={`/blog/${slug}`}
                  className="font-sans font-medium hover:text-accent leading-snug transition-colors"
                >
                  {title}
                </Link>
              </div>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
