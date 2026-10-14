import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  invert?: boolean;
};

export function SectionHeading({ eyebrow, title, description, align = "left", invert }: Props) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <p
        className={cn(
          "mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold-600 dark:text-gold-500",
          align === "center" && "justify-center",
          invert && "text-gold-500",
        )}
      >
        <span className="h-px w-8 bg-current" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 className={cn("text-3xl font-bold leading-tight sm:text-4xl", invert && "text-white")}>{title}</h2>
      {description && (
        <p className={cn("mt-5 text-lg leading-relaxed text-muted", invert && "text-white/70")}>{description}</p>
      )}
    </Reveal>
  );
}
