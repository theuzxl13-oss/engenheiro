import { deleteService } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { ServiceForm } from "@/components/admin/forms";
import { AdminPageHeader, EmptyState, Panel } from "@/components/admin/page-header";
import { ServiceIcon } from "@/components/ui/icons";
import { requireAdmin } from "@/lib/auth";
import type { Service } from "@/lib/types";

export const metadata = { title: "Serviços" };

export default async function ServicesAdminPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("services").select("*").order("sort_order").order("created_at");
  const services = (data ?? []) as Service[];

  return (
    <>
      <AdminPageHeader
        title="Serviços e especialidades"
        description="Cadastre apenas serviços compatíveis com suas atribuições profissionais."
      />
      <div className="space-y-8">
        <Panel title="Novo serviço">
          <ServiceForm />
        </Panel>
        <Panel title={`Serviços cadastrados (${services.length})`}>
          {services.length ? (
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.id}>
                  <details className="group rounded-xl border border-line">
                    <summary className="flex cursor-pointer list-none items-center gap-3 p-4">
                      <ServiceIcon name={s.icon} className="size-5 text-accent" />
                      <span className="flex-1 font-semibold text-fg-strong">{s.title}</span>
                      {!s.published && <span className="rounded-full bg-bg-soft px-2.5 py-0.5 text-xs text-muted">Oculto</span>}
                      <span className="text-xs text-accent group-open:hidden">Editar</span>
                    </summary>
                    <div className="space-y-4 border-t border-line p-4">
                      <ServiceForm service={s} />
                      <DeleteButton action={deleteService} id={s.id} />
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState>Nenhum serviço cadastrado.</EmptyState>
          )}
        </Panel>
      </div>
    </>
  );
}
