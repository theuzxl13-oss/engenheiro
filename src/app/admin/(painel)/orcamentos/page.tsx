import { Building2, Mail, Phone } from "lucide-react";
import { deleteQuote } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { QuoteForm } from "@/components/admin/forms";
import { AdminPageHeader, EmptyState } from "@/components/admin/page-header";
import { WhatsAppIcon } from "@/components/ui/icons";
import { requireAdmin } from "@/lib/auth";
import { QUOTE_STATUSES, type QuoteRequest, type QuoteStatus } from "@/lib/types";
import { cn, formatDateTime } from "@/lib/utils";

export const metadata = { title: "Orçamentos" };

const STATUS_STYLE: Record<QuoteStatus, string> = {
  novo: "bg-gold-500/20 text-gold-600 dark:text-gold-300",
  em_andamento: "bg-tech-600/15 text-accent",
  respondido: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  arquivado: "bg-bg-soft text-muted",
};

export default async function QuotesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("quote_requests").select("*").order("created_at", { ascending: false }).limit(500);
  const quotes = (data ?? []) as QuoteRequest[];

  return (
    <>
      <AdminPageHeader
        title="Solicitações de orçamento"
        description="Dados pessoais protegidos pela LGPD: use-os apenas para o atendimento e exclua quando não forem mais necessários."
      />
      {quotes.length ? (
        <ul className="space-y-4">
          {quotes.map((q) => {
            const digits = q.phone.replace(/\D/g, "");
            const wa = `https://wa.me/${digits.length <= 11 ? `55${digits}` : digits}?text=${encodeURIComponent(
              `Olá, ${q.name.split(" ")[0]}! Recebi sua solicitação de orçamento (${q.service}).`,
            )}`;
            return (
              <li key={q.id}>
                <details className="group rounded-2xl border border-line bg-surface" open={q.status === "novo"}>
                  <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 p-5">
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_STYLE[q.status])}>
                      {QUOTE_STATUSES[q.status]}
                    </span>
                    <span className="flex-1 font-semibold text-fg-strong">
                      {q.name} <span className="font-normal text-muted">— {q.service}</span>
                    </span>
                    <time className="text-xs text-muted" dateTime={q.created_at}>
                      {formatDateTime(q.created_at)}
                    </time>
                  </summary>
                  <div className="space-y-5 border-t border-line p-5">
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      <a href={`mailto:${q.email}?subject=${encodeURIComponent(`Orçamento — ${q.service}`)}`} className="inline-flex items-center gap-1.5 text-accent hover:underline">
                        <Mail className="size-4" aria-hidden="true" /> {q.email}
                      </a>
                      <a href={`tel:${digits}`} className="inline-flex items-center gap-1.5 text-accent hover:underline">
                        <Phone className="size-4" aria-hidden="true" /> {q.phone}
                      </a>
                      <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-emerald-600 hover:underline">
                        <WhatsAppIcon className="size-4" /> Responder pelo WhatsApp
                      </a>
                      {q.company && (
                        <span className="inline-flex items-center gap-1.5 text-muted">
                          <Building2 className="size-4" aria-hidden="true" /> {q.company}
                        </span>
                      )}
                    </div>
                    <p className="whitespace-pre-line rounded-xl bg-bg-soft p-4 text-sm leading-relaxed text-fg">{q.message}</p>
                    <QuoteForm quote={q} />
                    <DeleteButton action={deleteQuote} id={q.id} label="Excluir solicitação" />
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState>Nenhuma solicitação recebida ainda.</EmptyState>
      )}
    </>
  );
}
