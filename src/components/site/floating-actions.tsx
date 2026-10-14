"use client";

import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/ui/icons";

/** Botão flutuante de WhatsApp e botão "voltar ao topo". */
export function FloatingActions({ whatsappHref }: { whatsappHref: string | null }) {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Voltar ao topo"
            className="grid size-11 place-items-center rounded-full border border-line bg-surface text-fg-strong shadow-lg transition-colors hover:border-gold-500 hover:text-gold-600"
          >
            <ArrowUp className="size-5" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>
      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Conversar pelo WhatsApp"
          className="group relative grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/30 transition-transform hover:scale-105"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-20" aria-hidden="true" />
          <WhatsAppIcon className="relative size-7" />
        </a>
      )}
    </div>
  );
}
