# Portfólio de Engenheiro

Site portfólio profissional para engenheiros: apresentação, especialidades, serviços, portfólio de projetos, certificações, depoimentos, formulário de orçamento e **painel administrativo** completo.

Construído com **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion · Lucide · Supabase (PostgreSQL, Auth, Storage)**, pronto para publicação na **Vercel**.

> **Modo demonstração:** sem as variáveis do Supabase o site funciona com conteúdo demonstrativo, claramente identificado (faixa no topo, textos entre colchetes, imagens marcadas como "IMAGEM DEMONSTRATIVA"). Nenhum depoimento, indicador numérico ou dado profissional é inventado.

---

## Arquitetura

```
src/
├── app/
│   ├── (site)/                    # Site público (layout com menu, rodapé, botões flutuantes)
│   │   ├── page.tsx               # Home: hero, sobre, especialidades, serviços, projetos,
│   │   │                          #       certificações, depoimentos, contato
│   │   ├── projetos/              # Lista com filtros + página individual /projetos/[slug]
│   │   └── politica-de-privacidade/
│   ├── admin/
│   │   ├── login/                 # Autenticação (Supabase Auth)
│   │   ├── (painel)/              # Painel protegido: visão geral, orçamentos, perfil,
│   │   │                          # serviços, projetos, certificações, depoimentos
│   │   └── actions.ts             # Server Actions administrativas (validação + RLS)
│   ├── actions/contact.ts         # Envio do formulário (validação, antispam, limite de taxa)
│   ├── sitemap.ts · robots.ts · opengraph-image.tsx · icon.svg · not-found.tsx
│   └── layout.tsx                 # Fontes, metadados, tema sem "piscar"
├── components/
│   ├── sections/                  # Seções da home
│   ├── site/                      # Header, footer, tema, progresso, WhatsApp, voltar ao topo
│   ├── project/                   # Galeria (lightbox) e compartilhamento
│   ├── admin/                     # Formulários, upload para o Storage, navegação
│   └── ui/                        # Botões, animações, ícones, visualizador de PDF
├── lib/
│   ├── data.ts                    # Leitura do conteúdo público (cacheada, "use cache")
│   ├── demo-data.ts               # Conteúdo demonstrativo
│   ├── auth.ts                    # requireAdmin()
│   ├── validation.ts / admin-schemas.ts   # Esquemas Zod
│   └── supabase/                  # Clientes: público, sessão, navegador, service role
└── proxy.ts                       # Renova a sessão e protege /admin
supabase/schema.sql                # Tabelas, RLS, Storage e políticas
scripts/build-pages.mjs            # Prévia estática para o GitHub Pages
```

### Segurança

- **RLS em todas as tabelas.** Visitantes leem apenas conteúdo publicado; escrita somente para usuários cadastrados em `admin_users` (função `is_admin()`).
- O painel é verificado em três camadas: `proxy.ts` (sessão), `requireAdmin()` no servidor e RLS no banco.
- Solicitações de orçamento são gravadas **somente pelo servidor** com a service role (`SUPABASE_SERVICE_ROLE_KEY`, nunca exposta ao navegador), após validação Zod, campo-armadilha (honeypot), tempo mínimo de preenchimento e limite de 3 envios / 15 min por IP (armazenado como hash SHA-256 com sal).
- Storage com buckets públicos de leitura (`media` para imagens, `documents` para PDFs), envio restrito a administradores, tipos e tamanhos limitados.
- Cabeçalhos de segurança (HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`).

### Cache

O conteúdo público é lido por `getSiteContent()` com `"use cache"` e a tag `site-content`. Cada alteração no painel chama `updateTag()`, então o site reflete as mudanças imediatamente, mantendo as páginas pré-renderizadas e rápidas.

---

## Executar localmente

Pré-requisitos: Node.js 20.9+ e npm.

```bash
npm install
cp .env.example .env.local   # opcional: sem Supabase roda em modo demonstração
npm run dev                  # http://localhost:3000
```

Scripts úteis:

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` / `npm start` | Build e servidor de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | Verificação TypeScript |
| `npm run build:pages` | Gera a prévia estática em `out/` (GitHub Pages) |

---

## Configurar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **SQL Editor**, execute todo o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) (cria tabelas, políticas RLS e buckets do Storage).
3. Em **Authentication → Users**, crie o usuário do engenheiro (e-mail e senha). Em **Authentication → Sign In / Providers**, desative o cadastro público (*Allow new users to sign up*).
4. Torne esse usuário administrador:
   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'seu-email@dominio.com';
   ```
5. Em **Project Settings → API**, copie a URL, a `anon key` e a `service_role key` para o `.env.local`:

| Variável | Uso |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL pública do site (SEO, Open Graph, sitemap) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública (protegida pelas políticas RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Somente servidor** — gravação dos orçamentos |
| `RATE_LIMIT_SALT` | Sal para anonimizar IPs (`openssl rand -hex 32`) |
| `RESEND_API_KEY`, `QUOTE_NOTIFICATION_EMAIL`, `QUOTE_FROM_EMAIL` | Opcional: aviso por e-mail de novos orçamentos via [Resend](https://resend.com) |

6. Acesse `/admin`, entre com o usuário criado e preencha **Perfil e contato**, serviços, projetos, certificações e depoimentos. O modo demonstração desaparece assim que o Supabase é configurado.

---

## Publicar na Vercel

1. Envie o repositório ao GitHub.
2. Na Vercel, **Add New → Project** e importe o repositório (framework detectado automaticamente).
3. Cadastre as variáveis de ambiente acima em **Settings → Environment Variables** (`NEXT_PUBLIC_SITE_URL` com o domínio final).
4. Faça o deploy. HTTPS é automático na Vercel; para domínio próprio use **Settings → Domains**.

---

## Prévia no GitHub Pages

O GitHub Pages hospeda apenas arquivos estáticos, por isso ele exibe uma **prévia do modo demonstração**: todas as páginas públicas, animações, tema claro/escuro, filtros, galeria e visualização de PDFs. O formulário apenas valida os dados (não há servidor para enviá-los) e o painel administrativo não funciona — use a Vercel para o site real.

- O workflow [`.github/workflows/github-pages.yml`](.github/workflows/github-pages.yml) gera a prévia (`npm run build:pages`) e publica no branch `gh-pages`.
- Ative em **Settings → Pages → Build and deployment → Source: Deploy from a branch → `gh-pages` / `(root)`**.
- Endereço: `https://<usuario>.github.io/<repositorio>/`.

---

## Personalização

- **Cores e fontes:** `src/app/globals.css` (tokens `navy`, `tech`, `gold`, temas claro/escuro) e `src/app/layout.tsx` (Inter + Montserrat).
- **Ícones dos serviços:** `src/components/ui/icons.tsx` e `src/components/admin/icon-names.ts`.
- **Conteúdo demonstrativo:** `src/lib/demo-data.ts`.
- **Política de privacidade:** `src/app/(site)/politica-de-privacidade/page.tsx` — revise com um profissional jurídico antes de publicar.
