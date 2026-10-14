import { Suspense } from "react";
import { isSupabaseConfigured } from "@/lib/env";
import { LoginForm } from "./login-form";

export const metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-navy-900 px-5 py-16">
      <div className="blueprint-grid absolute inset-0" aria-hidden="true" />
      <div className="relative w-full max-w-md rounded-3xl border border-line bg-surface p-8 shadow-2xl sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600 dark:text-gold-500">Área restrita</p>
        <h1 className="mt-2 text-2xl font-bold">Painel administrativo</h1>
        {isSupabaseConfigured ? (
          <Suspense>
            <LoginForm />
          </Suspense>
        ) : (
          <div className="mt-6 space-y-3 text-sm text-fg">
            <p className="rounded-xl bg-gold-500/15 p-4 text-fg-strong">
              O site está em <strong>modo demonstração</strong>. Para habilitar o painel:
            </p>
            <ol className="list-decimal space-y-2 pl-5">
              <li>Crie um projeto no Supabase e execute <code>supabase/schema.sql</code>.</li>
              <li>
                Configure <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> e{" "}
                <code>SUPABASE_SERVICE_ROLE_KEY</code>.
              </li>
              <li>Crie seu usuário em Authentication e cadastre-o em <code>admin_users</code>.</li>
            </ol>
            <p>As instruções completas estão no arquivo README.md.</p>
          </div>
        )}
      </div>
    </main>
  );
}
