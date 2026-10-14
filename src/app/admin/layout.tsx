import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Painel administrativo", template: "%s | Painel administrativo" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-dvh bg-bg-soft">{children}</div>;
}
