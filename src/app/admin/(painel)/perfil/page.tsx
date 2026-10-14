import { ProfileForm } from "@/components/admin/forms";
import { AdminPageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth";
import type { Profile } from "@/lib/types";

export const metadata = { title: "Perfil" };

export default async function ProfilePage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("profile").select("*").eq("id", 1).single();
  return (
    <>
      <AdminPageHeader
        title="Perfil e contato"
        description="Informações pessoais, formação, indicadores, redes sociais, fotografia e currículo."
      />
      <ProfileForm profile={data as Profile} />
    </>
  );
}
