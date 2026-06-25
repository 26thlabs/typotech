"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

interface BackLinkProps {
  /** 指定返回路径则渲染静态 Link，否则走浏览器 history.back() */
  href?: string;
  label?: string;
}

const CLS = "text-[13px] leading-[22px] sm:text-[14px] sm:leading-[24px] text-ink-secondary hover:text-accent transition-colors";

/** 静态返回链接 — 不订阅 router */
function StaticBackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className={CLS}>
      {label}
    </Link>
  );
}

/** 动态返回按钮 — 仅在无 href 时订阅 router */
function DynamicBackLink({ label }: { label: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={CLS}
      aria-label="返回上一页"
    >
      {label}
    </button>
  );
}

export function BackLink({ href, label = "← Back" }: BackLinkProps) {
  if (href) {
    return <StaticBackLink href={href} label={label} />;
  }
  return <DynamicBackLink label={label} />;
}
