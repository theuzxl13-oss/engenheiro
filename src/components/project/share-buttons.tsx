"use client";

import { Check, Link2, Share2 } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { LinkedInIcon, WhatsAppIcon } from "@/components/ui/icons";

/** Compartilhamento do projeto: API nativa, WhatsApp, LinkedIn e copiar link. */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const canNativeShare = useSyncExternalStore(
    noopSubscribe,
    () => "share" in navigator,
    () => false,
  );

  async function nativeShare() {
    try {
      await navigator.share({ title, url });
    } catch {
      // compartilhamento cancelado
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copie o link do projeto:", url);
    }
  }

  const btn =
    "grid size-10 place-items-center rounded-full border border-line text-fg-strong transition-colors hover:border-accent hover:text-accent";

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-sm font-medium text-muted">Compartilhar:</span>
      {canNativeShare && (
        <button type="button" onClick={nativeShare} className={btn} aria-label="Compartilhar">
          <Share2 className="size-4" aria-hidden="true" />
        </button>
      )}
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
        aria-label="Compartilhar no WhatsApp"
      >
        <WhatsAppIcon className="size-4" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
        aria-label="Compartilhar no LinkedIn"
      >
        <LinkedInIcon className="size-4" />
      </a>
      <button type="button" onClick={copy} className={btn} aria-label={copied ? "Link copiado" : "Copiar link"}>
        {copied ? <Check className="size-4 text-emerald-500" aria-hidden="true" /> : <Link2 className="size-4" aria-hidden="true" />}
      </button>
      <span role="status" className="sr-only">
        {copied ? "Link copiado para a área de transferência" : ""}
      </span>
    </div>
  );
}

const noopSubscribe = () => () => {};
