import { Mail, MapPin, Phone } from "lucide-react";
import { InstagramIcon, LinkedInIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Profile } from "@/lib/types";
import { whatsappLink } from "@/lib/utils";
import { ContactForm } from "./contact-form";

export function Contact({ profile, services }: { profile: Profile; services: string[] }) {
  const wa = whatsappLink(profile.whatsapp, profile.whatsapp_message);

  const channels = [
    profile.email && { icon: Mail, label: "E-mail", value: profile.email, href: `mailto:${profile.email}` },
    profile.phone && { icon: Phone, label: "Telefone", value: profile.phone, href: `tel:${profile.phone.replace(/[^\d+]/g, "")}` },
    profile.linkedin_url && { icon: LinkedInIcon, label: "LinkedIn", value: "Ver perfil profissional", href: profile.linkedin_url },
    profile.instagram_url && { icon: InstagramIcon, label: "Instagram", value: "Acompanhe os projetos", href: profile.instagram_url },
    profile.service_area && { icon: MapPin, label: "Região de atendimento", value: profile.service_area },
  ].filter(Boolean) as { icon: React.ComponentType<{ className?: string }>; label: string; value: string; href?: string }[];

  return (
    <section id="contato" className="relative scroll-mt-20 overflow-hidden bg-navy-900 py-24 text-white sm:py-32">
      <div className="blueprint-grid absolute inset-0" aria-hidden="true" />
      <div className="absolute -left-40 bottom-0 size-[480px] rounded-full bg-tech-600/20 blur-[120px]" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeading
            invert
            eyebrow="Contato e orçamentos"
            title="Vamos conversar sobre o seu projeto?"
            description="Envie as informações iniciais e receba um retorno com os próximos passos e uma proposta adequada à sua necessidade."
          />

          {wa && (
            <Reveal delay={0.1} className="mt-10">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full bg-[#25D366] px-7 py-4 font-semibold text-white shadow-lg shadow-[#25D366]/25 transition-transform hover:scale-[1.02]"
              >
                <WhatsAppIcon className="size-5" />
                Conversar pelo WhatsApp
              </a>
            </Reveal>
          )}

          <Reveal delay={0.15}>
            <ul className="mt-10 space-y-3">
              {channels.map(({ icon: Icon, label, value, href }) => {
                const content = (
                  <>
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/15 text-gold-500">
                      <Icon className="size-5" />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-[0.16em] text-white/50">{label}</span>
                      <span className="block font-medium text-white">{value}</span>
                    </span>
                  </>
                );
                return (
                  <li key={label}>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 rounded-2xl p-2 transition-colors hover:bg-white/5"
                      >
                        {content}
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 p-2">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="text-fg">
          <ContactForm services={services} />
        </Reveal>
      </div>
    </section>
  );
}
