"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { LinkButton } from "@/components/ui/button";
import type { Profile } from "@/lib/types";
import { BlueprintArt } from "./blueprint-art";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero({ profile }: { profile: Profile }) {
  const reduce = useReducedMotion();
  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, delay, ease },
        };

  return (
    <section id="inicio" className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-navy-900 text-white">
      {profile.hero_image_url ? (
        <>
          <Image
            src={profile.hero_image_url}
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy-900/80 to-navy-900/40" />
        </>
      ) : (
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_40%,#12304d_0%,#0b1f33_45%,#061424_100%)]" />
      )}
      <div className="blueprint-grid absolute inset-0 -z-10" aria-hidden="true" />
      <div
        className="absolute -right-40 top-1/4 -z-10 size-[520px] rounded-full bg-tech-600/20 blur-[120px]"
        aria-hidden="true"
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-24 pt-32 sm:px-8 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <motion.p
            {...fade(0.1)}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-gold-300 backdrop-blur"
          >
            <span className="size-1.5 rounded-full bg-gold-500" aria-hidden="true" />
            {profile.headline}
          </motion.p>
          <motion.h1
            {...fade(0.25)}
            className="font-display text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-6xl"
          >
            Engenharia, inovação e <span className="text-gold-500">excelência</span> em cada projeto.
          </motion.h1>
          <motion.p {...fade(0.4)} className="mt-6 max-w-xl text-lg leading-relaxed text-white/70 sm:text-xl">
            Transformando desafios técnicos em soluções inteligentes, eficientes e sustentáveis.
          </motion.p>
          <motion.div {...fade(0.55)} className="mt-10 flex flex-wrap gap-4">
            <LinkButton href="/#projetos" variant="gold" className="px-7 py-3.5">
              Conheça meus projetos
              <ArrowRight className="size-4" aria-hidden="true" />
            </LinkButton>
            <LinkButton href="/#contato" variant="outline-light" className="px-7 py-3.5">
              Solicitar orçamento
            </LinkButton>
          </motion.div>
          {(profile.crea || profile.full_name) && (
            <motion.dl {...fade(0.7)} className="mt-14 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-8 text-sm">
              <div>
                <dt className="text-white/50">Responsável técnico</dt>
                <dd className="mt-1 font-semibold text-white">{profile.full_name}</dd>
              </div>
              {profile.crea && (
                <div>
                  <dt className="text-white/50">Registro profissional</dt>
                  <dd className="mt-1 font-semibold text-white">{profile.crea}</dd>
                </div>
              )}
            </motion.dl>
          )}
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease }}
          className="relative hidden lg:block"
          aria-hidden={profile.hero_image_url ? "true" : undefined}
        >
          <div className="absolute -inset-6 rounded-[2rem] border border-white/10" />
          <div className="absolute -inset-12 rounded-[2.5rem] border border-white/5" />
          <div className="relative rounded-3xl border border-white/10 bg-navy-950/40 p-6 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              <span>Prancha 01/04</span>
              <span>Escala 1:200</span>
            </div>
            <BlueprintArt className="h-auto w-full" />
          </div>
        </motion.div>
      </div>

      <a
        href="#sobre"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/50 transition-colors hover:text-gold-500 sm:flex"
      >
        Role
        <ChevronDown className="size-4 animate-bounce" aria-hidden="true" />
      </a>
    </section>
  );
}
