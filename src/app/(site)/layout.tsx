import { DemoBanner } from "@/components/site/demo-banner";
import { FloatingActions } from "@/components/site/floating-actions";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { getSiteContent } from "@/lib/data";
import { whatsappLink } from "@/lib/utils";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const { profile, demo } = await getSiteContent();
  return (
    <>
      <ScrollProgress />
      <Header name={profile.full_name} headline={profile.headline} banner={demo ? <DemoBanner /> : null} />
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <Footer profile={profile} />
      <FloatingActions whatsappHref={whatsappLink(profile.whatsapp, profile.whatsapp_message)} />
    </>
  );
}
