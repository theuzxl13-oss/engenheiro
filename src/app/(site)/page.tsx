import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { Certifications } from "@/components/sections/certifications";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Services } from "@/components/sections/services";
import { Specialties } from "@/components/sections/specialties";
import { Testimonials } from "@/components/sections/testimonials";
import { getSiteContent } from "@/lib/data";
import { SITE_URL } from "@/lib/env";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getSiteContent();
  const title = `${profile.full_name} — ${profile.headline}`;
  return {
    title: { absolute: title },
    openGraph: { title, url: "/" },
  };
}

export default async function HomePage() {
  const { profile, services, projects, certifications, testimonials, demo } = await getSiteContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: profile.full_name,
    description: profile.headline,
    url: SITE_URL,
    ...(profile.email && { email: profile.email }),
    ...(profile.phone && { telephone: profile.phone }),
    ...(profile.service_area && { areaServed: profile.service_area }),
    ...(profile.photo_url && { image: profile.photo_url }),
    sameAs: [profile.linkedin_url, profile.instagram_url].filter(Boolean),
  };

  return (
    <>
      {!demo && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      )}
      <Hero profile={profile} />
      <About profile={profile} demo={demo} />
      <Specialties areas={profile.areas} />
      <Services services={services} />
      <Projects projects={projects} />
      <Certifications items={certifications} />
      <Testimonials items={testimonials} demo={demo} />
      <Contact profile={profile} services={services.map((s) => s.title)} />
    </>
  );
}
