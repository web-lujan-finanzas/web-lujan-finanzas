"use client";

import { useState } from "react";

type Segment = "monotributo" | "pyme" | "agro" | "cfo" | "general";

export default function Home() {
  const [loading, setLoading] = useState<Segment | null>(null);

  async function enviarLead(segment: Segment) {
    setLoading(segment);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          segment,
          source: "landing",
          path: "/",
          urgency: segment === "cfo" || segment === "agro" ? "alta" : "media",
          pain: getPain(segment)
        })
      });

      const data = await res.json();

      if (data.waUrl) {
        window.location.href = data.waUrl;
      } else {
        alert("No se pudo abrir WhatsApp.");
      }
    } catch (error) {
      alert("Error al procesar la consulta.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#inicio" className="flex items-center gap-3">
            <img src="/logo.png" alt="Luján Finanzas" className="h-12 w-auto" />
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#servicios" className="text-sm font-bold text-slate-300 hover:text-white">
              Servicios
            </a>
            <a href="#sistema" className="text-sm font-bold text-slate-300 hover:text-white">
              Sistema
            </a>
            <button
              onClick={() => enviarLead("general")}
              className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black text-slate-950 hover:bg-emerald-400"
            >
              Hablar con un asesor
            </button>
          </nav>
        </div>
      </header>

      <section
        id="inicio"
        className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 pb-24 pt-36 text-white"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-500 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-emerald-300">
              Luján de Cuyo, Mendoza · Atención presencial y online
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
              Estrategia financiera y{" "}
              <span className="text-emerald-400">automatización</span>{" "}
              empresarial.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
              Ordenamos impuestos, procesos y datos para que tu empresa tome mejores decisiones,
              reduzca carga administrativa y crezca con estructura.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => enviarLead("pyme")}
                disabled={loading !== null}
                className="rounded-2xl bg-emerald-500 px-8 py-4 text-lg font-black text-slate-950 shadow-2xl shadow-emerald-500/20 transition hover:-translate-y-1 hover:bg-emerald-400 disabled:opacity-60"
              >
                {loading === "pyme" ? "Abriendo..." : "Hablar con un asesor"}
              </button>

              <a
                href="#servicios"
                className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-center text-lg font-bold text-white hover:bg-white/10"
              >
                Ver soluciones
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            <p className="text-sm font-bold text-slate-400">Panel de gestión empresarial</p>
            <h2 className="mt-2 text-3xl font-black">Empresa bajo control</h2>

            <div className="mt-8 grid gap-4">
              <Metric title="Carga operativa" value="Menos fricción" />
              <Metric title="Información financiera" value="Más claridad" />
              <Metric title="Seguimiento comercial" value="Más control" />
            </div>
          </div>
        </div>
      </section>

      <section id="servicios" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-600">
              Soluciones
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              Un flujo distinto para cada tipo de cliente.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Cada botón registra el lead, calcula prioridad y abre WhatsApp con el mensaje correcto.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <ServiceCard
              title="Monotributo"
              label="Profesionales"
              text="Alta, categorización, ingresos brutos, facturación y orden fiscal."
              onClick={() => enviarLead("monotributo")}
              loading={loading === "monotributo"}
            />

            <ServiceCard
              title="Gestión PyME"
              label="PyMES"
              text="Impuestos, sueldos, sociedades, reportes y seguimiento mensual."
              featured
              onClick={() => enviarLead("pyme")}
              loading={loading === "pyme"}
            />

            <ServiceCard
              title="Agro & Bodegas"
              label="Regional"
              text="Soluciones para fincas, bodegas y empresas agroindustriales."
              onClick={() => enviarLead("agro")}
              loading={loading === "agro"}
            />

            <ServiceCard
              title="CFO Automation"
              label="Premium"
              text="Automatización de cobranzas, dashboards, CRM y procesos administrativos."
              onClick={() => enviarLead("cfo")}
              loading={loading === "cfo"}
            />
          </div>
        </div>
      </section>

      <section id="sistema" className="bg-slate-950 px-6 py-24 text-white">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400">
              Sistema comercial
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              No capturamos contactos. Capturamos intención.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-300">
              El lead entra clasificado a Google Sheets y vos seguís el cierre manualmente
              desde WhatsApp, sin costos fijos ni plataformas pagas.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            {[
              "Landing segmentada",
              "Lead scoring invisible",
              "Google Sheets CRM",
              "WhatsApp con contexto",
              "Cierre manual desde celular"
            ].map((step, index) => (
              <div key={step} className="flex items-center gap-4 border-b border-white/10 py-4 last:border-b-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 font-black text-slate-950">
                  {index + 1}
                </div>
                <p className="font-bold text-slate-200">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-10 text-center shadow-2xl">
          <h2 className="text-4xl font-black text-slate-900">
            ¿Querés ordenar y automatizar tu empresa?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            Coordinemos una reunión inicial para evaluar tu situación y definir el próximo paso.
          </p>

          <button
            onClick={() => enviarLead("general")}
            disabled={loading !== null}
            className="mt-10 rounded-2xl bg-slate-950 px-10 py-5 text-lg font-black text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading === "general" ? "Abriendo..." : "Abrir WhatsApp"}
          </button>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-6 py-10 text-center text-sm font-bold text-slate-500">
        Luján Finanzas © 2026 · Luján de Cuyo, Mendoza
      </footer>

      <button
        onClick={() => enviarLead("general")}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-3xl shadow-2xl shadow-emerald-500/30 transition hover:scale-110"
        aria-label="Abrir WhatsApp"
      >
        💬
      </button>
    </main>
  );
}

function ServiceCard({
  title,
  label,
  text,
  featured = false,
  loading,
  onClick
}: {
  title: string;
  label: string;
  text: string;
  featured?: boolean;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={[
        "rounded-3xl border p-7 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl",
        featured ? "border-emerald-500 bg-slate-950 text-white" : "border-slate-200 bg-white"
      ].join(" ")}
    >
      <p className={featured ? "text-sm font-black text-emerald-300" : "text-sm font-black text-emerald-700"}>
        {label}
      </p>

      <h3 className="mt-3 text-2xl font-black">{title}</h3>

      <p className={featured ? "mt-4 min-h-[96px] text-slate-300" : "mt-4 min-h-[96px] text-slate-600"}>
        {text}
      </p>

      <button
        onClick={onClick}
        disabled={loading}
        className={[
          "mt-8 rounded-xl px-5 py-3 text-sm font-black transition disabled:opacity-50",
          featured ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400" : "bg-slate-950 text-white hover:bg-slate-800"
        ].join(" ")}
      >
        {loading ? "Abriendo..." : "Iniciar consulta →"}
      </button>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm font-bold text-slate-400">{title}</p>
      <p className="mt-1 text-xl font-black text-white">{value}</p>
    </div>
  );
}

function getPain(segment: Segment) {
  const pain: Record<Segment, string> = {
    monotributo: "Necesito ordenar mi situación fiscal como profesional o monotributista.",
    pyme: "Necesito gestión integral para mi empresa, impuestos, sueldos y reportes.",
    agro: "Necesito asesoramiento para una empresa vinculada al agro, finca o bodega.",
    cfo: "Necesito estrategia financiera, reportes, CRM y automatización empresarial.",
    general: "Quiero coordinar una reunión inicial con Luján Finanzas."
  };

  return pain[segment];
}