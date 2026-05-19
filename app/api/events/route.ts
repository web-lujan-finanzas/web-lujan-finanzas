import { NextResponse } from "next/server";

export const runtime = "edge";

type EventPayload = {
  eventName?: string;
  path?: string;
  metadata?: Record<string, unknown>;
};

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

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    ""
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EventPayload;

    const eventPayload = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      createdAt: new Date().toISOString(),
      eventName: safeString(body.eventName, 120),
      path: safeString(body.path, 300),
      userAgent: safeString(request.headers.get("user-agent"), 500),
      ipHint: getClientIp(request),
      metadata: body.metadata || {}
    };

    if (!eventPayload.eventName) {
      return NextResponse.json(
        {
          ok: false,
          error: "eventName requerido"
        },
        { status: 400 }
      );
    }

    if (GOOGLE_SHEETS_WEBHOOK_URL) {
      await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          secret: GOOGLE_SHEETS_WEBHOOK_SECRET,
          event: "analytics.event",
          version: "lf360-events-v1",
          analytics: eventPayload
        })
      });
    }

    return NextResponse.json({
      ok: true
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "No se pudo registrar el evento"
      },
      { status: 500 }
    );
  }
}