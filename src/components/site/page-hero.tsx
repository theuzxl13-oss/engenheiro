import Link from "next/link";

export function PageHero({ title, crumb, children }: { title: string; crumb: string; children?: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden bg-navy-900 pb-16 pt-36 text-white">
      <div className="blueprint-grid absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <nav aria-label="Trilha de navegação" className="text-sm text-white/60">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-gold-500">
                Início
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-gold-300">
              {crumb}
            </li>
          </ol>
        </nav>
        <h1 className="mt-5 max-w-4xl text-4xl font-extrabold text-white sm:text-5xl">{title}</h1>
        {children}
      </div>
    </div>
  );
}
