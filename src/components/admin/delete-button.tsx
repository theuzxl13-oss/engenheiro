"use client";

import { LoaderCircle, Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

function Inner({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:border-red-500 hover:bg-red-50 disabled:opacity-60 dark:hover:bg-red-950/30"
    >
      {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Trash2 className="size-4" aria-hidden="true" />}
      {label}
    </button>
  );
}

/** Exclusão com confirmação. */
export function DeleteButton({
  action,
  id,
  label = "Excluir",
  confirmMessage = "Tem certeza que deseja excluir? Esta ação não pode ser desfeita.",
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  label?: string;
  confirmMessage?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Inner label={label} />
    </form>
  );
}
