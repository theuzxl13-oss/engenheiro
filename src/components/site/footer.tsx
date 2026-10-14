import { cacheLife } from "next/cache";
import Link from "next/link";
import type { Profile } from "@/lib/types";
import { NAV_ITEMS } from "./nav-items";
import { SocialLinks } from "./social-links";

export function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white/70">
      <div className="blueprint-grid absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-xl font-bold text-white">{profile.full_name}</p>
          <p className="mt-1 text-sm uppercase tracking-[0.18em] text-gold-500">{profile.headline}</p>
          {profile.crea && <p className="mt-4 text-sm">Registro profissional: {profile.crea}</p>}
          {profile.service_area && <p className="mt-1 text-sm">Atendimento: {profile.service_area}</p>}
          <SocialLinks profile={profile} className="mt-6 text-white" />
        </div>
        <nav aria-label="Rodapé">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">Navegação</p>
          <ul className="grid grid-cols-2 gap-2 text-sm md:grid-cols-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <Link href={item.id === "inicio" ? "/" : `/#${item.id}`} className="hover:text-gold-500">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">Informações</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/projetos" className="hover:text-gold-500">
                Todos os projetos
              </Link>
            </li>
            <li>
              <Link href="/politica-de-privacidade" className="hover:text-gold-500">
                Política de privacidade
              </Link>
            </li>
            {profile.cv_url && (
              <li>
                <a href={profile.cv_url} download className="hover:text-gold-500">
                  Currículo em PDF
                </a>
              </li>
            )}
            <li>
              <Link href="/admin" className="hover:text-gold-500" rel="nofollow">
                Área administrativa
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <p className="mx-auto max-w-7xl px-5 py-6 text-xs sm:px-8">
          © <CurrentYear /> {profile.full_name}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
