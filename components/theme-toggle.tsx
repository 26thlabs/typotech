"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return null;
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  // Sync with stored / system on mount
  useEffect(() => {
    const stored = getStoredTheme();
    const sys = getSystemTheme();
    const t = stored ?? sys;
    setTheme(t);
    applyTheme(t);
    localStorage.setItem("theme", t);
  }, []);

  // Follow system theme changes (unless user set a stored preference)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (getStoredTheme()) return;
      const t = e.matches ? "dark" : "light";
      applyTheme(t);
      setTheme(t);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    // 系统深色 → 不切换（无动画 = 无闪烁）
    if (getSystemTheme() === "dark") return;
    // 系统浅色 → 浅↔深切
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
    setTheme(next);
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={`切换${isDark ? "浅色" : "深色"}主题`}
      onClick={toggle}
      className="inline-flex items-center gap-1.5 text-ink-tertiary hover:text-ink transition-colors"
    >
      {/* 左圆点：浅色=环○，深色=实心●，深色时右移 */}
      <span
        className={`inline-block size-2 rounded-full transition-all duration-500 ${
          isDark
            ? "translate-x-[14px] bg-current"
            : "border border-current bg-transparent"
        }`}
      />
      {/* 右圆点：浅色=实心●，深色=环○，深色时左移 */}
      <span
        className={`inline-block size-2 rounded-full transition-all duration-500 ${
          isDark
            ? "-translate-x-[14px] border border-current bg-transparent"
            : "bg-current"
        }`}
      />
    </button>
  );
}
