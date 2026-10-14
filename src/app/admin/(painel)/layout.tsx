import { LogOut } from "lucide-react";
import { Suspense } from "react";
import { signOut } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/admin-nav";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { requireAdmin } from "@/lib/auth";

// Painel sempre renderizado sob demanda (depende da sessão).
export const instant = false;

export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 z-20 bg-navy-900 px-4 py-4 text-white lg:h-dvh lg:py-8">
        <div className="mb-4 flex items-center justify-between gap-3 px-3 lg:mb-10 lg:block">
          <div>
            <p className="font-display text-base font-bold">Painel</p>
            <p className="text-xs text-white/50">Gerenciamento do site</p>
          </div>
          <div className="flex items-center gap-2 lg:mt-6">
            <ThemeToggle className="size-9" />
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex h-9 items-center gap-2 rounded-full border border-white/15 px-3 text-xs font-medium hover:border-gold-500 hover:text-gold-500"
              >
                <LogOut className="size-3.5" aria-hidden="true" /> Sair
              </button>
            </form>
          </div>
        </div>
        <AdminNav />
      </aside>
      <main className="min-w-0 px-5 py-8 sm:px-10 lg:py-12">
        <Suspense fallback={<p className="text-sm text-muted">Carregando…</p>}>
          <AdminGuard>{children}</AdminGuard>
        </Suspense>
      </main>
    </div>
  );
}

async function AdminGuard({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <div className="mx-auto max-w-5xl">{children}</div>;
}
