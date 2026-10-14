import { MessageSquareQuote, Quote, Star } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Testimonial } from "@/lib/types";

export function Testimonials({ items, demo }: { items: Testimonial[]; demo: boolean }) {
  // Sem depoimentos reais, a seção só aparece no modo demonstração (com aviso).
  if (!items.length && !demo) return null;

  return (
    <section id="depoimentos" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="Depoimentos" title="A palavra de quem confiou no trabalho" align="center" />
        {items.length === 0 ? (
          <div className="mx-auto mt-12 flex max-w-xl flex-col items-center rounded-3xl border border-dashed border-line p-10 text-center text-muted">
            <MessageSquareQuote className="size-10" aria-hidden="true" />
            <p className="mt-4">
              Esta seção exibirá somente depoimentos reais de clientes, cadastrados no painel administrativo. Nenhum
              depoimento é simulado. Sem depoimentos cadastrados, a seção fica oculta no site publicado.
            </p>
          </div>
        ) : (
          <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((t, i) => (
              <Reveal as="li" key={t.id} delay={(i % 3) * 0.08} className="relative flex flex-col rounded-3xl border border-line bg-surface p-8">
                <Quote className="absolute right-6 top-6 size-10 text-gold-500/25" aria-hidden="true" />
                {t.rating && (
                  <div className="flex gap-0.5" role="img" aria-label={`Avaliação: ${t.rating} de 5 estrelas`}>
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        className={s < t.rating! ? "size-4 fill-gold-500 text-gold-500" : "size-4 text-line"}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                )}
                <blockquote className="mt-5 flex-1 leading-relaxed text-fg">“{t.comment}”</blockquote>
                <div className="mt-6 flex items-center gap-3 border-t border-line pt-6">
                  {t.photo_url ? (
                    <Image src={t.photo_url} alt="" width={44} height={44} className="size-11 rounded-full object-cover" />
                  ) : (
                    <span className="grid size-11 place-items-center rounded-full bg-navy-900 font-display text-sm font-bold text-gold-500">
                      {t.client_name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span>
                    <span className="block font-semibold text-fg-strong">{t.client_name}</span>
                    {t.company && <span className="block text-sm text-muted">{t.company}</span>}
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
