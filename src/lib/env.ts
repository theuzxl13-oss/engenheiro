export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** O site funciona em modo demonstração enquanto o Supabase não estiver configurado. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

/** Prefixo de caminho (ex.: "/engenheiro" na prévia do GitHub Pages). Vazio na Vercel. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Prévia estática (GitHub Pages): não há servidor, então o formulário
 * apenas valida os dados no navegador, sem enviá-los.
 */
export const isStaticPreview = process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1";
