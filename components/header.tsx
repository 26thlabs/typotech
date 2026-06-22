import Link from "next/link";
import { site, nav } from "@/lib/site";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="pt-8 lg:pt-12 pb-4 lg:pb-6 max-w-[720px] mx-auto w-full px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">

        {/* Logo — 仿 nanx: font-[550] 文字链接 */}
        <Link
          href="/"
          className="font-logo text-[20px] text-ink"
        >
          {site.name}
        </Link>

        {/* 导航 + 主题切换 — 仿 nanx: flex-wrap 文字链接 */}
        <div className="flex items-center gap-4 sm:gap-6">
          <nav
            aria-label="主导航"
            className="flex flex-wrap gap-4 sm:gap-6 text-[16px] leading-[28px] font-sans font-medium text-ink-secondary"
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
          <ThemeToggle />
        </div>

      </div>
    </header>
  );
}
