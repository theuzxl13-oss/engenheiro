"use client";

import { CheckCircle2, LoaderCircle, Save, TriangleAlert } from "lucide-react";
import { startTransition, useActionState, type ReactNode } from "react";
import type { ActionState } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

type Action = (prev: ActionState, formData: FormData) => Promise<ActionState>;

export const inputClass =
  "mt-1.5 w-full rounded-lg border border-line bg-bg px-3.5 py-2.5 text-sm text-fg-strong outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10 aria-[invalid=true]:border-red-500";

/** Formulário administrativo com feedback de sucesso/erro e erros por campo. */
export function AdminForm({
  action,
  children,
  submitLabel = "Salvar",
  className,
  resetOnSuccess,
}: {
  action: Action;
  children: (errors: Record<string, string | undefined>) => ReactNode;
  submitLabel?: string;
  className?: string;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    async (prev: ActionState & { saves: number }, formData: FormData) => {
      const result = await action(prev, formData);
      return { ...result, saves: prev.saves + (result.ok ? 1 : 0) };
    },
    { saves: 0 },
  );
  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        // Evita o reset automático do formulário: mantém os dados em caso de erro.
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => formAction(formData));
      }}
      className={cn("space-y-5", className)}
      key={resetOnSuccess ? state.saves : undefined}
    >
      {children(state.errors ?? {})}
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <SubmitButton label={submitLabel} pending={pending} />
        {state.message && (
          <p
            role={state.ok ? "status" : "alert"}
            className={cn(
              "inline-flex items-center gap-2 text-sm",
              state.ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
            )}
          >
            {state.ok ? <CheckCircle2 className="size-4" aria-hidden="true" /> : <TriangleAlert className="size-4" aria-hidden="true" />}
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}

export function SubmitButton({ label, pending }: { label: string; pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-tech-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-tech-700 disabled:opacity-60"
    >
      {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
      {pending ? "Salvando…" : label}
    </button>
  );
}

type FieldProps = {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  className?: string;
};

function FieldShell({ label, name, error, hint, className, children }: FieldProps & { children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={`f-${name}`} className="text-sm font-medium text-fg-strong">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && (
        <p id={`f-${name}-error`} className="mt-1 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({
  defaultValue,
  type = "text",
  required,
  placeholder,
  ...field
}: FieldProps & { defaultValue?: string | number | null; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <FieldShell {...field}>
      <input
        id={`f-${field.name}`}
        name={field.name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        aria-invalid={Boolean(field.error)}
        aria-describedby={field.error ? `f-${field.name}-error` : undefined}
        className={inputClass}
      />
    </FieldShell>
  );
}

export function TextArea({
  defaultValue,
  rows = 4,
  placeholder,
  ...field
}: FieldProps & { defaultValue?: string | null; rows?: number; placeholder?: string }) {
  return (
    <FieldShell {...field}>
      <textarea
        id={`f-${field.name}`}
        name={field.name}
        rows={rows}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        aria-invalid={Boolean(field.error)}
        aria-describedby={field.error ? `f-${field.name}-error` : undefined}
        className={cn(inputClass, "resize-y")}
      />
    </FieldShell>
  );
}

export function SelectField({
  defaultValue,
  options,
  ...field
}: FieldProps & { defaultValue?: string; options: { value: string; label: string }[] }) {
  return (
    <FieldShell {...field}>
      <select id={`f-${field.name}`} name={field.name} defaultValue={defaultValue} className={inputClass}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function Checkbox({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="inline-flex items-center gap-2.5 text-sm text-fg-strong">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-4 accent-tech-600" />
      {label}
    </label>
  );
}

export function Fieldset({ legend, children, description }: { legend: string; description?: string; children: ReactNode }) {
  return (
    <fieldset className="rounded-2xl border border-line bg-surface p-6">
      <legend className="px-2 font-display text-sm font-bold uppercase tracking-[0.14em] text-fg-strong">{legend}</legend>
      {description && <p className="-mt-1 mb-4 text-sm text-muted">{description}</p>}
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}
