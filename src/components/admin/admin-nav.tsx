"use client";

import { Award, ExternalLink, FolderKanban, Inbox, LayoutDashboard, MessageSquareQuote, UserRound, Wrench } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/orcamentos", label: "Orçamentos", icon: Inbox },
  { href: "/admin/perfil", label: "Perfil e contato", icon: UserRound },
  { href: "/admin/servicos", label: "Serviços", icon: Wrench },
  { href: "/admin/projetos", label: "Projetos", icon: FolderKanban },
  { href: "/admin/certificacoes", label: "Certificações", icon: Award },
  { href: "/admin/depoimentos", label: "Depoimentos", icon: MessageSquareQuote },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Painel administrativo" className="flex gap-1 overflow-x-auto lg:flex-col">
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon className={cn("size-4", active && "text-gold-500")} aria-hidden="true" />
            {label}
          </Link>
        );
      })}
      <Link
        href="/"
        target="_blank"
        className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 hover:text-white lg:mt-4"
      >
        <ExternalLink className="size-4" aria-hidden="true" />
        Ver site
      </Link>
    </nav>
  );
}
