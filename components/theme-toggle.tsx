"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return null;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = getStoredTheme();
    setTheme(stored ?? getSystemTheme());
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={`切换${isDark ? "浅色" : "深色"}主题`}
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      className="inline-flex items-center gap-1.5 text-ink-tertiary hover:text-ink transition-colors"
    >
      {/* 左圆点：浅色=环○，深色=实心●，深色时右移 */}
      <span
        className={`inline-block size-2 rounded-full transition-all duration-500 ${
          isDark ? "translate-x-[14px] bg-current" : "border border-current bg-transparent"
        }`}
      />
      {/* 右圆点：浅色=实心●，深色=环○，深色时左移 */}
      <span
        className={`inline-block size-2 rounded-full transition-all duration-500 ${
          isDark ? "-translate-x-[14px] border border-current bg-transparent" : "bg-current"
        }`}
      />
    </button>
  );
}
