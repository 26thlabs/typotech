"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

interface BackLinkProps {
  /** 指定返回路径则渲染静态 Link，否则走浏览器 history.back() */
  href?: string;
  label?: string;
}

const LINK_CLASS =
  "caption hover:text-accent transition-colors";

/** 动态返回按钮 — 仅在无 href 时渲染，useRouter 也仅在此路径被调用 */
function BackButton({ label }: { label: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={LINK_CLASS}
      aria-label="返回上一页"
    >
      {label}
    </button>
  );
}

export function BackLink({ href, label = "← Back" }: BackLinkProps) {
  if (href) {
    return (
      <Link href={href} className={LINK_CLASS}>
        {label}
      </Link>
    );
  }
  return <BackButton label={label} />;
}
