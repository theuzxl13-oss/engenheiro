"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  function toggle() {
    const isDark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      // armazenamento indisponível (modo privativo)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Alternar tema claro/escuro"
      title="Alternar tema"
      className={cn(
        "grid size-10 place-items-center rounded-full border border-current/15 transition-colors hover:border-gold-500 hover:text-gold-500",
        className,
      )}
    >
      <Sun className="hidden size-[18px] dark:block" aria-hidden="true" />
      <Moon className="size-[18px] dark:hidden" aria-hidden="true" />
    </button>
  );
}
