"use client";

import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SmartImage } from "@/components/ui/smart-image";

/** Galeria com miniaturas e visualização ampliada (lightbox) navegável por teclado. */
export function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const step = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!dialogRef.current?.open) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  if (!images.length) return null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((src, i) => (
          <li key={src + i}>
            <button
              type="button"
              onClick={() => open(i)}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-navy-900"
              aria-label={`Ampliar imagem ${i + 1} de ${images.length}`}
            >
              <SmartImage
                src={src}
                alt={`${title} — imagem ${i + 1}`}
                fill
                sizes="(min-width: 768px) 33vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 grid place-items-center bg-navy-950/0 text-white opacity-0 transition-all group-hover:bg-navy-950/40 group-hover:opacity-100">
                <Expand className="size-6" aria-hidden="true" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setIndex(null)}
        aria-label={`Galeria: ${title}`}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-navy-950/95 p-0 backdrop:bg-navy-950/90"
      >
        {index !== null && (
          <div className="relative flex h-full items-center justify-center p-4 sm:p-12">
            <div className="relative h-full w-full">
              <SmartImage src={images[index]} alt={`${title} — imagem ${index + 1}`} fill sizes="100vw" className="object-contain" />
            </div>
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-4 py-1 text-sm text-white">
              {index + 1} / {images.length}
            </p>
            <button type="button" onClick={close} className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Fechar galeria">
              <X className="size-6" aria-hidden="true" />
            </button>
            {images.length > 1 && (
              <>
                <button type="button" onClick={() => step(-1)} className="absolute left-4 grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Imagem anterior">
                  <ChevronLeft className="size-6" aria-hidden="true" />
                </button>
                <button type="button" onClick={() => step(1)} className="absolute right-4 grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Próxima imagem">
                  <ChevronRight className="size-6" aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
