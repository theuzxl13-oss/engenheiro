import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteProject } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { ProjectForm } from "@/components/admin/forms";
import { AdminPageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth";
import type { Project } from "@/lib/types";

export const metadata = { title: "Editar projeto" };

export default async function EditProjectPage({ params }: PageProps<"/admin/projetos/[id]">) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const project = data as Project;

  return (
    <>
      <Link href="/admin/projetos" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent">
        <ArrowLeft className="size-4" aria-hidden="true" /> Projetos
      </Link>
      <AdminPageHeader
        title={project.title}
        actions={
          <div className="flex items-center gap-3">
            {project.published && (
              <Link
                href={`/projetos/${project.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm font-medium hover:border-accent hover:text-accent"
              >
                <ExternalLink className="size-4" aria-hidden="true" /> Ver no site
              </Link>
            )}
            <DeleteButton action={deleteProject} id={project.id} label="Excluir projeto" />
          </div>
        }
      />
      <ProjectForm project={project} />
    </>
  );
}
