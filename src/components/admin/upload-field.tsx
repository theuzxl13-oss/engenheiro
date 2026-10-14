"use client";

import { FileText, ImagePlus, LoaderCircle, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useId, useState } from "react";
import { getBrowserClient } from "@/lib/supabase/browser";
import { isSvg } from "@/lib/utils";

type Kind = "image" | "pdf";

const ACCEPT: Record<Kind, string> = {
  image: "image/jpeg,image/png,image/webp,image/avif",
  pdf: "application/pdf",
};
const MAX_MB: Record<Kind, number> = { image: 8, pdf: 15 };

async function uploadFile(file: File, kind: Kind, folder: string) {
  if (!ACCEPT[kind].split(",").includes(file.type)) throw new Error("Formato de arquivo não permitido.");
  if (file.size > MAX_MB[kind] * 1024 * 1024) throw new Error(`Arquivo maior que ${MAX_MB[kind]} MB.`);
  const bucket = kind === "pdf" ? "documents" : "media";
  const ext = file.name.split(".").pop()?.toLowerCase() ?? (kind === "pdf" ? "pdf" : "jpg");
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const supabase = getBrowserClient();
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
  });
  if (error) throw new Error(error.message);
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

/** Envio de um único arquivo (imagem ou PDF) ao Supabase Storage. Guarda a URL em um campo oculto. */
export function UploadField({
  name,
  label,
  defaultValue,
  kind = "image",
  folder,
  error,
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  kind?: Kind;
  folder: string;
  error?: string;
  hint?: string;
}) {
  const id = useId();
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setUploadError(null);
    try {
      setUrl(await uploadFile(file, kind, folder));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Falha no envio.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className="text-sm font-medium text-fg-strong">{label}</p>
      <input type="hidden" name={name} value={url} />
      <div className="mt-1.5 flex items-center gap-4 rounded-lg border border-dashed border-line p-3">
        <div className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-md bg-bg-soft text-muted">
          {url && kind === "image" ? (
            <Image src={url} alt="" fill sizes="80px" className="object-cover" unoptimized={isSvg(url)} />
          ) : url ? (
            <FileText className="size-8 text-accent" aria-hidden="true" />
          ) : (
            <ImagePlus className="size-7" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          {url && (
            <a href={url} target="_blank" rel="noopener noreferrer" className="block truncate text-xs text-accent hover:underline">
              {url.split("/").pop()}
            </a>
          )}
          <div className="flex flex-wrap gap-2">
            <label
              htmlFor={id}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-xs font-medium text-fg-strong hover:border-accent hover:text-accent focus-within:ring-2 focus-within:ring-accent"
            >
              {busy ? <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" /> : <Upload className="size-3.5" aria-hidden="true" />}
              {busy ? "Enviando…" : url ? "Substituir" : "Enviar arquivo"}
              <input id={id} type="file" accept={ACCEPT[kind]} onChange={onChange} disabled={busy} className="sr-only" />
            </label>
            {url && (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-xs font-medium text-red-600 hover:border-red-500"
              >
                <Trash2 className="size-3.5" aria-hidden="true" /> Remover
              </button>
            )}
          </div>
        </div>
      </div>
      {(uploadError || error) && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{uploadError ?? error}</p>}
      {hint && !uploadError && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

/** Galeria: envio de várias imagens, com reordenação e remoção. Valores enviados um por linha. */
export function GalleryField({ name, defaultValue, folder }: { name: string; defaultValue?: string[]; folder: string }) {
  const id = useId();
  const [urls, setUrls] = useState<string[]>(defaultValue ?? []);
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setBusy(true);
    setUploadError(null);
    try {
      for (const file of files) {
        const url = await uploadFile(file, "image", folder);
        setUrls((prev) => [...prev, url]);
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Falha no envio.");
    } finally {
      setBusy(false);
    }
  }

  const move = (i: number, delta: number) =>
    setUrls((prev) => {
      const next = [...prev];
      const j = i + delta;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <div className="sm:col-span-2">
      <p className="text-sm font-medium text-fg-strong">Galeria de imagens</p>
      <input type="hidden" name={name} value={urls.join("\n")} />
      <ul className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {urls.map((url, i) => (
          <li key={url + i} className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-bg-soft">
            <Image src={url} alt={`Imagem ${i + 1}`} fill sizes="200px" className="object-cover" unoptimized={isSvg(url)} />
            <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-navy-950/70 p-1.5">
              <div className="flex gap-1">
                <button type="button" onClick={() => move(i, -1)} className="rounded bg-white/15 px-2 text-xs text-white" aria-label="Mover para a esquerda">
                  ←
                </button>
                <button type="button" onClick={() => move(i, 1)} className="rounded bg-white/15 px-2 text-xs text-white" aria-label="Mover para a direita">
                  →
                </button>
              </div>
              <button
                type="button"
                onClick={() => setUrls((prev) => prev.filter((_, k) => k !== i))}
                className="rounded bg-red-600 px-2 text-white"
                aria-label={`Remover imagem ${i + 1}`}
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
        <li>
          <label
            htmlFor={id}
            className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line text-xs text-muted hover:border-accent hover:text-accent focus-within:ring-2 focus-within:ring-accent"
          >
            {busy ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : <ImagePlus className="size-5" aria-hidden="true" />}
            {busy ? "Enviando…" : "Adicionar imagens"}
            <input id={id} type="file" multiple accept={ACCEPT.image} onChange={onChange} disabled={busy} className="sr-only" />
          </label>
        </li>
      </ul>
      {uploadError && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{uploadError}</p>}
    </div>
  );
}
