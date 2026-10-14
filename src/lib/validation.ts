import { z } from "zod";

const phoneRegex = /^[\d\s()+-]{10,20}$/;

export const quoteSchema = z.object({
  name: z.string().trim().min(3, "Informe seu nome completo.").max(120, "Nome muito longo."),
  email: z.email("Informe um e-mail válido.").trim().max(160),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Informe um telefone válido com DDD.")
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Informe um telefone válido com DDD."),
  company: z.string().trim().max(120, "Nome da empresa muito longo.").optional().default(""),
  service: z.string().trim().min(2, "Selecione o serviço desejado.").max(160),
  message: z
    .string()
    .trim()
    .min(20, "Descreva o projeto com pelo menos 20 caracteres.")
    .max(4000, "Descrição muito longa (máx. 4000 caracteres)."),
  consent: z.literal("on", { error: "É necessário concordar com a Política de Privacidade." }),
});

export type QuoteInput = z.infer<typeof quoteSchema>;

export type FieldErrors = Partial<Record<string, string>>;

export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}
