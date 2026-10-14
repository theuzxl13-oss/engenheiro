import { ArrowRight, Award, FolderKanban, Inbox, MessageSquareQuote, Wrench } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader, EmptyState, Panel } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth";
import { QUOTE_STATUSES, type QuoteRequest } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export default async function DashboardPage() {
  const { supabase } = await requireAdmin();
  const count = (table: string) => supabase.from(table).select("id", { count: "exact", head: true });

  const [projects, services, certifications, testimonials, newQuotes, latest] = await Promise.all([
    count("projects"),
    count("services"),
    count("certifications"),
    count("testimonials"),
    supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "novo"),
    supabase.from("quote_requests").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  const cards = [
    { href: "/admin/orcamentos", label: "Orçamentos novos", value: newQuotes.count ?? 0, icon: Inbox, highlight: true },
    { href: "/admin/projetos", label: "Projetos", value: projects.count ?? 0, icon: FolderKanban },
    { href: "/admin/servicos", label: "Serviços", value: services.count ?? 0, icon: Wrench },
    { href: "/admin/certificacoes", label: "Certificações", value: certifications.count ?? 0, icon: Award },
    { href: "/admin/depoimentos", label: "Depoimentos", value: testimonials.count ?? 0, icon: MessageSquareQuote },
  ];
  const quotes = (latest.data ?? []) as QuoteRequest[];

  return (
    <>
      <AdminPageHeader title="Visão geral" description="Resumo do conteúdo publicado e das solicitações recebidas." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map(({ href, label, value, icon: Icon, highlight }) => (
          <Link
            key={href}
            href={href}
            className={`rounded-2xl border p-5 transition-colors hover:border-accent ${highlight ? "border-gold-500/50 bg-gold-500/10" : "border-line bg-surface"}`}
          >
            <Icon className="size-5 text-accent" aria-hidden="true" />
            <p className="mt-4 font-display text-3xl font-bold text-fg-strong">{value}</p>
            <p className="text-sm text-muted">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Panel title="Últimas solicitações de orçamento">
          {quotes.length ? (
            <ul className="divide-y divide-line">
              {quotes.map((q) => (
                <li key={q.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                  <span>
                    <span className="font-semibold text-fg-strong">{q.name}</span>
                    <span className="text-muted"> — {q.service}</span>
                  </span>
                  <span className="flex items-center gap-3 text-xs text-muted">
                    <span className="rounded-full bg-bg-soft px-2.5 py-0.5">{QUOTE_STATUSES[q.status]}</span>
                    {formatDateTime(q.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState>Nenhuma solicitação recebida ainda.</EmptyState>
          )}
          <Link href="/admin/orcamentos" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
            Ver todas <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Panel>
      </div>
    </>
  );
}
