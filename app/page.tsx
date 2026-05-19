"use client";

import { useState } from "react";

type Segment = "monotributo" | "pyme" | "agro" | "cfo" | "general";

type BentoCard = {
  segment: Segment;
  eyebrow: string;
  title: string;
  problem: string;
  outcome: string;
  cta: string;
  className: string;
};

const bentoCards: BentoCard[] = [
  {
    segment: "pyme",
    eyebrow: "Caos administrativo",
    title: "Tu empresa vende, pero la administración corre detrás.",
    problem:
      "Comprobantes por WhatsApp, cobranzas sin seguimiento, vencimientos dispersos y decisiones tomadas a ojo.",
    outcome:
      "Ordenamos el circuito administrativo y convertimos tareas sueltas en un sistema de control.",
    cta: "Aplicar al diagnóstico LF360",
    className: "lg:col-span-2 bg-slate-950 text-white border-emerald-500"
  },
  {
    segment: "cfo",
    eyebrow: "Escala sin control",
    title: "Querés crecer, pero cada venta nueva agrega más desorden.",
    problem:
      "Más clientes, más movimientos, más tareas manuales y menos visibilidad sobre qué está pasando realmente.",
    outcome:
      "Diseñamos procesos, indicadores y automatizaciones para escalar sin depender de improvisación.",
    cta: "Solicitar evaluación de estructura",
    className: "bg-white text-slate-950 border-slate-200"
  },
  {
    segment: "agro",
    eyebrow: "PyME / Agro / Bodega",
    title: "No podés gestionar una finca o bodega con información atrasada.",
    problem:
      "Costos, impuestos, proveedores, cobranzas y stock necesitan lectura financiera, no planillas aisladas.",
    outcome:
      "Armamos un mapa financiero-operativo para decidir con datos y no con intuición.",
    cta: "Solicitar mapa financiero",
    className: "bg-white text-slate-950 border-slate-200"
  },
  {
    segment: "monotributo",
    eyebrow: "Orden fiscal",
    title: "Pagás impuestos, pero no entendés tus números.",
    problem:
      "Cumplir no alcanza. Si no entendés qué pagás, cuándo y por qué, no estás gestionando.",
    outcome:
      "Orden fiscal, claridad de obligaciones y lectura simple de tu situación.",
    cta: "Solicitar evaluación fiscal",
    className: "bg-emerald-50 text-slate-950 border-emerald-200"
  }
];

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
        body: JSON.stringify(buildLeadPayload(segment))
      });

      const data = await res.json();

      if (data.waUrl) {
        window.location.href = data.waUrl;
      } else {
        alert("No se pudo abrir WhatsApp.");
      }
    } catch {
      alert("Error al procesar la solicitud.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#inicio" className="flex items-center gap-3">
            <BrandMark />
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#dolores"
              className="text-sm font-bold text-slate-300 hover:text-white"
            >
              Dolores
            </a>
            <a
              href="#lf360"
              className="text-sm font-bold text-slate-300 hover:text-white"
            >
              LF360
            </a>
            <a
              href="#autoridad"
              className="text-sm font-bold text-slate-300 hover:text-white"
            >
              Autoridad
            </a>
            <button
              onClick={() => enviarLead("general")}
              disabled={loading !== null}
              className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
            >
              Solicitar evaluación inicial
            </button>
          </nav>
        </div>
      </header>

      <section
        id="inicio"
        className="relative overflow-hidden bg-slate-950 px-6 pb-24 pt-44 text-white"
      >
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="mb-6 inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-300">
              Finanzas · Procesos · Automatización · PyMES · Agro
            </div>

            <h1 className="max-w-5xl text-5xl font-black leading-[1.02] tracking-[-0.05em] md:text-6xl xl:text-7xl">
              Dejá de perseguir comprobantes. Goberná tu empresa con datos.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
              Luján Finanzas ordena tu arquitectura financiera, fiscal y
              operativa para que dejes de apagar incendios administrativos y
              empieces a decidir con control.
            </p>

            <p className="mt-4 max-w-2xl text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">
              Contador Público + ex administrador de S.A.S. + automatización real de procesos
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => enviarLead("pyme")}
                disabled={loading !== null}
                className="whitespace-nowrap rounded-2xl bg-emerald-400 px-8 py-4 text-lg font-black text-slate-950 shadow-2xl shadow-emerald-400/20 transition hover:-translate-y-1 hover:bg-emerald-300 disabled:opacity-60"
              >
                {loading === "pyme"
                  ? "Preparando evaluación..."
                  : "Aplicar al diagnóstico LF360"}
              </button>

              <button
                onClick={() => enviarLead("cfo")}
                disabled={loading !== null}
                className="whitespace-nowrap rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-lg font-black text-white transition hover:-translate-y-1 hover:bg-white/10 disabled:opacity-60"
              >
                Solicitar evaluación de estructura
              </button>
            </div>

            <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
              <ProofPill text="Menos tareas manuales" />
              <ProofPill text="Más control de caja" />
              <ProofPill text="Información accionable" />
            </div>
          </div>

          <div className="relative">
            <DashboardMockup />
          </div>
        </div>
      </section>

      <section id="dolores" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-600">
                Problemas reales
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.04em] md:text-6xl">
                No necesitás otro contador que cargue datos. Necesitás estructura.
              </h2>
            </div>

            <p className="max-w-2xl text-lg leading-relaxed text-slate-600">
              Cada clic entra al CRM con contexto, prioridad y dolor específico.
              No capturamos consultas genéricas: capturamos intención comercial.
            </p>
          </div>

          <div className="mt-14 grid auto-rows-fr gap-6 lg:grid-cols-4">
            {bentoCards.map((card) => (
              <BentoProblemCard
                key={card.segment}
                card={card}
                loading={loading === card.segment}
                onClick={() => enviarLead(card.segment)}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="lf360" className="bg-slate-950 px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
            <div className="sticky top-28">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-400">
                Método LF360
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.04em] md:text-6xl">
                Un sistema para ordenar la empresa desde adentro.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-300">
                LF360 no es una lista de servicios. Es una intervención
                financiera-operativa para detectar fugas, ordenar circuitos,
                automatizar procesos y medir lo que importa.
              </p>

              <button
                onClick={() => enviarLead("cfo")}
                disabled={loading !== null}
                className="mt-10 rounded-2xl bg-emerald-400 px-8 py-4 text-lg font-black text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
              >
                Solicitar evaluación de arquitectura financiera
              </button>
            </div>

            <div className="grid gap-5">
              <LF360Step
                number="01"
                title="Diagnóstico financiero-operativo"
                text="Mapeamos cómo entra, se procesa y se usa la información: caja, comprobantes, cobranzas, vencimientos, costos y decisiones."
              />
              <LF360Step
                number="02"
                title="Orden fiscal y administrativo"
                text="Blindamos la base: obligaciones claras, documentación ordenada, criterios de gestión y circuitos que no dependan de memoria o urgencia."
              />
              <LF360Step
                number="03"
                title="Automatización de procesos críticos"
                text="Automatizamos seguimiento, cobranzas, mensajería, bases de datos y tareas repetitivas para reducir fricción operativa."
              />
              <LF360Step
                number="04"
                title="Reportes gerenciales y seguimiento"
                text="Creamos indicadores simples para que puedas ver caja, cumplimiento, pendientes y prioridades sin revolver planillas."
              />
            </div>
          </div>
        </div>
      </section>

      <section id="autoridad" className="px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-600">
              El foso defensivo
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.04em] md:text-5xl">
              Contador, operador y automatizador. Esa mezcla no se terceriza fácil.
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Ramiro González Anselmi combina formación contable, experiencia
              real gestionando una S.A.S. y trabajo técnico automatizando
              procesos, bases de datos, cobranzas y mensajería operativa.
            </p>

            <a
              href="https://www.linkedin.com/in/ramiro-gonzalez-anselmi"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white transition hover:bg-slate-800"
            >
              Ver perfil profesional →
            </a>
          </div>

          <div className="grid gap-5">
            <AuthorityItem
              title="Contador Público Nacional y Perito Partidor"
              text="Formación en Ciencias Económicas en UNCuyo, con base técnica para ordenar fiscalidad, gestión e información contable."
            />
            <AuthorityItem
              title="Ex socio presidente y administrador de S.A.S."
              text="Experiencia real gestionando inventario, flujo de caja, rentabilidad y operación diaria de una empresa comercial."
            />
            <AuthorityItem
              title="Consultor tecnológico en Maverix"
              text="Automatización de flujos operativos, cobranzas, mensajería masiva, Google Apps Script y bases de datos."
            />
            <AuthorityItem
              title="Intercambio académico internacional"
              text="Formación complementaria en el Instituto Tecnológico de Sonora, México, con exposición a otros entornos académicos y operativos."
            />
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl">
          <div className="grid lg:grid-cols-[1fr_.85fr]">
            <div className="p-10 md:p-14">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-400">
                Entrada premium
              </p>
              <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-[-0.04em] md:text-6xl">
                Si la administración te maneja a vos, la empresa todavía no está bajo control.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
                Aplicá a una evaluación inicial. Vamos a detectar qué está
                desordenado, qué se puede automatizar y qué información deberías
                mirar todas las semanas.
              </p>
            </div>

            <div className="border-t border-white/10 bg-white/5 p-8 lg:border-l lg:border-t-0">
              <CTAOption
                title="Diagnóstico LF360"
                text="Para PyMES con desorden administrativo, comprobantes, cobranzas y tareas manuales."
                onClick={() => enviarLead("pyme")}
                loading={loading === "pyme"}
              />
              <CTAOption
                title="Evaluación de arquitectura financiera"
                text="Para empresas que quieren escalar con procesos, indicadores y control."
                onClick={() => enviarLead("cfo")}
                loading={loading === "cfo"}
              />
              <CTAOption
                title="Mapa financiero PyME / Agro"
                text="Para fincas, bodegas y empresas regionales que necesitan decidir con datos."
                onClick={() => enviarLead("agro")}
                loading={loading === "agro"}
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm font-bold text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>Luján Finanzas © 2026 · Luján de Cuyo, Mendoza</p>
          <p>Finanzas · Procesos · Automatización · Control operativo</p>
        </div>
      </footer>

      <button
        onClick={() => enviarLead("general")}
        disabled={loading !== null}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400 text-3xl shadow-2xl shadow-emerald-400/30 transition hover:scale-110 hover:bg-emerald-300 disabled:opacity-60"
        aria-label="Solicitar evaluación inicial"
      >
        💬
      </button>
    </main>
  );
}

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-11 w-11 items-end justify-center rounded-xl bg-white p-2">
        <div className="h-4 w-2 rounded-sm bg-slate-950" />
        <div className="ml-1 h-6 w-2 rounded-sm bg-slate-950" />
        <div className="ml-1 h-8 w-2 rounded-sm bg-emerald-500" />
        <div className="absolute left-2 top-2 h-6 w-6 rotate-45 border-r-2 border-t-2 border-emerald-500" />
      </div>
      <div className="leading-none">
        <p className="text-sm font-black tracking-[0.25em] text-white">
          LUJÁN
        </p>
        <p className="mt-1 text-xs font-black tracking-[0.22em] text-emerald-400">
          FINANZAS
        </p>
      </div>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl">
      <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950">
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
          <p className="ml-4 text-xs font-bold text-slate-500">
            lf360/control-operativo
          </p>
        </div>

        <div className="grid gap-5 p-6">
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
              Estado operativo
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              14 procesos detectados
            </p>
            <p className="mt-2 text-sm text-slate-400">
              5 automatizables · 4 críticos · 3 sin responsable claro
            </p>
          </div>

          <div className="grid gap-3">
            <Bar label="Cobranzas sin seguimiento" value="87%" />
            <Bar label="Comprobantes dispersos" value="72%" />
            <Bar label="Reportes manuales" value="64%" />
          </div>

          <div className="rounded-2xl bg-slate-900 p-5 font-mono text-sm text-slate-300">
            <p>
              <span className="text-emerald-400">$</span> lf360.scan()
            </p>
            <p className="mt-2 text-slate-500">
              → detectando fugas administrativas...
            </p>
            <p className="text-slate-500">
              → priorizando automatizaciones...
            </p>
            <p className="text-emerald-300">
              → arquitectura financiera lista para revisión
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bar({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs font-bold text-slate-400">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-emerald-400"
          style={{ width: value }}
        />
      </div>
    </div>
  );
}

function BentoProblemCard({
  card,
  loading,
  onClick
}: {
  card: BentoCard;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={[
        "rounded-[2rem] border p-7 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl",
        card.className
      ].join(" ")}
    >
      <p
        className={
          card.className.includes("bg-slate-950")
            ? "text-sm font-black uppercase tracking-[0.2em] text-emerald-300"
            : "text-sm font-black uppercase tracking-[0.2em] text-emerald-700"
        }
      >
        {card.eyebrow}
      </p>

      <h3 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em]">
        {card.title}
      </h3>

      <p
        className={
          card.className.includes("bg-slate-950")
            ? "mt-5 leading-relaxed text-slate-300"
            : "mt-5 leading-relaxed text-slate-600"
        }
      >
        {card.problem}
      </p>

      <div
        className={
          card.className.includes("bg-slate-950")
            ? "mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-bold text-slate-200"
            : "mt-6 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700"
        }
      >
        {card.outcome}
      </div>

      <button
        onClick={onClick}
        disabled={loading}
        className={
          card.className.includes("bg-slate-950")
            ? "mt-8 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-300 disabled:opacity-50"
            : "mt-8 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:opacity-50"
        }
      >
        {loading ? "Preparando..." : `${card.cta} →`}
      </button>
    </div>
  );
}

function LF360Step({
  number,
  title,
  text
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 transition hover:border-emerald-400/40 hover:bg-white/[0.06]">
      <div className="flex items-start gap-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-sm font-black text-slate-950">
          {number}
        </div>
        <div>
          <h3 className="text-2xl font-black tracking-[-0.03em] text-white">
            {title}
          </h3>
          <p className="mt-3 leading-relaxed text-slate-400">{text}</p>
        </div>
      </div>
    </div>
  );
}

function AuthorityItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-black tracking-[-0.03em] text-slate-950">
        {title}
      </h3>
      <p className="mt-3 leading-relaxed text-slate-600">{text}</p>
    </div>
  );
}

function CTAOption({
  title,
  text,
  loading,
  onClick
}: {
  title: string;
  text: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="mb-4 w-full rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-white/10 disabled:opacity-60"
    >
      <h3 className="text-xl font-black tracking-[-0.03em] text-white">
        {title}
      </h3>
      <p className="mt-2 leading-relaxed text-slate-400">{text}</p>
      <p className="mt-4 text-sm font-black text-emerald-300">
        {loading ? "Preparando evaluación..." : "Solicitar evaluación →"}
      </p>
    </button>
  );
}

function ProofPill({ text }: { text: string }) {
  return (
    <div className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-bold text-slate-300">
      {text}
    </div>
  );
}

function buildLeadPayload(segment: Segment) {
  const payloads: Record<Segment, any> = {
    monotributo: {
      segment,
      source: "landing_dolor_orden_fiscal",
      path: "/",
      urgency: "media",
      pain:
        "Estoy pagando impuestos sin entender mis números. Quiero una evaluación fiscal inicial para ordenar mi situación y tener claridad."
    },
    pyme: {
      segment,
      source: "landing_dolor_administracion_desordenada",
      path: "/",
      urgency: "alta",
      pain:
        "Mi empresa vende, pero la administración corre detrás. Pierdo tiempo con comprobantes, cobranzas y tareas manuales. Quiero aplicar al diagnóstico LF360."
    },
    agro: {
      segment,
      source: "landing_dolor_pyme_agro_datos",
      path: "/",
      urgency: "alta",
      pain:
        "Necesito decidir con datos en mi PyME, finca, bodega o empresa agro. Quiero un mapa financiero-operativo para tener control real."
    },
    cfo: {
      segment,
      source: "landing_dolor_escalar_sin_caos",
      path: "/",
      urgency: "alta",
      pain:
        "Quiero escalar sin sumar caos operativo. Necesito una evaluación de arquitectura financiera, procesos críticos e indicadores."
    },
    general: {
      segment,
      source: "landing_cta_evaluacion_inicial",
      path: "/",
      urgency: "media",
      pain:
        "Quiero coordinar una evaluación inicial con Luján Finanzas para ordenar números, procesos y control operativo."
    }
  };

  return payloads[segment];
}