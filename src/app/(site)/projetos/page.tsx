import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { ProjectsExplorer } from "@/components/sections/projects-explorer";
import { getSiteContent } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projetos",
  description: "Portfólio completo de projetos de engenharia, com desafios, soluções e resultados.",
  alternates: { canonical: "/projetos" },
};

export default async function ProjectsPage() {
  const { projects } = await getSiteContent();
  return (
    <>
      <PageHero title="Portfólio de projetos" crumb="Projetos" />
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        {projects.length ? (
          <ProjectsExplorer projects={projects} />
        ) : (
          <p className="py-20 text-center text-muted">Os projetos serão publicados em breve.</p>
        )}
      </section>
    </>
  );
}
