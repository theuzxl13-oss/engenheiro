"use client";

import { LoaderCircle, LogIn } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { signIn, type ActionState } from "@/app/admin/actions";
import { inputClass } from "@/components/admin/form-kit";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, {} as ActionState);
  const denied = useSearchParams().get("erro") === "sem-permissao";
  const message = state.message ?? (denied ? "Este usuário não possui permissão de administrador." : null);

  return (
    <form action={action} className="mt-8 space-y-5">
      <div>
        <label htmlFor="email" className="text-sm font-medium text-fg-strong">
          E-mail
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium text-fg-strong">
          Senha
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </div>
      {message && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-tech-600 py-3 text-sm font-semibold text-white hover:bg-tech-700 disabled:opacity-60"
      >
        {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <LogIn className="size-4" aria-hidden="true" />}
        Entrar
      </button>
    </form>
  );
}
