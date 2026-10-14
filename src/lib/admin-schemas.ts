import { z } from "zod";
import { CERTIFICATION_KINDS, QUOTE_STATUSES } from "@/lib/types";

/** Texto opcional: string vazia vira null. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Máximo de ${max} caracteres.`)
    .transform((v) => v || null);

/** URL http(s) ou caminho local ("/..."); vazio vira null. */
const optionalUrl = z
  .string()
  .trim()
  .refine((v) => !v || /^https?:\/\//i.test(v) || v.startsWith("/"), "Informe uma URL válida (https://...).")
  .transform((v) => v || null);

const optionalInt = (min: number, max: number) =>
  z
    .string()
    .trim()
    .transform((v, ctx) => {
      if (!v) return null;
      const n = Number(v);
      if (!Number.isInteger(n) || n < min || n > max) {
        ctx.addIssue({ code: "custom", message: `Informe um número inteiro entre ${min} e ${max}.` });
        return z.NEVER;
      }
      return n;
    });

/** Lista com um item por linha. */
const lines = z
  .string()
  .transform((v) =>
    v
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean),
  );

const checkbox = z
  .string()
  .optional()
  .transform((v) => v === "on" || v === "true");

export const profileSchema = z.object({
  full_name: z.string().trim().min(2, "Informe o nome.").max(120),
  headline: z.string().trim().min(2, "Informe a especialidade.").max(120),
  crea: optionalText(60),
  degree: optionalText(160),
  institution: optionalText(160),
  graduation_year: optionalInt(1950, 2100),
  years_experience: optionalInt(0, 80),
  bio: optionalText(4000),
  areas: lines,
  courses: lines,
  photo_url: optionalUrl,
  hero_image_url: optionalUrl,
  cv_url: optionalUrl,
  stat_projects: optionalInt(0, 100000),
  stat_clients: optionalInt(0, 100000),
  stat_certifications: optionalInt(0, 10000),
  email: z
    .string()
    .trim()
    .refine((v) => !v || z.email().safeParse(v).success, "E-mail inválido.")
    .transform((v) => v || null),
  phone: optionalText(30),
  whatsapp: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => !v || (v.length >= 12 && v.length <= 15), "Use DDI + DDD + número, ex.: 5511999999999.")
    .transform((v) => v || null),
  whatsapp_message: optionalText(300),
  linkedin_url: optionalUrl,
  instagram_url: optionalUrl,
  service_area: optionalText(200),
});

export const serviceSchema = z.object({
  title: z.string().trim().min(2, "Informe o nome do serviço.").max(120),
  description: z.string().trim().min(10, "Descreva o serviço.").max(1000),
  icon: z.string().trim().min(1),
  image_url: optionalUrl,
  sort_order: optionalInt(-1000, 1000).transform((v) => v ?? 0),
  published: checkbox,
});

export const projectSchema = z.object({
  title: z.string().trim().min(2, "Informe o nome do projeto.").max(160),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens.")
    .or(z.literal("")),
  category: z.string().trim().min(2, "Informe a categoria.").max(80),
  location: optionalText(160),
  year: optionalInt(1950, 2100),
  summary: optionalText(300),
  description: optionalText(8000),
  challenges: optionalText(4000),
  solutions: optionalText(4000),
  results: optionalText(4000),
  cover_url: optionalUrl,
  gallery: lines,
  featured: checkbox,
  published: checkbox,
  sort_order: optionalInt(-1000, 1000).transform((v) => v ?? 0),
});

export const certificationSchema = z.object({
  title: z.string().trim().min(2, "Informe o título.").max(200),
  issuer: optionalText(200),
  kind: z.enum(Object.keys(CERTIFICATION_KINDS) as [keyof typeof CERTIFICATION_KINDS]),
  year: optionalInt(1950, 2100),
  description: optionalText(1000),
  file_url: optionalUrl,
  sort_order: optionalInt(-1000, 1000).transform((v) => v ?? 0),
  published: checkbox,
});

export const testimonialSchema = z.object({
  client_name: z.string().trim().min(2, "Informe o nome do cliente.").max(120),
  company: optionalText(120),
  comment: z.string().trim().min(10, "Informe o depoimento.").max(1200),
  rating: optionalInt(1, 5),
  photo_url: optionalUrl,
  sort_order: optionalInt(-1000, 1000).transform((v) => v ?? 0),
  published: checkbox,
});

export const quoteUpdateSchema = z.object({
  status: z.enum(Object.keys(QUOTE_STATUSES) as [keyof typeof QUOTE_STATUSES]),
  notes: optionalText(4000),
});
