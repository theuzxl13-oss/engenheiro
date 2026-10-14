"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import type { z } from "zod";
import {
  certificationSchema,
  profileSchema,
  projectSchema,
  quoteUpdateSchema,
  serviceSchema,
  testimonialSchema,
} from "@/lib/admin-schemas";
import { requireAdmin } from "@/lib/auth";
import { CONTENT_TAG } from "@/lib/data";
import { isSupabaseConfigured, SUPABASE_URL } from "@/lib/env";
import { createSessionClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { fieldErrors, type FieldErrors } from "@/lib/validation";

export type ActionState = {
  ok?: boolean;
  message?: string;
  errors?: FieldErrors;
};

type Supabase = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

function parse<T extends z.ZodType>(schema: T, formData: FormData) {
  return schema.safeParse(Object.fromEntries(formData));
}

function invalid(error: z.ZodError): ActionState {
  return { ok: false, message: "Verifique os campos destacados.", errors: fieldErrors(error) };
}

function dbError(error: { message: string; code?: string }): ActionState {
  console.error("[admin]", error.message);
  if (error.code === "23505") return { ok: false, message: "Já existe um registro com este identificador (slug)." };
  return { ok: false, message: "Não foi possível salvar. Tente novamente." };
}

function done(message = "Alterações salvas."): ActionState {
  updateTag(CONTENT_TAG);
  refresh();
  return { ok: true, message };
}

/** Remove do Storage arquivos que pertencem a este projeto Supabase (melhor esforço). */
async function removeStoredFiles(supabase: Supabase, urls: (string | null | undefined)[]) {
  const prefix = `${SUPABASE_URL}/storage/v1/object/public/`;
  const byBucket = new Map<string, string[]>();
  for (const url of urls) {
    if (!url?.startsWith(prefix)) continue;
    const [bucket, ...rest] = url.slice(prefix.length).split("/");
    byBucket.set(bucket, [...(byBucket.get(bucket) ?? []), decodeURIComponent(rest.join("/"))]);
  }
  for (const [bucket, paths] of byBucket) {
    const { error } = await supabase.storage.from(bucket).remove(paths);
    if (error) console.error("[admin] Falha ao remover arquivos:", error.message);
  }
}

// -----------------------------------------------------------------------------
// Autenticação
// -----------------------------------------------------------------------------

export async function signIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!isSupabaseConfigured) return { ok: false, message: "Configure o Supabase para habilitar o painel." };
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { ok: false, message: "Informe e-mail e senha." };

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, message: "E-mail ou senha inválidos." };

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { ok: false, message: "Este usuário não possui permissão de administrador." };
  }
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// -----------------------------------------------------------------------------
// Perfil
// -----------------------------------------------------------------------------

export async function saveProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const parsed = parse(profileSchema, formData);
  if (!parsed.success) return invalid(parsed.error);
  const { error } = await supabase.from("profile").update(parsed.data).eq("id", 1);
  if (error) return dbError(error);
  return done("Perfil atualizado.");
}

// -----------------------------------------------------------------------------
// Serviços
// -----------------------------------------------------------------------------

export async function saveService(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = parse(serviceSchema, formData);
  if (!parsed.success) return invalid(parsed.error);
  const { error } = id
    ? await supabase.from("services").update(parsed.data).eq("id", id)
    : await supabase.from("services").insert(parsed.data);
  if (error) return dbError(error);
  return done(id ? "Serviço atualizado." : "Serviço cadastrado.");
}

export async function deleteService(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id"));
  const { data } = await supabase.from("services").select("image_url").eq("id", id).maybeSingle();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (!error) await removeStoredFiles(supabase, [data?.image_url]);
  done();
}

// -----------------------------------------------------------------------------
// Projetos
// -----------------------------------------------------------------------------

export async function saveProject(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = parse(projectSchema, formData);
  if (!parsed.success) return invalid(parsed.error);
  const data = { ...parsed.data, slug: parsed.data.slug || slugify(parsed.data.title) };
  if (!data.slug) return { ok: false, errors: { slug: "Informe um slug válido." } };

  if (id) {
    const { error } = await supabase.from("projects").update(data).eq("id", id);
    if (error) return dbError(error);
    return done("Projeto atualizado.");
  }

  const { data: created, error } = await supabase.from("projects").insert(data).select("id").single();
  if (error) return dbError(error);
  updateTag(CONTENT_TAG);
  redirect(`/admin/projetos/${created.id}?criado=1`);
}

export async function deleteProject(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id"));
  const { data } = await supabase.from("projects").select("cover_url, gallery").eq("id", id).maybeSingle();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (!error && data) await removeStoredFiles(supabase, [data.cover_url, ...(data.gallery ?? [])]);
  updateTag(CONTENT_TAG);
  redirect("/admin/projetos");
}

// -----------------------------------------------------------------------------
// Certificações
// -----------------------------------------------------------------------------

export async function saveCertification(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = parse(certificationSchema, formData);
  if (!parsed.success) return invalid(parsed.error);
  const { error } = id
    ? await supabase.from("certifications").update(parsed.data).eq("id", id)
    : await supabase.from("certifications").insert(parsed.data);
  if (error) return dbError(error);
  return done(id ? "Certificação atualizada." : "Certificação cadastrada.");
}

export async function deleteCertification(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id"));
  const { data } = await supabase.from("certifications").select("file_url").eq("id", id).maybeSingle();
  const { error } = await supabase.from("certifications").delete().eq("id", id);
  if (!error) await removeStoredFiles(supabase, [data?.file_url]);
  done();
}

// -----------------------------------------------------------------------------
// Depoimentos
// -----------------------------------------------------------------------------

export async function saveTestimonial(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = parse(testimonialSchema, formData);
  if (!parsed.success) return invalid(parsed.error);
  const { error } = id
    ? await supabase.from("testimonials").update(parsed.data).eq("id", id)
    : await supabase.from("testimonials").insert(parsed.data);
  if (error) return dbError(error);
  return done(id ? "Depoimento atualizado." : "Depoimento cadastrado.");
}

export async function deleteTestimonial(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id"));
  const { data } = await supabase.from("testimonials").select("photo_url").eq("id", id).maybeSingle();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (!error) await removeStoredFiles(supabase, [data?.photo_url]);
  done();
}

// -----------------------------------------------------------------------------
// Solicitações de orçamento
// -----------------------------------------------------------------------------

export async function updateQuote(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id"));
  const parsed = parse(quoteUpdateSchema, formData);
  if (!parsed.success) return invalid(parsed.error);
  const { error } = await supabase.from("quote_requests").update(parsed.data).eq("id", id);
  if (error) return dbError(error);
  refresh();
  return { ok: true, message: "Solicitação atualizada." };
}

export async function deleteQuote(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("quote_requests").delete().eq("id", String(formData.get("id")));
  refresh();
}
