import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProjectForm } from "@/components/admin/forms";
import { AdminPageHeader } from "@/components/admin/page-header";

export const metadata = { title: "Novo projeto" };

export default function NewProjectPage() {
  return (
    <>
      <Link href="/admin/projetos" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent">
        <ArrowLeft className="size-4" aria-hidden="true" /> Projetos
      </Link>
      <AdminPageHeader title="Novo projeto" />
      <ProjectForm />
    </>
  );
}
