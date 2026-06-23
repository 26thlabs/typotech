import { site, footerLinks } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-8 sm:mt-12 mb-6 sm:mb-8 text-center font-sans font-medium text-[13px] leading-[22px] sm:text-[14px] sm:leading-[24px] text-ink-tertiary tracking-[0.01em]">
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-2">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="hover:text-accent transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="mt-2 text-[11px] leading-[18px] sm:text-[12px] sm:leading-[20px] text-ink-tertiary">
          &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
