import { site, footerLinks } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-4 sm:mt-8 mb-6 sm:mb-8 text-center caption text-ink-tertiary">
      <div className="flex flex-col items-center gap-4" suppressHydrationWarning>
        <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-2">
          {footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href?.startsWith("http") ? "_blank" : undefined}
              rel={link.href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="hover:text-accent transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="text-[11px] leading-[18px] sm:text-[12px] sm:leading-[20px] text-ink-tertiary">
          &copy; {year} {site.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
