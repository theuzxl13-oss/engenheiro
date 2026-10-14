"use client";

import { ArrowUpRight, Calendar, ImageOff, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SmartImage } from "@/components/ui/smart-image";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

const ALL = "Todos";

/** Galeria de projetos com filtro por categoria. */
export function ProjectsExplorer({ projects, limit }: { projects: Project[]; limit?: number }) {
  const [category, setCategory] = useState(ALL);
  const categories = useMemo(() => [ALL, ...Array.from(new Set(projects.map((p) => p.category)))], [projects]);
  const filtered = projects.filter((p) => category === ALL || p.category === category);
  const visible = limit ? filtered.slice(0, limit) : filtered;

  return (
    <>
      {categories.length > 2 && (
        <div role="group" aria-label="Filtrar projetos por categoria" className="mb-10 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={cn(
                "rounded-full border px-5 py-2 text-sm font-medium transition-all",
                category === c
                  ? "border-navy-900 bg-navy-900 text-white dark:border-gold-500 dark:bg-gold-500 dark:text-navy-900"
                  : "border-line text-muted hover:border-accent hover:text-accent",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <motion.ul layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((project, i) => (
            <motion.li
              layout
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              className="group"
            >
              <Link
                href={`/projetos/${project.slug}`}
                className="relative block overflow-hidden rounded-3xl border border-line bg-surface"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-navy-900">
                  {project.cover_url ? (
                    <SmartImage
                      src={project.cover_url}
                      alt={`Imagem do projeto ${project.title}`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-white/40">
                      <ImageOff className="size-10" aria-hidden="true" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/10 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy-900 backdrop-blur">
                    {project.category}
                  </span>
                  <span className="absolute right-4 top-4 grid size-10 translate-y-2 place-items-center rounded-full bg-gold-500 text-navy-900 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight className="size-5" aria-hidden="true" />
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold leading-snug transition-colors group-hover:text-accent">{project.title}</h3>
                  {project.summary && <p className="mt-2 line-clamp-2 text-sm text-muted">{project.summary}</p>}
                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
                    {project.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-3.5" aria-hidden="true" />
                        {project.location}
                      </span>
                    )}
                    {project.year && (
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="size-3.5" aria-hidden="true" />
                        {project.year}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </>
  );
}
