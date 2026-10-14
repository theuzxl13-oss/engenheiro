import { Award, BadgeCheck, BookOpen, CalendarDays, GraduationCap, Medal, ScrollText, type LucideIcon } from "lucide-react";
import { PdfViewerButton } from "@/components/ui/pdf-viewer";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { CERTIFICATION_KINDS, type Certification, type CertificationKind } from "@/lib/types";

const KIND_ICONS: Record<CertificationKind, LucideIcon> = {
  diploma: GraduationCap,
  certificado: Award,
  especializacao: Medal,
  curso: BookOpen,
  registro: BadgeCheck,
  evento: CalendarDays,
  outro: ScrollText,
};

export function Certifications({ items }: { items: Certification[] }) {
  if (!items.length) return null;
  return (
    <section id="certificacoes" className="relative scroll-mt-20 overflow-hidden bg-bg-soft py-24 sm:py-32">
      <div className="subtle-grid absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Certificações e formação"
          title="Qualificação técnica comprovada"
          description="Formação acadêmica, registro profissional, especializações e atualização contínua."
          align="center"
        />
        <ul className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-2">
          {items.map((item, i) => {
            const Icon = KIND_ICONS[item.kind] ?? Award;
            return (
              <Reveal as="li" key={item.id} delay={(i % 2) * 0.08} className="flex gap-5 rounded-2xl border border-line bg-surface p-6 transition-shadow hover:shadow-xl hover:shadow-tech-600/5">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-gold-500/40 text-gold-600 dark:text-gold-500">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    {CERTIFICATION_KINDS[item.kind]}
                    {item.year ? ` · ${item.year}` : ""}
                  </p>
                  <h3 className="mt-1.5 text-lg font-bold leading-snug">{item.title}</h3>
                  {item.issuer && <p className="mt-1 text-sm text-fg">{item.issuer}</p>}
                  {item.description && <p className="mt-2 text-sm text-muted">{item.description}</p>}
                  {item.file_url && (
                    <div className="mt-4">
                      <PdfViewerButton url={item.file_url} title={item.title} />
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
