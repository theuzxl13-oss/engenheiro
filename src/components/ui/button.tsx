import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "gold" | "outline" | "ghost" | "outline-light";

const variants: Record<Variant, string> = {
  primary: "bg-tech-600 text-white hover:bg-tech-700 shadow-lg shadow-tech-600/20",
  gold: "bg-gold-500 text-navy-900 hover:bg-gold-300 shadow-lg shadow-gold-500/20",
  outline: "border border-line text-fg-strong hover:border-accent hover:text-accent",
  "outline-light": "border border-white/30 text-white hover:border-gold-500 hover:text-gold-300 backdrop-blur",
  ghost: "text-accent hover:bg-accent/10",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60";

export function buttonClass(variant: Variant = "primary", className?: string) {
  return cn(base, variants[variant], className);
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant };

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return <button className={buttonClass(variant, className)} {...props} />;
}

type LinkButtonProps = ComponentProps<typeof Link> & { variant?: Variant };

export function LinkButton({ variant = "primary", className, ...props }: LinkButtonProps) {
  return <Link className={buttonClass(variant, className)} {...props} />;
}
