import { NextResponse } from "next/server";

export const runtime = "edge";

type OnboardingPayload = {
  razonSocial?: string;
  cuit?: string;
  actividad?: string;
  responsable?: string;
  telefono?: string;
  email?: string;
  empleados?: string;
  facturacion?: string;
  principalProblema?: string;
  driveLink?: string;
  preferenciaAccesos?: string;
  observaciones?: string;
};

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
  process.env.WHATSAPP_NUMBER ||
  "5492615257574";

const GOOGLE_SHEETS_WEBHOOK_URL =
  process.env.LEAD_WEBHOOK_URL ||
  process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
  "";

const GOOGLE_SHEETS_WEBHOOK_SECRET =
  process.env.LEAD_WEBHOOK_SECRET ||
  process.env.GOOGLE_SHEETS_WEBHOOK_SECRET ||
  "lujan_finanzas_secret_2026";

function safeString(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function normalizePhone(value: string): string {
  return value.replace(/[^\d]/g, "");
}

function buildWhatsappUrl(phone: string, message: string): string {
  const cleanPhone = normalizePhone(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

function cleanPayload(payload: OnboardingPayload) {
  return {
    id: `onb_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
    razonSocial: safeString(payload.razonSocial, 160),
    cuit: safeString(payload.cuit, 40),
    actividad: safeString(payload.actividad, 160),
    responsable: safeString(payload.responsable, 120),
    telefono: normalizePhone(safeString(payload.telefono, 60)),
    email: safeString(payload.email, 160).toLowerCase(),
    empleados: safeString(payload.empleados, 80),
    facturacion: safeString(payload.facturacion, 120),
    principalProblema: safeString(payload.principalProblema, 1000),
    driveLink: safeString(payload.driveLink, 500),
    preferenciaAccesos: safeString(payload.preferenciaAccesos, 160),
    observaciones: safeString(payload.observaciones, 1200)
  };
}

export async function POST(request: Request) {
  try {
    const rawPayload = (await request.json()) as OnboardingPayload;
    const onboarding = cleanPayload(rawPayload);

    if (!onboarding.razonSocial || !onboarding.cuit) {
      return NextResponse.json(
        {
          ok: false,
          error: "Faltan razón social y CUIT."
        },
        { status: 400 }
      );
    }

    if (GOOGLE_SHEETS_WEBHOOK_URL) {
      const response = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          secret: GOOGLE_SHEETS_WEBHOOK_SECRET,
          event: "onboarding.submit",
          version: "lf360-onboarding-v1",
          onboarding
        })
      });

      if (!response.ok) {
        throw new Error(`Sheets webhook error: ${response.status}`);
      }
    }

    const message =
      `Hola Ramiro, completé el onboarding LF360. ` +
      `Empresa: ${onboarding.razonSocial}. ` +
      `CUIT: ${onboarding.cuit}. ` +
      `Actividad: ${onboarding.actividad || "no informada"}. ` +
      `Problema principal: ${onboarding.principalProblema || "no informado"}. ` +
      `Preferencia para accesos: ${onboarding.preferenciaAccesos || "a definir"}.`;

    return NextResponse.json({
      ok: true,
      waUrl: buildWhatsappUrl(WHATSAPP_NUMBER, message)
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "No se pudo procesar el onboarding."
      },
      { status: 500 }
    );
  }
}