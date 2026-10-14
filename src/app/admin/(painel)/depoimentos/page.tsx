import { Star } from "lucide-react";
import { deleteTestimonial } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { TestimonialForm } from "@/components/admin/forms";
import { AdminPageHeader, EmptyState, Panel } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth";
import type { Testimonial } from "@/lib/types";

export const metadata = { title: "Depoimentos" };

export default async function TestimonialsAdminPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("testimonials").select("*").order("sort_order").order("created_at");
  const items = (data ?? []) as Testimonial[];

  return (
    <>
      <AdminPageHeader
        title="Depoimentos"
        description="Publique somente depoimentos reais, com autorização do cliente para divulgação."
      />
      <div className="space-y-8">
        <Panel title="Novo depoimento">
          <TestimonialForm />
        </Panel>
        <Panel title={`Depoimentos cadastrados (${items.length})`}>
          {items.length ? (
            <ul className="space-y-3">
              {items.map((t) => (
                <li key={t.id}>
                  <details className="group rounded-xl border border-line">
                    <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 p-4">
                      <span className="flex-1">
                        <span className="font-semibold text-fg-strong">{t.client_name}</span>
                        {t.company && <span className="text-sm text-muted"> — {t.company}</span>}
                      </span>
                      {t.rating && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted">
                          <Star className="size-3.5 fill-gold-500 text-gold-500" aria-hidden="true" /> {t.rating}
                        </span>
                      )}
                      {!t.published && <span className="rounded-full bg-bg-soft px-2.5 py-0.5 text-xs text-muted">Oculto</span>}
                      <span className="text-xs text-accent group-open:hidden">Editar</span>
                    </summary>
                    <div className="space-y-4 border-t border-line p-4">
                      <TestimonialForm item={t} />
                      <DeleteButton action={deleteTestimonial} id={t.id} />
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState>Nenhum depoimento cadastrado. A seção fica oculta no site até que haja depoimentos publicados.</EmptyState>
          )}
        </Panel>
      </div>
    </>
  );
}
