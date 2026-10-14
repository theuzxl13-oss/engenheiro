import type { MetadataRoute } from "next";
import { getSiteContent } from "@/lib/data";
import { SITE_URL } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects } = await getSiteContent();
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/projetos`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/politica-de-privacidade`, changeFrequency: "yearly", priority: 0.2 },
    ...projects.map((p) => ({
      url: `${SITE_URL}/projetos/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
