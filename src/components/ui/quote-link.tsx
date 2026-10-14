"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export const QUOTE_SERVICE_EVENT = "quote:service";

/** Link para o formulário de orçamento que já pré-seleciona o serviço desejado. */
export function QuoteLink({
  service,
  className,
  children,
  ariaLabel,
}: {
  service: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <Link
      href={`/?servico=${encodeURIComponent(service)}#contato`}
      scroll={false}
      className={className}
      aria-label={ariaLabel}
      onClick={() => {
        window.dispatchEvent(new CustomEvent(QUOTE_SERVICE_EVENT, { detail: service }));
        requestAnimationFrame(() => document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" }));
      }}
    >
      {children}
    </Link>
  );
}
