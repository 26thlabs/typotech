import Link from "next/link";
import { getTagUrl } from "@/lib/urls";

// 半透明 bg-ink/N 自适应明暗主题，hover 微升不透明度
const base =
  "inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full caption bg-ink/8 hover:bg-ink/12 hover:text-ink transition-colors";

interface TagPillsProps {
  tags: string[];
  link?: boolean;
}

export function TagPills({ tags, link }: TagPillsProps) {
  if (!tags?.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {tags.map((tag, i) =>
        link ? (
          <Link key={`${tag}-${i}`} href={getTagUrl(tag)} className={base}>
            {tag}
          </Link>
        ) : (
          <span key={`${tag}-${i}`} className={base}>
            {tag}
          </span>
        )
      )}
    </div>
  );
}
