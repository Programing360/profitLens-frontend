"use client";

import { useTheme } from "@/src/providers/theme-provider";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        aria-label="Loading theme"
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-text-primary opacity-60 dark:bg-slate-900 dark:text-white"
      >
        <Sun size={19} />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-text-primary transition-colors hover:bg-slate-100 dark:text-white dark:bg-slate-900 dark:hover:bg-slate-800"
    >
      {isDark ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}
