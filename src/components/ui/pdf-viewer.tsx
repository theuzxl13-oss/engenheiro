"use client";

import { Download, ExternalLink, FileText, X } from "lucide-react";
import { useRef } from "react";

/** Abre um PDF em uma janela modal acessível (elemento <dialog> nativo). */
export function PdfViewerButton({ url, title }: { url: string; title: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
      >
        <FileText className="size-4" aria-hidden="true" />
        Visualizar documento
      </button>
      <dialog
        ref={dialogRef}
        aria-label={title}
        onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
        className="m-auto h-[90dvh] w-[min(1000px,94vw)] max-w-none overflow-hidden rounded-2xl border border-line bg-surface p-0 text-fg backdrop:bg-navy-950/80 backdrop:backdrop-blur-sm"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
            <p className="truncate font-semibold text-fg-strong">{title}</p>
            <div className="flex items-center gap-1">
              <a href={url} target="_blank" rel="noopener noreferrer" className="grid size-9 place-items-center rounded-full hover:bg-bg-soft" aria-label="Abrir em nova aba">
                <ExternalLink className="size-4" aria-hidden="true" />
              </a>
              <a href={url} download className="grid size-9 place-items-center rounded-full hover:bg-bg-soft" aria-label="Baixar PDF">
                <Download className="size-4" aria-hidden="true" />
              </a>
              <button type="button" onClick={() => dialogRef.current?.close()} className="grid size-9 place-items-center rounded-full hover:bg-bg-soft" aria-label="Fechar">
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>
          <object data={url} type="application/pdf" className="h-full w-full flex-1 bg-bg-soft">
            <div className="grid h-full place-items-center p-8 text-center">
              <p>
                Seu navegador não exibe PDFs incorporados.{" "}
                <a href={url} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent underline">
                  Abra o documento em uma nova aba
                </a>
                .
              </p>
            </div>
          </object>
        </div>
      </dialog>
    </>
  );
}
