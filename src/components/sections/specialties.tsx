import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

/** Áreas de atuação (configuráveis no perfil). */
export function Specialties({ areas }: { areas: string[] }) {
  if (!areas.length) return null;
  return (
    <section id="especialidades" className="relative scroll-mt-20 overflow-hidden bg-navy-900 py-24 text-white sm:py-32">
      <div className="blueprint-grid absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          invert
          eyebrow="Especialidades"
          title="Áreas de atuação"
          description="Competências técnicas aplicadas com rigor normativo, visão de custo e foco no resultado do cliente."
        />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area, i) => (
            <Reveal as="li" key={area} delay={i * 0.06} className="group relative bg-navy-900 p-8 transition-colors hover:bg-navy-800">
              <span className="font-mono text-xs text-gold-500">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-6 font-display text-xl font-semibold text-white">{area}</p>
              <span
                className="absolute inset-x-8 bottom-0 h-px origin-left scale-x-0 bg-gold-500 transition-transform duration-500 group-hover:scale-x-100"
                aria-hidden="true"
              />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
