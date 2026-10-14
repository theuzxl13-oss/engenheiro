"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { isSupabaseConfigured } from "@/lib/env";
import { createServiceClient } from "@/lib/supabase/service";
import { fieldErrors, quoteSchema, type FieldErrors, type QuoteInput } from "@/lib/validation";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: FieldErrors;
  demo?: boolean;
};

const MIN_FILL_TIME_MS = 3_000;
const RATE_LIMIT_WINDOW_MIN = 15;
const RATE_LIMIT_MAX = 3;

export async function submitQuote(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // 1. Antispam: campo-armadilha invisível e tempo mínimo de preenchimento.
  const honeypot = String(formData.get("website") ?? "");
  const startedAt = Number(formData.get("started_at") ?? 0);
  if (honeypot || !startedAt || Date.now() - startedAt < MIN_FILL_TIME_MS) {
    // Resposta genérica de sucesso para não dar pistas a robôs.
    return { status: "success", message: "Solicitação enviada com sucesso!" };
  }

  // 2. Validação no servidor (a validação do navegador é apenas conveniência).
  const parsed = quoteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Verifique os campos destacados.",
      errors: fieldErrors(parsed.error),
    };
  }
  const data = parsed.data;

  if (!isSupabaseConfigured) {
    return {
      status: "success",
      demo: true,
      message:
        "Modo demonstração: os dados foram validados, mas não foram armazenados. Configure o Supabase para receber solicitações reais.",
    };
  }

  const db = createServiceClient();
  if (!db) {
    console.error("[contato] SUPABASE_SERVICE_ROLE_KEY ausente.");
    return { status: "error", message: "Não foi possível enviar agora. Tente novamente mais tarde ou use o WhatsApp." };
  }

  // 3. Limite de envios por IP (armazenado apenas como hash irreversível).
  const ipHash = await hashClientIp();
  if (ipHash) {
    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MIN * 60_000).toISOString();
    const { count } = await db
      .from("quote_requests")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);
    if ((count ?? 0) >= RATE_LIMIT_MAX) {
      return {
        status: "error",
        message: "Você enviou várias solicitações em pouco tempo. Aguarde alguns minutos e tente novamente.",
      };
    }
  }

  // 4. Gravação.
  const { error } = await db.from("quote_requests").insert({
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company || null,
    service: data.service,
    message: data.message,
    consent: true,
    ip_hash: ipHash,
  });

  if (error) {
    console.error("[contato] Falha ao gravar solicitação:", error.message);
    return { status: "error", message: "Não foi possível enviar agora. Tente novamente mais tarde ou use o WhatsApp." };
  }

  await notifyByEmail(data).catch((e) => console.error("[contato] Falha ao notificar por e-mail:", e));

  return {
    status: "success",
    message: "Solicitação enviada com sucesso! Retornarei o contato o mais breve possível.",
  };
}

async function hashClientIp() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "";
  if (!ip) return null;
  const salt = process.env.RATE_LIMIT_SALT ?? "";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

/** Notificação opcional por e-mail via Resend (configure RESEND_API_KEY). */
async function notifyByEmail(data: QuoteInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_NOTIFICATION_EMAIL;
  const from = process.env.QUOTE_FROM_EMAIL;
  if (!apiKey || !to || !from) return;

  const text = [
    `Nome: ${data.name}`,
    `E-mail: ${data.email}`,
    `Telefone: ${data.phone}`,
    `Empresa: ${data.company || "-"}`,
    `Serviço: ${data.service}`,
    "",
    data.message,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: data.email,
      subject: `Nova solicitação de orçamento — ${data.service}`,
      text,
    }),
  });
  if (!res.ok) throw new Error(`Resend respondeu ${res.status}`);
}
