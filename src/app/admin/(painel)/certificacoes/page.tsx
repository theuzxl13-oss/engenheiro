import { FileText } from "lucide-react";
import { deleteCertification } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { CertificationForm } from "@/components/admin/forms";
import { AdminPageHeader, EmptyState, Panel } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth";
import { CERTIFICATION_KINDS, type Certification } from "@/lib/types";

export const metadata = { title: "Certificações" };

export default async function CertificationsAdminPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("certifications").select("*").order("sort_order").order("year", { ascending: false });
  const items = (data ?? []) as Certification[];

  return (
    <>
      <AdminPageHeader
        title="Certificações e formação"
        description="Diplomas, certificados, especializações, cursos, registro profissional e eventos. PDFs são exibidos no site."
      />
      <div className="space-y-8">
        <Panel title="Adicionar item">
          <CertificationForm />
        </Panel>
        <Panel title={`Itens cadastrados (${items.length})`}>
          {items.length ? (
            <ul className="space-y-3">
              {items.map((c) => (
                <li key={c.id}>
                  <details className="group rounded-xl border border-line">
                    <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 p-4">
                      <span className="rounded-full bg-tech-600/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                        {CERTIFICATION_KINDS[c.kind]}
                      </span>
                      <span className="flex-1 font-semibold text-fg-strong">{c.title}</span>
                      {c.file_url && <FileText className="size-4 text-muted" aria-label="Possui PDF" />}
                      {!c.published && <span className="rounded-full bg-bg-soft px-2.5 py-0.5 text-xs text-muted">Oculto</span>}
                      <span className="text-xs text-accent group-open:hidden">Editar</span>
                    </summary>
                    <div className="space-y-4 border-t border-line p-4">
                      <CertificationForm item={c} />
                      <DeleteButton action={deleteCertification} id={c.id} />
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState>Nenhum item cadastrado.</EmptyState>
          )}
        </Panel>
      </div>
    </>
  );
}
