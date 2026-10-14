import { ArrowRight, FolderOpen } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Project } from "@/lib/types";
import { ProjectsExplorer } from "./projects-explorer";

const HOME_LIMIT = 6;

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projetos" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Portfólio"
          title="Projetos que traduzem técnica em resultado"
          description="Uma seleção de trabalhos com o contexto, os desafios e as soluções de engenharia adotadas."
        />
        <div className="mt-12">
          {projects.length ? (
            <ProjectsExplorer projects={projects} limit={HOME_LIMIT} />
          ) : (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-line py-20 text-center text-muted">
              <FolderOpen className="size-10" aria-hidden="true" />
              <p className="mt-4">Os projetos serão publicados em breve.</p>
            </div>
          )}
        </div>
        {projects.length > HOME_LIMIT && (
          <div className="mt-12 text-center">
            <LinkButton href="/projetos" variant="outline">
              Ver todos os projetos <ArrowRight className="size-4" aria-hidden="true" />
            </LinkButton>
          </div>
        )}
      </div>
    </section>
  );
}
