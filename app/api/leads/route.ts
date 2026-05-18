import { NextResponse } from "next/server";

export const runtime = "edge";

type Segment = "monotributo" | "pyme" | "agro" | "cfo" | "general";
type Urgency = "baja" | "media" | "alta";
type Priority = "baja" | "media" | "alta";

type RawLeadPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  segment?: unknown;
  employees?: unknown;
  urgency?: unknown;
  pain?: unknown;
  source?: unknown;
  path?: unknown;
  utm?: unknown;
  honeypot?: unknown;
};

type CleanLeadInput = {
  name: string;
  email: string;
  phone: string;
  company: string;
  segment: Segment;
  employees: number | null;
  urgency: Urgency;
  pain: string;
  source: string;
  path: string;
  utm: {
    source: string;
    medium: string;
    campaign: string;
    content: string;
    term: string;
  };
};

type EnrichedLead = CleanLeadInput & {
  id: string;
  createdAt: string;
  score: number;
  priority: Priority;
  priorityRank: number;
  status: string;
  nextAction: string;
  whatsappMessage: string;
  whatsappUrl: string;
  userAgent: string;
  ipHint: string;
};

const SEGMENTS: Segment[] = ["monotributo", "pyme", "agro", "cfo", "general"];
const URGENCIES: Urgency[] = ["baja", "media", "alta"];

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

const MAX_FIELD_LENGTHS = {
  name: 80,
  email: 120,
  phone: 40,
  company: 140,
  source: 80,
  path: 240,
  pain: 900,
  utm: 120
};

function safeString(value: unknown, maxLength = 200): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function normalizePhone(value: string): string {
  return value.replace(/[^\d]/g, "");
}

function normalizeSegment(value: unknown): Segment {
  const clean = safeString(value, 40).toLowerCase();

  if (SEGMENTS.includes(clean as Segment)) {
    return clean as Segment;
  }

  return "general";
}

function normalizeUrgency(value: unknown): Urgency {
  const clean = safeString(value, 40).toLowerCase();

  if (URGENCIES.includes(clean as Urgency)) {
    return clean as Urgency;
  }

  return "media";
}

function normalizeEmployees(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;

  const numberValue =
    typeof value === "number" ? value : Number(String(value).replace(",", "."));

  if (!Number.isFinite(numberValue)) return null;
  if (numberValue < 0) return 0;
  if (numberValue > 10000) return 10000;

  return Math.round(numberValue);
}

function normalizeUtm(value: unknown): CleanLeadInput["utm"] {
  if (!value || typeof value !== "object") {
    return {
      source: "",
      medium: "",
      campaign: "",
      content: "",
      term: ""
    };
  }

  const objectValue = value as Record<string, unknown>;

  return {
    source: safeString(objectValue.source, MAX_FIELD_LENGTHS.utm),
    medium: safeString(objectValue.medium, MAX_FIELD_LENGTHS.utm),
    campaign: safeString(objectValue.campaign, MAX_FIELD_LENGTHS.utm),
    content: safeString(objectValue.content, MAX_FIELD_LENGTHS.utm),
    term: safeString(objectValue.term, MAX_FIELD_LENGTHS.utm)
  };
}

function cleanPayload(payload: RawLeadPayload): CleanLeadInput {
  return {
    name: safeString(payload.name, MAX_FIELD_LENGTHS.name),
    email: safeString(payload.email, MAX_FIELD_LENGTHS.email).toLowerCase(),
    phone: normalizePhone(safeString(payload.phone, MAX_FIELD_LENGTHS.phone)),
    company: safeString(payload.company, MAX_FIELD_LENGTHS.company),
    segment: normalizeSegment(payload.segment),
    employees: normalizeEmployees(payload.employees),
    urgency: normalizeUrgency(payload.urgency),
    pain: safeString(payload.pain, MAX_FIELD_LENGTHS.pain),
    source: safeString(payload.source, MAX_FIELD_LENGTHS.source) || "landing",
    path: safeString(payload.path, MAX_FIELD_LENGTHS.path),
    utm: normalizeUtm(payload.utm)
  };
}

function createLeadId(): string {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `lead_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function getPriorityFromScore(score: number): {
  priority: Priority;
  priorityRank: number;
  status: string;
  nextAction: string;
} {
  if (score >= 80) {
    return {
      priority: "alta",
      priorityRank: 1,
      status: "Lead caliente",
      nextAction: "Contactar hoy y coordinar reunión estratégica"
    };
  }

  if (score >= 50) {
    return {
      priority: "media",
      priorityRank: 2,
      status: "Lead calificado",
      nextAction: "Enviar preguntas de calificación y ofrecer reunión inicial"
    };
  }

  return {
    priority: "baja",
    priorityRank: 3,
    status: "Lead inicial",
    nextAction: "Responder orientación inicial y mantener en seguimiento"
  };
}

function scoreLead(input: CleanLeadInput): number {
  let score = 0;

  const segmentScore: Record<Segment, number> = {
    monotributo: 22,
    general: 30,
    pyme: 58,
    agro: 68,
    cfo: 86
  };

  score += segmentScore[input.segment];

  if (input.employees !== null) {
    if (input.employees >= 1) score += 8;
    if (input.employees >= 3) score += 8;
    if (input.employees >= 8) score += 10;
    if (input.employees >= 20) score += 12;
  }

  if (input.urgency === "media") score += 7;
  if (input.urgency === "alta") score += 18;

  if (input.company.length >= 3) score += 8;
  if (input.phone.length >= 10) score += 8;
  if (input.email.includes("@")) score += 5;

  if (input.pain.length >= 30) score += 8;
  if (input.pain.length >= 120) score += 7;

  const painLower = input.pain.toLowerCase();

  const highIntentTerms = [
    "automatizar",
    "automatización",
    "cobranzas",
    "reportes",
    "dashboard",
    "crm",
    "sueldos",
    "sociedad",
    "srl",
    "sas",
    "bodega",
    "agro",
    "finca",
    "costos",
    "ganancias",
    "iva",
    "deuda",
    "bloqueo"
  ];

  for (const term of highIntentTerms) {
    if (painLower.includes(term)) score += 3;
  }

  return Math.min(score, 100);
}

function buildWhatsappMessage(input: CleanLeadInput): string {
  const intro = "Hola, vi la web de Luján Finanzas.";

  const baseMessages: Record<Segment, string> = {
    monotributo:
      "Quiero asesoramiento para ordenar mi situación fiscal como profesional o monotributista.",
    pyme:
      "Quiero información sobre la gestión integral para mi PyME.",
    agro:
      "Quiero asesoramiento para una empresa vinculada al agro, finca o bodega.",
    cfo:
      "Busco una reunión sobre estrategia financiera y automatización empresarial.",
    general:
      "Quiero coordinar una reunión inicial."
  };

  const parts = [intro, baseMessages[input.segment]];

  if (input.company) {
    parts.push(`Empresa: ${input.company}.`);
  }

  if (input.employees !== null) {
    parts.push(`Empleados aproximados: ${input.employees}.`);
  }

  if (input.urgency === "alta") {
    parts.push("Tengo prioridad alta para resolverlo.");
  }

  if (input.pain) {
    parts.push(`Necesidad: ${input.pain}`);
  }

  return parts.join(" ");
}

function buildWhatsappUrl(phoneNumber: string, message: string): string {
  const cleanPhone = normalizePhone(phoneNumber);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

function enrichLead(
  input: CleanLeadInput,
  request: Request
): EnrichedLead {
  const score = scoreLead(input);
  const priorityData = getPriorityFromScore(score);
  const whatsappMessage = buildWhatsappMessage(input);
  const whatsappUrl = buildWhatsappUrl(WHATSAPP_NUMBER, whatsappMessage);

  return {
    ...input,
    id: createLeadId(),
    createdAt: new Date().toISOString(),
    score,
    priority: priorityData.priority,
    priorityRank: priorityData.priorityRank,
    status: priorityData.status,
    nextAction: priorityData.nextAction,
    whatsappMessage,
    whatsappUrl,
    userAgent: request.headers.get("user-agent") || "",
    ipHint:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      ""
  };
}

async function postToGoogleSheets(lead: EnrichedLead): Promise<void> {
  if (!GOOGLE_SHEETS_WEBHOOK_URL) return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);

  try {
    await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        secret: GOOGLE_SHEETS_WEBHOOK_SECRET,
        event: "lead.capture",
        version: "bootstrapper-zero-cost-v1",
        lead
      }),
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: Request) {
  try {
    const rawPayload = (await request.json()) as RawLeadPayload;

    const honeypot = safeString(rawPayload.honeypot, 200);

    if (honeypot) {
      return NextResponse.json(
        {
          ok: true,
          waUrl: buildWhatsappUrl(
            WHATSAPP_NUMBER,
            "Hola, vi la web de Luján Finanzas y quiero hacer una consulta."
          )
        },
        {
          headers: {
            "Cache-Control": "no-store"
          }
        }
      );
    }

    const cleanInput = cleanPayload(rawPayload);
    const lead = enrichLead(cleanInput, request);

    await postToGoogleSheets(lead);

    return NextResponse.json(
      {
        ok: true,
        waUrl: lead.whatsappUrl
      },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "No se pudo procesar la consulta.",
        waUrl: buildWhatsappUrl(
          WHATSAPP_NUMBER,
          "Hola, vi la web de Luján Finanzas y quiero coordinar una reunión inicial."
        )
      },
      {
        status: 400,
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  }
}