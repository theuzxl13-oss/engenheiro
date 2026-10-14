import { ArrowLeft, Calendar, CheckCircle2, Lightbulb, MapPin, Tag, Target } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectGallery } from "@/components/project/project-gallery";
import { ShareButtons } from "@/components/project/share-buttons";
import { LinkButton } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SmartImage } from "@/components/ui/smart-image";
import { getProjectBySlug, getSiteContent } from "@/lib/data";
import { SITE_URL } from "@/lib/env";
import { paragraphs } from "@/lib/utils";

/** Slug reservado: garante ao menos um parâmetro quando ainda não há projetos. */
const PLACEHOLDER_SLUG = "projeto";

export async function generateStaticParams() {
  const { projects } = await getSiteContent();
  const params = projects.map((p) => ({ slug: p.slug }));
  return params.length ? params : [{ slug: PLACEHOLDER_SLUG }];
}

export async function generateMetadata({ params }: PageProps<"/projetos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Projeto não encontrado" };
  const description = project.summary ?? project.description?.slice(0, 160) ?? undefined;
  return {
    title: project.title,
    description,
    alternates: { canonical: `/projetos/${project.slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description,
      url: `/projetos/${project.slug}`,
      images: project.cover_url && !project.cover_url.endsWith(".svg") ? [{ url: project.cover_url }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projetos/[slug]">) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const url = `${SITE_URL}/projetos/${project.slug}`;
  const blocks = [
    { icon: Target, title: "Desafios encontrados", text: project.challenges },
    { icon: Lightbulb, title: "Soluções desenvolvidas", text: project.solutions },
    { icon: CheckCircle2, title: "Resultados alcançados", text: project.results },
  ].filter((b) => b.text);

  return (
    <article>
      <header className="relative isolate overflow-hidden bg-navy-900 pb-20 pt-36 text-white">
        {project.cover_url && (
          <>
            <SmartImage src={project.cover_url} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-900/85 to-navy-900/60" />
          </>
        )}
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Link href="/projetos" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-gold-500">
            <ArrowLeft className="size-4" aria-hidden="true" /> Todos os projetos
          </Link>
          <br />
          <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy-900">
            <Tag className="size-3.5" aria-hidden="true" />
            {project.category}
          </p>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl">{project.title}</h1>
          {project.summary && <p className="mt-5 max-w-3xl text-lg text-white/75">{project.summary}</p>}
          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/80">
            {project.location && (
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-gold-500" aria-hidden="true" />
                <dt className="sr-only">Localização</dt>
                <dd>{project.location}</dd>
              </div>
            )}
            {project.year && (
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-gold-500" aria-hidden="true" />
                <dt className="sr-only">Ano de execução</dt>
                <dd>{project.year}</dd>
              </div>
            )}
          </dl>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-8">
          <ShareButtons url={url} title={project.title} />
          <LinkButton href="/#contato" variant="primary">
            Solicitar orçamento semelhante
          </LinkButton>
        </div>

        {project.description && (
          <Reveal className="mt-12">
            <h2 className="text-2xl font-bold">Sobre o projeto</h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-fg">
              {paragraphs(project.description).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
        )}

        {blocks.length > 0 && (
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {blocks.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.08} className="rounded-3xl border border-line bg-bg-soft p-7">
                <Icon className="size-7 text-accent" aria-hidden="true" />
                <h2 className="mt-5 text-lg font-bold">{title}</h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
                  {paragraphs(text).map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {project.gallery.length > 0 && (
          <section className="mt-16" aria-labelledby="galeria">
            <h2 id="galeria" className="mb-6 text-2xl font-bold">
              Galeria de imagens
            </h2>
            <ProjectGallery images={project.gallery} title={project.title} />
          </section>
        )}
      </div>
    </article>
  );
}
