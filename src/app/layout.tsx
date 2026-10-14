import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import { SITE_URL } from "@/lib/env";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Engenharia, inovação e excelência em cada projeto",
    template: "%s | Portfólio de Engenharia",
  },
  description:
    "Transformando desafios técnicos em soluções inteligentes, eficientes e sustentáveis. Projetos, consultoria, laudos e acompanhamento técnico.",
  openGraph: { type: "website", locale: "pt_BR", siteName: "Portfólio de Engenharia" },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1f33" },
  ],
};

/** Aplica o tema salvo antes da primeira pintura (evita "piscar"). */
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${inter.variable} ${montserrat.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
