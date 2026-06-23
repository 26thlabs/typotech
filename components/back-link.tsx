"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

interface BackLinkProps {
  /** 指定返回路径则渲染静态 Link，否则走浏览器 history.back() */
  href?: string;
  label?: string;
}

export function BackLink({ href, label = "← Back" }: BackLinkProps) {
  const router = useRouter();

  // caption — mobile: 13px/22px, desktop: 14px/24px
  const cls = "text-[13px] leading-[22px] sm:text-[14px] sm:leading-[24px] text-ink-secondary hover:text-accent transition-colors";

  if (href) {
    return (
      <Link href={href} className={cls}>
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={cls}
    >
      {label}
    </button>
  );
}
