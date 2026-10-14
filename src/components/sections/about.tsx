import { Award, BriefcaseBusiness, Download, GraduationCap, MapPin, ShieldCheck, UserRound } from "lucide-react";
import Image from "next/image";
import { buttonClass } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Profile } from "@/lib/types";
import { paragraphs } from "@/lib/utils";

export function About({ profile, demo }: { profile: Profile; demo: boolean }) {
  const facts = [
    { icon: ShieldCheck, label: "Registro profissional", value: profile.crea },
    {
      icon: GraduationCap,
      label: "Formação",
      value: [profile.degree, profile.institution, profile.graduation_year].filter(Boolean).join(" — ") || null,
    },
    {
      icon: BriefcaseBusiness,
      label: "Experiência",
      value: profile.years_experience != null ? `${profile.years_experience} anos de atuação` : null,
    },
    { icon: MapPin, label: "Região de atendimento", value: profile.service_area },
  ].filter((f) => f.value);

  const stats = [
    { value: profile.stat_projects, label: "Projetos realizados" },
    { value: profile.years_experience, label: "Anos de experiência" },
    { value: profile.stat_clients, label: "Clientes atendidos" },
    { value: profile.stat_certifications, label: "Certificações" },
  ].filter((s): s is { value: number; label: string } => s.value != null && s.value > 0);

  return (
    <section id="sobre" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-md self-start lg:max-w-none">
          <div className="absolute -left-4 -top-4 h-full w-full rounded-3xl border border-gold-500/40" aria-hidden="true" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-navy-800 to-navy-950">
            {profile.photo_url ? (
              <Image
                src={profile.photo_url}
                alt={`Fotografia profissional de ${profile.full_name}`}
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            ) : (
              <div className="blueprint-grid flex h-full flex-col items-center justify-center gap-4 text-white/50">
                <UserRound className="size-24 stroke-1" aria-hidden="true" />
                <p className="px-8 text-center text-sm">
                  Espaço reservado para a fotografia profissional
                  {demo ? " (envie pelo painel administrativo)" : ""}
                </p>
              </div>
            )}
          </div>
          {profile.crea && (
            <div className="absolute -bottom-6 -right-2 rounded-2xl border border-line bg-surface p-5 shadow-xl sm:-right-6">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                <Award className="size-4 text-gold-500" aria-hidden="true" />
                Registro ativo
              </p>
              <p className="mt-1 font-display font-bold text-fg-strong">{profile.crea}</p>
            </div>
          )}
        </Reveal>

        <div>
          <SectionHeading eyebrow="Sobre mim" title={profile.full_name} description={profile.headline} />

          <Reveal delay={0.1} className="mt-8 space-y-4 leading-relaxed text-fg">
            {paragraphs(profile.bio).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Reveal>

          {facts.length > 0 && (
            <Reveal delay={0.15}>
              <dl className="mt-10 grid gap-4 sm:grid-cols-2">
                {facts.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-4 rounded-2xl border border-line bg-bg-soft p-5">
                    <Icon className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">{label}</dt>
                      <dd className="mt-1 font-medium text-fg-strong">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}

          {profile.courses.length > 0 && (
            <Reveal delay={0.2} className="mt-10">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Cursos e especializações</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {profile.courses.map((c) => (
                  <li key={c} className="rounded-full border border-line px-4 py-1.5 text-sm text-fg-strong">
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {profile.cv_url && (
            <Reveal delay={0.25} className="mt-10">
              <a href={profile.cv_url} download className={buttonClass("primary")}>
                <Download className="size-4" aria-hidden="true" />
                Baixar currículo em PDF
              </a>
            </Reveal>
          )}
        </div>
      </div>

      {stats.length > 0 && (
        <div className="mx-auto mt-24 max-w-7xl px-5 sm:px-8">
          <dl className="grid grid-cols-2 overflow-hidden rounded-3xl border border-line bg-surface lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="border-line p-8 text-center odd:border-r lg:border-r lg:last:border-r-0 [&:nth-child(-n+2)]:border-b lg:[&:nth-child(-n+2)]:border-b-0">
                <dd className="font-display text-4xl font-extrabold text-fg-strong sm:text-5xl">
                  {s.value}
                  <span className="text-gold-500">+</span>
                </dd>
                <dt className="mt-2 text-sm text-muted">{s.label}</dt>
              </Reveal>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}
