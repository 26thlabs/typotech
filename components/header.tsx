import Link from "next/link";
import { site, nav } from "@/lib/site";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="relative pt-6 sm:pt-8 lg:pt-12 pb-3 sm:pb-4 lg:pb-6 max-w-[720px] mx-auto w-full px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 pr-10 sm:pr-10">

        {/* Logo — mobile: 18px, desktop: 20px */}
        <Link
          href="/"
          className="font-logo text-[18px] sm:text-[20px] text-ink"
        >
          {site.name}
        </Link>

        {/* 导航 */}
        <nav
          aria-label="主导航"
          className="flex flex-wrap gap-3 sm:gap-6 text-[15px] leading-[24px] sm:text-[16px] sm:leading-[28px] font-sans font-medium text-ink-secondary"
        >
          {nav.main.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

      </div>

      {/* 主题切换 — 永远右对齐，与 Logo 顶部平齐，不随 nav 移动 */}
      <div className="absolute right-4 sm:right-6 top-6 sm:top-8 lg:top-12">
        <ThemeToggle />
      </div>
    </header>
  );
}
