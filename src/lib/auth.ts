import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { isSupabaseConfigured } from "@/lib/env";
import { createSessionClient } from "@/lib/supabase/server";

/**
 * Garante que a requisição pertence a um administrador (usuário autenticado
 * presente em `admin_users`). Redireciona para o login caso contrário.
 * As políticas RLS do banco aplicam a mesma regra como segunda barreira.
 */
export const requireAdmin = cache(async () => {
  if (!isSupabaseConfigured) redirect("/admin/login");

  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) redirect("/admin/login?erro=sem-permissao");

  return { supabase, user };
});
