-- =============================================================================
-- Portfólio de Engenheiro — Esquema do banco de dados (Supabase / PostgreSQL)
-- =============================================================================
-- Execute este arquivo inteiro no SQL Editor do Supabase (ou via `supabase db push`).
-- Ele é idempotente: pode ser executado novamente sem perder dados.
--
-- Modelo de segurança:
--   * Visitantes (role `anon`) só LEEM conteúdo publicado.
--   * Somente usuários listados em `public.admin_users` podem escrever.
--   * Solicitações de orçamento são gravadas exclusivamente pelo servidor
--     (service role), após validação, antispam e limite de taxa.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Administradores
-- -----------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "admins leem a lista de administradores" on public.admin_users;
create policy "admins leem a lista de administradores"
  on public.admin_users for select
  to authenticated
  using (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- Função utilitária: atualiza `updated_at`
-- -----------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Perfil do engenheiro (linha única, id = 1)
-- -----------------------------------------------------------------------------
create table if not exists public.profile (
  id                    smallint primary key default 1 check (id = 1),
  full_name             text not null default '[Nome do Engenheiro]',
  headline              text not null default '[Especialidade de Engenharia]',
  crea                  text,
  degree                text,
  institution           text,
  graduation_year       smallint,
  years_experience      smallint check (years_experience >= 0),
  bio                   text,
  areas                 text[] not null default '{}',
  courses               text[] not null default '{}',
  photo_url             text,
  hero_image_url        text,
  cv_url                text,
  -- Indicadores: deixe NULL para ocultar (não exibir números não comprovados)
  stat_projects         integer check (stat_projects >= 0),
  stat_clients          integer check (stat_clients >= 0),
  stat_certifications   integer check (stat_certifications >= 0),
  -- Contato
  email                 text,
  phone                 text,
  whatsapp              text,  -- somente dígitos com DDI, ex.: 5511999999999
  whatsapp_message      text default 'Olá! Vim pelo seu site e gostaria de solicitar um orçamento.',
  linkedin_url          text,
  instagram_url         text,
  service_area          text,
  updated_at            timestamptz not null default now()
);

alter table public.profile enable row level security;

drop trigger if exists profile_touch on public.profile;
create trigger profile_touch before update on public.profile
  for each row execute function public.touch_updated_at();

insert into public.profile (id) values (1) on conflict (id) do nothing;

drop policy if exists "perfil é público" on public.profile;
create policy "perfil é público" on public.profile
  for select to anon, authenticated using (true);

drop policy if exists "admin atualiza perfil" on public.profile;
create policy "admin atualiza perfil" on public.profile
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Serviços / especialidades
-- -----------------------------------------------------------------------------
create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(title) between 2 and 120),
  description text not null check (char_length(description) <= 1000),
  icon        text not null default 'ClipboardCheck',
  image_url   text,
  sort_order  integer not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Projetos
-- -----------------------------------------------------------------------------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title       text not null check (char_length(title) between 2 and 160),
  category    text not null,
  location    text,
  year        smallint check (year between 1950 and 2100),
  summary     text,
  description text,
  challenges  text,
  solutions   text,
  results     text,
  cover_url   text,
  gallery     text[] not null default '{}',
  featured    boolean not null default false,
  published   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Certificações e formação
-- -----------------------------------------------------------------------------
do $$ begin
  create type public.certification_kind as enum
    ('diploma', 'certificado', 'especializacao', 'curso', 'registro', 'evento', 'outro');
exception when duplicate_object then null; end $$;

create table if not exists public.certifications (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  issuer      text,
  kind        public.certification_kind not null default 'certificado',
  year        smallint check (year between 1950 and 2100),
  description text,
  file_url    text,  -- PDF opcional
  sort_order  integer not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Depoimentos (somente reais, cadastrados pelo administrador)
-- -----------------------------------------------------------------------------
create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  client_name text not null,
  company     text,
  comment     text not null check (char_length(comment) <= 1200),
  rating      smallint check (rating between 1 and 5),
  photo_url   text,
  published   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- RLS comum para conteúdo: leitura pública do que está publicado, escrita só admin
-- -----------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['services', 'projects', 'certifications', 'testimonials'] loop
    execute format('alter table public.%I enable row level security', t);

    execute format('drop trigger if exists %I on public.%I', t || '_touch', t);
    execute format('create trigger %I before update on public.%I
                    for each row execute function public.touch_updated_at()', t || '_touch', t);

    execute format('drop policy if exists "leitura pública" on public.%I', t);
    execute format('create policy "leitura pública" on public.%I for select to anon, authenticated
                    using (published or public.is_admin())', t);

    execute format('drop policy if exists "admin insere" on public.%I', t);
    execute format('create policy "admin insere" on public.%I for insert to authenticated
                    with check (public.is_admin())', t);

    execute format('drop policy if exists "admin atualiza" on public.%I', t);
    execute format('create policy "admin atualiza" on public.%I for update to authenticated
                    using (public.is_admin()) with check (public.is_admin())', t);

    execute format('drop policy if exists "admin exclui" on public.%I', t);
    execute format('create policy "admin exclui" on public.%I for delete to authenticated
                    using (public.is_admin())', t);
  end loop;
end $$;

-- -----------------------------------------------------------------------------
-- Solicitações de orçamento (dados pessoais — LGPD)
-- -----------------------------------------------------------------------------
do $$ begin
  create type public.quote_status as enum ('novo', 'em_andamento', 'respondido', 'arquivado');
exception when duplicate_object then null; end $$;

create table if not exists public.quote_requests (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 3 and 120),
  email       text not null check (char_length(email) <= 160),
  phone       text not null check (char_length(phone) <= 30),
  company     text check (char_length(company) <= 120),
  service     text not null check (char_length(service) <= 160),
  message     text not null check (char_length(message) between 20 and 4000),
  consent     boolean not null check (consent),
  ip_hash     text,  -- hash irreversível (SHA-256 + sal) usado apenas para limitar abusos
  status      public.quote_status not null default 'novo',
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists quote_requests_created_idx on public.quote_requests (created_at desc);
create index if not exists quote_requests_ip_idx on public.quote_requests (ip_hash, created_at desc);

alter table public.quote_requests enable row level security;

drop trigger if exists quote_requests_touch on public.quote_requests;
create trigger quote_requests_touch before update on public.quote_requests
  for each row execute function public.touch_updated_at();

-- Nenhuma política para `anon`: visitantes não leem nem gravam diretamente.
-- A inserção é feita pelo servidor com a service role (que ignora RLS).
drop policy if exists "admin lê orçamentos" on public.quote_requests;
create policy "admin lê orçamentos" on public.quote_requests
  for select to authenticated using (public.is_admin());

drop policy if exists "admin atualiza orçamentos" on public.quote_requests;
create policy "admin atualiza orçamentos" on public.quote_requests
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin exclui orçamentos" on public.quote_requests;
create policy "admin exclui orçamentos" on public.quote_requests
  for delete to authenticated using (public.is_admin());

-- -----------------------------------------------------------------------------
-- Storage: imagens (media) e documentos PDF (documents), leitura pública
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('media', 'media', true, 8388608,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('documents', 'documents', true, 15728640,
    array['application/pdf'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "arquivos públicos" on storage.objects;
create policy "arquivos públicos" on storage.objects
  for select to anon, authenticated
  using (bucket_id in ('media', 'documents'));

drop policy if exists "admin envia arquivos" on storage.objects;
create policy "admin envia arquivos" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('media', 'documents') and public.is_admin());

drop policy if exists "admin altera arquivos" on storage.objects;
create policy "admin altera arquivos" on storage.objects
  for update to authenticated
  using (bucket_id in ('media', 'documents') and public.is_admin());

drop policy if exists "admin remove arquivos" on storage.objects;
create policy "admin remove arquivos" on storage.objects
  for delete to authenticated
  using (bucket_id in ('media', 'documents') and public.is_admin());

-- =============================================================================
-- Após criar seu usuário em Authentication > Users, torne-o administrador:
--
--   insert into public.admin_users (user_id)
--   select id from auth.users where email = 'seu-email@dominio.com';
-- =============================================================================
