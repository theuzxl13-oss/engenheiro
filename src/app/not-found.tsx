import { Compass } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-navy-900 px-5 text-center text-white">
      <div className="blueprint-grid absolute inset-0" aria-hidden="true" />
      <div className="relative">
        <Compass className="mx-auto size-14 text-gold-500" aria-hidden="true" />
        <p className="mt-6 font-mono text-sm tracking-[0.3em] text-gold-300">ERRO 404</p>
        <h1 className="mt-3 text-4xl font-extrabold text-white">Página não encontrada</h1>
        <p className="mt-4 text-white/70">O endereço acessado não existe ou foi removido.</p>
        <LinkButton href="/" variant="gold" className="mt-8">
          Voltar ao início
        </LinkButton>
      </div>
    </main>
  );
}
