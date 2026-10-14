#!/usr/bin/env node
/**
 * Gera uma PRÉVIA ESTÁTICA do site (modo demonstração) para o GitHub Pages.
 *
 * O site real depende de servidor (Server Actions, painel, Supabase) e deve ser
 * publicado na Vercel. Esta prévia apenas renderiza as páginas públicas e salva
 * o HTML em `out/`, para visualização do layout.
 *
 * Uso: npm run build:pages   (gera `out/`)
 */
import { spawn, execSync } from "node:child_process";
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const repo = process.env.PAGES_REPO ?? "engenheiro";
const owner = process.env.PAGES_OWNER ?? "theuzxl13-oss";
const basePath = `/${repo}`;
const port = 3999;
const out = "out";

const env = {
  ...process.env,
  NEXT_PUBLIC_BASE_PATH: basePath,
  NEXT_PUBLIC_STATIC_PREVIEW: "1",
  NEXT_PUBLIC_SITE_URL: `https://${owner}.github.io${basePath}`,
  // A prévia sempre usa o conteúdo demonstrativo.
  NEXT_PUBLIC_SUPABASE_URL: "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
};

console.log(`→ Build com basePath ${basePath}`);
execSync("npx next build", { stdio: "inherit", env });

console.log("→ Iniciando servidor temporário");
const server = spawn("npx", ["next", "start", "-p", String(port)], { env, stdio: "ignore", detached: true });
const origin = `http://127.0.0.1:${port}${basePath}`;

try {
  for (let i = 0; ; i++) {
    try {
      if ((await fetch(`${origin}/`)).ok) break;
    } catch {}
    if (i > 100) throw new Error("Servidor não respondeu.");
    await new Promise((r) => setTimeout(r, 300));
  }

  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });

  const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
  const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.slice(basePath.length) || "/");
  pages.push("/admin/login");

  const save = async (route, file, { allow404 = false } = {}) => {
    const res = await fetch(`${origin}${route === "/" ? "" : route}`, { redirect: "manual" });
    if (!res.ok && !(allow404 && res.status === 404)) throw new Error(`${route} → ${res.status}`);
    const path = join(out, file);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, Buffer.from(await res.arrayBuffer()));
    console.log(`  ✓ ${route}`);
  };

  for (const route of pages) {
    await save(route, route === "/" ? "index.html" : `${route.slice(1)}/index.html`);
  }
  await save("/pagina-inexistente", "404.html", { allow404: true });
  for (const file of ["robots.txt", "sitemap.xml", "icon.svg"]) await save(`/${file}`, file);

  cpSync(".next/static", join(out, "_next/static"), { recursive: true });
  cpSync("public", out, { recursive: true });
  writeFileSync(join(out, ".nojekyll"), "");
  console.log(`→ Prévia gerada em ${out}/ (${pages.length} páginas)`);
} finally {
  process.kill(-server.pid);
}
