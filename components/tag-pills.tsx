import Link from "next/link";

interface TagPillsProps {
  tags: string[];
  link?: boolean;
}

export function TagPills({ tags, link }: TagPillsProps) {
  // 半透明 bg-ink/N 自适应明暗主题，hover 微升不透明度
  const base =
    "inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-[13px] leading-[22px] sm:text-[14px] sm:leading-[24px] font-medium font-sans tracking-[0.01em] text-ink-secondary bg-ink/8 hover:bg-ink/12 hover:text-ink transition-colors";

  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {tags.map((tag) =>
        link ? (
          <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className={base}>
            {tag}
          </Link>
        ) : (
          <span key={tag} className={base}>
            {tag}
          </span>
        )
      )}
    </div>
  );
}
