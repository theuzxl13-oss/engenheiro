import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { demoContent } from "@/lib/demo-data";
import { isSupabaseConfigured } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/public";
import type { Certification, Profile, Project, Service, SiteContent, Testimonial } from "@/lib/types";

/** Tag usada para invalidar o cache sempre que o painel altera o conteúdo. */
export const CONTENT_TAG = "site-content";

const PROFILE_COLUMNS =
  "full_name, headline, crea, degree, institution, graduation_year, years_experience, bio, areas, courses, photo_url, hero_image_url, cv_url, stat_projects, stat_clients, stat_certifications, email, phone, whatsapp, whatsapp_message, linkedin_url, instagram_url, service_area";

/**
 * Lê todo o conteúdo público do site. O resultado é cacheado e invalidado
 * sob demanda pelas ações do painel administrativo (ver `CONTENT_TAG`).
 */
export async function getSiteContent(): Promise<SiteContent> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");

  if (!isSupabaseConfigured) return demoContent;

  const db = createPublicClient();
  const [profile, services, projects, certifications, testimonials] = await Promise.all([
    db.from("profile").select(PROFILE_COLUMNS).eq("id", 1).maybeSingle(),
    db.from("services").select("*").eq("published", true).order("sort_order").order("created_at"),
    db
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("featured", { ascending: false })
      .order("sort_order")
      .order("year", { ascending: false, nullsFirst: false }),
    db.from("certifications").select("*").eq("published", true).order("sort_order").order("year", { ascending: false }),
    db.from("testimonials").select("*").eq("published", true).order("sort_order").order("created_at"),
  ]);

  for (const result of [profile, services, projects, certifications, testimonials]) {
    if (result.error) console.error("[data] Falha ao carregar conteúdo:", result.error.message);
  }

  return {
    demo: false,
    profile: { ...emptyProfile, ...((profile.data as Partial<Profile> | null) ?? {}) },
    services: (services.data as Service[] | null) ?? [],
    projects: (projects.data as Project[] | null) ?? [],
    certifications: (certifications.data as Certification[] | null) ?? [],
    testimonials: (testimonials.data as Testimonial[] | null) ?? [],
  };
}

export async function getProjectBySlug(slug: string) {
  const { projects } = await getSiteContent();
  return projects.find((p) => p.slug === slug) ?? null;
}

const emptyProfile: Profile = {
  ...demoContent.profile,
  crea: null,
  degree: null,
  institution: null,
  bio: null,
  areas: [],
  courses: [],
  cv_url: null,
  service_area: null,
};
