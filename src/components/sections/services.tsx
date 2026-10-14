import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { QuoteLink } from "@/components/ui/quote-link";
import { ServiceIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { SmartImage } from "@/components/ui/smart-image";
import type { Service } from "@/lib/types";

export function Services({ services }: { services: Service[] }) {
  if (!services.length) return null;
  return (
    <section id="servicos" className="relative scroll-mt-20 bg-bg-soft py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Serviços"
            title="Soluções completas, do estudo à entrega"
            description="Serviços prestados dentro das atribuições profissionais e com a devida responsabilidade técnica."
          />
          <Reveal>
            <Link href="/#contato" className="inline-flex items-center gap-2 font-semibold text-accent hover:underline">
              Fale sobre o seu projeto <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal
              as="li"
              key={service.id}
              delay={(i % 3) * 0.08}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-2xl hover:shadow-tech-600/10"
            >
              {service.image_url && (
                <div className="relative aspect-[16/9] overflow-hidden">
                  <SmartImage
                    src={service.image_url}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-8">
                <span className="grid size-14 place-items-center rounded-2xl bg-tech-600/10 text-accent transition-colors duration-500 group-hover:bg-tech-600 group-hover:text-white">
                  <ServiceIcon name={service.icon} className="size-6" />
                </span>
                <h3 className="mt-6 text-xl font-bold">{service.title}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-muted">{service.description}</p>
                <QuoteLink
                  service={service.title}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-fg-strong transition-colors hover:text-accent"
                  ariaLabel={`Solicitar orçamento de ${service.title}`}
                >
                  Solicitar orçamento
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </QuoteLink>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
