"use client";

import { CheckCircle2, LoaderCircle, Send } from "lucide-react";
import Link from "next/link";
import { cloneElement, startTransition, useActionState, useEffect, useRef, useState } from "react";
import { submitQuote, type ContactState } from "@/app/actions/contact";
import { QUOTE_SERVICE_EVENT } from "@/components/ui/quote-link";
import { isStaticPreview } from "@/lib/env";
import { cn } from "@/lib/utils";
import { fieldErrors, quoteSchema, type FieldErrors } from "@/lib/validation";

const initialState: ContactState = { status: "idle" };
const OTHER = "Outro / não sei informar";

function maskPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function ContactForm({ services }: { services: string[] }) {
  const [state, formAction, pending] = useActionState(submitQuote, initialState);
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const [phone, setPhone] = useState("");
  const [previewSent, setPreviewSent] = useState(false);
  const startedAt = useRef(0);
  const startedInput = useRef<HTMLInputElement>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const options = [...services, OTHER];

  // Pré-seleciona o serviço vindo de um card ("Solicitar orçamento") ou da URL.
  useEffect(() => {
    const select = (value: string | null) => {
      if (value && serviceRef.current) serviceRef.current.value = value;
    };
    select(new URLSearchParams(window.location.search).get("servico"));
    const onSelect = (e: Event) => select((e as CustomEvent<string>).detail);
    window.addEventListener(QUOTE_SERVICE_EVENT, onSelect);
    return () => window.removeEventListener(QUOTE_SERVICE_EVENT, onSelect);
  }, []);

  const errors = { ...state.errors, ...clientErrors };

  // Envio controlado: valida no navegador e chama a Server Action sem limpar
  // o formulário em caso de erro (a validação definitiva ocorre no servidor).
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (startedInput.current) startedInput.current.value = String(startedAt.current);
    const formData = new FormData(e.currentTarget);
    const result = quoteSchema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      const errs = fieldErrors(result.error);
      setClientErrors(errs);
      const first = Object.keys(errs)[0];
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setClientErrors({});
    if (isStaticPreview) {
      setPreviewSent(true);
      return;
    }
    startTransition(() => formAction(formData));
  }

  if (previewSent) {
    return (
      <div role="status" className="flex flex-col items-center rounded-3xl border border-line bg-surface p-10 text-center">
        <CheckCircle2 className="size-14 text-emerald-500" aria-hidden="true" />
        <h3 className="mt-5 text-2xl font-bold">Dados validados</h3>
        <p className="mt-3 max-w-md text-muted">
          Esta é uma prévia estática (GitHub Pages) e não possui servidor: a mensagem não foi enviada. Na versão publicada
          na Vercel com Supabase, a solicitação é gravada e aparece no painel administrativo.
        </p>
      </div>
    );
  }

  if (state.status === "success") {
    return (
      <div role="status" className="flex flex-col items-center rounded-3xl border border-line bg-surface p-10 text-center">
        <CheckCircle2 className="size-14 text-emerald-500" aria-hidden="true" />
        <h3 className="mt-5 text-2xl font-bold">Obrigado pelo contato!</h3>
        <p className="mt-3 max-w-md text-muted">{state.message}</p>
        <button type="button" onClick={() => window.location.reload()} className="mt-8 text-sm font-semibold text-accent hover:underline">
          Enviar outra solicitação
        </button>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      onFocusCapture={() => {
        startedAt.current ||= Date.now();
      }}
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-line bg-surface p-6 shadow-xl shadow-navy-900/5 sm:p-10"
      aria-describedby={state.status === "error" ? "form-status" : undefined}
    >
      {/* Antispam: campo invisível para humanos e carimbo de tempo */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Não preencha este campo
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input ref={startedInput} type="hidden" name="started_at" defaultValue="0" />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nome completo" name="name" error={errors.name} required>
          <input name="name" autoComplete="name" maxLength={120} className={inputClass(errors.name)} />
        </Field>
        <Field label="E-mail" name="email" error={errors.email} required>
          <input name="email" type="email" autoComplete="email" maxLength={160} className={inputClass(errors.email)} />
        </Field>
        <Field label="Telefone / WhatsApp" name="phone" error={errors.phone} required>
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(00) 00000-0000"
            value={phone}
            onChange={(e) => setPhone(maskPhone(e.target.value))}
            className={inputClass(errors.phone)}
          />
        </Field>
        <Field label="Empresa" name="company" error={errors.company} hint="opcional">
          <input name="company" autoComplete="organization" maxLength={120} className={inputClass(errors.company)} />
        </Field>
        <Field label="Serviço desejado" name="service" error={errors.service} required className="sm:col-span-2">
          <select ref={serviceRef} name="service" defaultValue="" className={inputClass(errors.service)}>
            <option value="">Selecione…</option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Descrição do projeto" name="message" error={errors.message} required className="sm:col-span-2">
          <textarea
            name="message"
            rows={5}
            maxLength={4000}
            placeholder="Conte brevemente o que precisa, local, prazos e informações relevantes."
            className={cn(inputClass(errors.message), "resize-y")}
          />
        </Field>
      </div>

      <div className="mt-6">
        <label className="flex items-start gap-3 text-sm text-muted">
          <input
            type="checkbox"
            name="consent"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="mt-0.5 size-4 shrink-0 accent-tech-600"
          />
          <span>
            Concordo com o tratamento dos meus dados para retorno desta solicitação, conforme a{" "}
            <Link href="/politica-de-privacidade" className="font-medium text-accent underline" target="_blank">
              Política de Privacidade
            </Link>
            .
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" className="mt-2 text-sm text-red-600 dark:text-red-400">
            {errors.consent}
          </p>
        )}
      </div>

      {state.status === "error" && state.message && (
        <p id="form-status" role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-tech-600 px-6 py-4 font-semibold text-white shadow-lg shadow-tech-600/20 transition-colors hover:bg-tech-700 disabled:opacity-60 sm:w-auto"
      >
        {pending ? (
          <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="size-4" aria-hidden="true" />
        )}
        {pending ? "Enviando…" : "Enviar solicitação"}
      </button>
    </form>
  );
}

function inputClass(error?: string) {
  return cn(
    "mt-2 w-full rounded-xl border bg-bg px-4 py-3 text-fg-strong outline-none transition-colors placeholder:text-muted/60 focus:border-accent focus:ring-4 focus:ring-accent/10",
    error ? "border-red-500" : "border-line",
  );
}

function Field({
  label,
  name,
  error,
  required,
  hint,
  className,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactElement<{ id?: string; "aria-invalid"?: boolean; "aria-describedby"?: string; "aria-required"?: boolean }>;
}) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;
  const child = cloneElement(children, {
    id,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? errorId : undefined,
    "aria-required": required,
  });
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-medium text-fg-strong">
        {label}
        {required && <span className="text-red-500"> *</span>}
        {hint && <span className="font-normal text-muted"> ({hint})</span>}
      </label>
      {child}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
