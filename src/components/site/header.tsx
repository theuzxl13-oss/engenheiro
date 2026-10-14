"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";
import { ThemeToggle } from "./theme-toggle";

export function Header({ name, headline, banner }: { name: string; headline: string; banner?: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("inicio");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Destaca a seção visível no menu.
  useEffect(() => {
    if (!isHome) return;
    const sections = NAV_ITEMS.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || !isHome || open;
  const initials = name
    .replace(/[[\]]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid ? "border-b border-line/70 bg-bg/85 text-fg-strong shadow-sm backdrop-blur-xl" : "text-white",
      )}
    >
      {banner}
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-navy-900"
      >
        Pular para o conteúdo
      </a>
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 transition-all duration-500 sm:px-8",
          solid ? "py-3" : "py-5",
        )}
      >
        <Link href="/" className="group flex items-center gap-3" aria-label={`${name} — página inicial`}>
          <span className="grid size-10 place-items-center rounded-lg border border-gold-500/60 font-display text-sm font-bold tracking-wider text-gold-500 transition-colors group-hover:bg-gold-500 group-hover:text-navy-900">
            {initials || "EN"}
          </span>
          <span className="hidden max-w-[16rem] flex-col leading-tight sm:flex">
            <span className="truncate font-display text-sm font-bold tracking-wide">{name}</span>
            <span className={cn("truncate text-[11px] uppercase tracking-[0.18em]", solid ? "text-muted" : "text-white/60")}>
              {headline}
            </span>
          </span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = isHome && active === item.id;
              return (
                <li key={item.id}>
                  <Link
                    href={item.id === "inicio" ? "/" : `/#${item.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-gold-500",
                      isActive && "text-gold-500",
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute inset-x-3 -bottom-0.5 h-px origin-left bg-gold-500 transition-transform duration-300",
                        isActive ? "scale-x-100" : "scale-x-0",
                      )}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/#contato"
            className="hidden whitespace-nowrap rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-300 md:inline-flex"
          >
            Solicitar orçamento
          </Link>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-current/15 xl:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-mobile" aria-label="Menu móvel" className="h-[calc(100dvh-4rem)] overflow-y-auto px-5 pb-10 pt-6 xl:hidden">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.id === "inicio" ? "/" : `/#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="block border-b border-line py-4 font-display text-xl font-semibold text-fg-strong"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/#contato"
            onClick={() => setOpen(false)}
            className="mt-8 flex justify-center rounded-full bg-gold-500 px-5 py-3.5 font-semibold text-navy-900"
          >
            Solicitar orçamento
          </Link>
        </nav>
      )}
    </header>
  );
}
