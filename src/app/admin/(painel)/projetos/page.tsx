import { ImageOff, Pencil, Plus, Star } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader, EmptyState } from "@/components/admin/page-header";
import { SmartImage } from "@/components/ui/smart-image";
import { requireAdmin } from "@/lib/auth";
import type { Project } from "@/lib/types";

export const metadata = { title: "Projetos" };

export default async function ProjectsAdminPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("featured", { ascending: false })
    .order("sort_order")
    .order("created_at", { ascending: false });
  const projects = (data ?? []) as Project[];

  return (
    <>
      <AdminPageHeader
        title="Projetos"
        description="Portfólio exibido no site, com galeria, desafios, soluções e resultados."
        actions={
          <Link
            href="/admin/projetos/novo"
            className="inline-flex items-center gap-2 rounded-lg bg-tech-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-tech-700"
          >
            <Plus className="size-4" aria-hidden="true" /> Novo projeto
          </Link>
        }
      />
      {projects.length ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <li key={p.id} className="flex gap-4 rounded-2xl border border-line bg-surface p-3">
              <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-bg-soft">
                {p.cover_url ? (
                  <SmartImage src={p.cover_url} alt="" fill sizes="96px" className="object-cover" />
                ) : (
                  <ImageOff className="absolute inset-0 m-auto size-6 text-muted" aria-hidden="true" />
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="flex items-center gap-1.5 text-xs text-muted">
                  {p.featured && <Star className="size-3.5 fill-gold-500 text-gold-500" aria-label="Destaque" />}
                  {p.category}
                  {p.year ? ` · ${p.year}` : ""}
                  {!p.published && <span className="rounded-full bg-bg-soft px-2 py-0.5">Oculto</span>}
                </p>
                <p className="mt-1 truncate font-semibold text-fg-strong">{p.title}</p>
                <Link
                  href={`/admin/projetos/${p.id}`}
                  className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                >
                  <Pencil className="size-3.5" aria-hidden="true" /> Editar
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState>Nenhum projeto cadastrado.</EmptyState>
      )}
    </>
  );
}
