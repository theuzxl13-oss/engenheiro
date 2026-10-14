import { Mail } from "lucide-react";
import { InstagramIcon, LinkedInIcon, WhatsAppIcon } from "@/components/ui/icons";
import type { Profile } from "@/lib/types";
import { cn, whatsappLink } from "@/lib/utils";

export function SocialLinks({ profile, className }: { profile: Profile; className?: string }) {
  const links = [
    profile.linkedin_url && { href: profile.linkedin_url, label: "LinkedIn", Icon: LinkedInIcon },
    profile.instagram_url && { href: profile.instagram_url, label: "Instagram", Icon: InstagramIcon },
    whatsappLink(profile.whatsapp, profile.whatsapp_message) && {
      href: whatsappLink(profile.whatsapp, profile.whatsapp_message)!,
      label: "WhatsApp",
      Icon: WhatsAppIcon,
    },
    profile.email && { href: `mailto:${profile.email}`, label: "E-mail", Icon: Mail },
  ].filter(Boolean) as { href: string; label: string; Icon: React.ComponentType<{ className?: string }> }[];

  if (!links.length) return null;

  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {links.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            aria-label={label}
            className="grid size-10 place-items-center rounded-full border border-current/15 transition-colors hover:border-gold-500 hover:text-gold-500"
          >
            <Icon className="size-[18px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
