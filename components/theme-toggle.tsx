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

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
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
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [systemTheme, setSystemTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const stored = getStoredTheme();
    const sys = getSystemTheme();
    setSystemTheme(sys);
    // 每次页面加载时跟随系统
    const t = stored ?? sys;
    setTheme(t);
    applyTheme(t);
    localStorage.setItem("theme", t);
  }, []);

  const toggle = () => {
    // 系统为深色 → 不做任何切换（没有动画 = 没有闪烁）
    if (systemTheme === "dark") return;
    // 系统为浅色 → 支持浅↔深切
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
