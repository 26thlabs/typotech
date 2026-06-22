import { BackLink } from "@/components/back-link";

export default function NotFound() {
  return (
    <div className="flex-grow flex flex-col justify-center items-center gap-4">
      <p className="text-[64px] leading-[72px] font-sans font-bold text-border tracking-[-0.04em]">404</p>
      <p className="text-ink-secondary">Page not found.</p>
      <BackLink href="/" label="← Home" />
    </div>
  );
}
