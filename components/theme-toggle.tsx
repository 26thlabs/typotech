"use client";

import { useState, useEffect, useCallback } from "react";

type Theme = "system" | "light" | "dark";

function resolve(stored: Theme): "light" | "dark" {
  if (stored === "dark") return "dark";
  if (stored === "light") return "light";
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function apply(html: HTMLElement, stored: Theme) {
  html.setAttribute("data-theme", stored);
  const r = resolve(stored);
  if (r === "dark") {
    html.classList.add("dark");
    html.classList.remove("light");
  } else {
    html.classList.add("light");
    html.classList.remove("dark");
  }
}

const NEXT: Record<Theme, Theme> = {
  system: "dark",
  dark: "light",
  light: "system",
} as const;

const LABEL: Record<Theme, string> = {
  system: "跟随系统",
  dark: "深色模式",
  light: "浅色模式",
} as const;

/* ---------- inline SVG icons (Lucide-style, 18×18) ---------- */

function SystemIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[18px] h-[18px]"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[18px] h-[18px]"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[18px] h-[18px]"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

const ICON: Record<Theme, React.ReactNode> = {
  system: <SystemIcon />,
  light: <SunIcon />,
  dark: <MoonIcon />,
};

/* ---------- component ---------- */

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  /* sync from DOM on mount */
  useEffect(() => {
    const current = document.documentElement.getAttribute(
      "data-theme"
    ) as Theme | null;
    setTheme(current === "light" || current === "dark" ? current : "system");
    setMounted(true);
  }, []);

  /* cycle: system → dark → light → system — state only, side effects in effect */
  const cycle = useCallback(() => {
    setTheme((prev) => NEXT[prev]);
  }, []);

  /* apply theme changes (side effects) */
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* localStorage unavailable */
    }
    apply(document.documentElement, theme);
  }, [theme, mounted]);

  /* when OS preference changes in system mode, re-apply */
  useEffect(() => {
    if (!mounted) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (document.documentElement.getAttribute("data-theme") === "system") {
        apply(document.documentElement, "system");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mounted]);

  /* placeholder before hydration — prevents layout shift */
  if (!mounted) {
    return <div className="w-9 h-9" aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      onClick={cycle}
      className="w-9 h-9 flex items-center justify-center rounded-full text-ink-tertiary hover:text-ink hover:bg-subtle transition-colors"
      aria-label={`主题：${LABEL[theme]}，点击切换`}
      title={LABEL[theme]}
    >
      <span key={theme} className="theme-toggle-icon">
        {ICON[theme]}
      </span>
    </button>
  );
}
