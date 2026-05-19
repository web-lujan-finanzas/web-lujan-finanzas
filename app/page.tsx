"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  ChevronRight,
  ClipboardCheck,
  LockKeyhole,
  Server,
  ShieldCheck,
  Terminal,
  Zap
} from "lucide-react";

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

type CalculatorAnswers = {
  cobranzas: number;
  comprobantes: number;
  reportes: number;
  decisiones: number;
};

const bentoCards: BentoCard[] = [
  {
    segment: "pyme",
    eyebrow: "Gestión administrativa",
    title: "La empresa vende, pero la administración llega tarde.",
    problem:
      "Comprobantes dispersos, cobranzas pendientes, vencimientos repartidos en distintas planillas y mucho tiempo perdido buscando información.",
    outcome:
      "Ordenamos el circuito administrativo para que cada dato tenga un lugar, un responsable y un seguimiento claro.",
    cta: "Evaluar procesos",
    className:
      "lg:col-span-2 bg-[#0A101D] text-white border-white/10 relative overflow-hidden group"
  },
  {
    segment: "cfo",
    eyebrow: "Crecimiento con control",
    title: "Cuando la empresa crece, el desorden también escala.",
    problem:
      "Más clientes, más movimientos, más tareas manuales y menos tiempo para mirar la empresa con perspectiva.",
    outcome:
      "Diseñamos procesos, indicadores y automatizaciones para crecer con mayor previsibilidad y menor carga operativa.",
    cta: "Evaluar estructura",
    className:
      "bg-white text-slate-950 border-slate-200 hover:border-emerald-500/50 transition-colors"
  },
  {
    segment: "agro",
    eyebrow: "Agro / Bodegas",
    title: "No alcanza con producir bien: también hay que medir bien.",
    problem:
      "Costos, impuestos, proveedores, stock, cobranzas y caja necesitan una lectura ordenada para tomar mejores decisiones.",
    outcome:
      "Armamos un mapa financiero-operativo adaptado a PyMEs, fincas, bodegas y empresas regionales.",
    cta: "Solicitar mapa",
    className:
      "bg-white text-slate-950 border-slate-200 hover:border-emerald-500/50 transition-colors"
  },
  {
    segment: "monotributo",
    eyebrow: "Orden fiscal",
    title: "Pagás impuestos, pero necesitás entender tus números.",
    problem:
      "Cumplir es necesario, pero gestionar requiere saber qué se paga, por qué se paga y cómo impacta en tu actividad.",
    outcome:
      "Orden fiscal, vencimientos claros y una lectura simple de tu situación para decidir con más tranquilidad.",
    cta: "Revisión fiscal",
    className: "bg-emerald-50 text-slate-950 border-emerald-200"
  }
];

export default function Home() {
  const [loading, setLoading] = useState<Segment | null>(null);
  const [answers, setAnswers] = useState<CalculatorAnswers>({
    cobranzas: 0,
    comprobantes: 0,
    reportes: 0,
    decisiones: 0
  });

  const frictionScore = useMemo(() => {
    const values = Object.values(answers);
    const total = values.reduce((acc, value) => acc + value, 0);
    return Math.round((total / 16) * 100);
  }, [answers]);

  const frictionLabel = useMemo(() => {
    if (frictionScore >= 75) return "Fricción crítica";
    if (frictionScore >= 50) return "Fricción alta";
    if (frictionScore >= 25) return "Fricción moderada";
    return "Fricción baja";
  }, [frictionScore]);

  async function enviarLead(segment: Segment, extraPain?: string) {
    setLoading(segment);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(buildLeadPayload(segment, extraPain))
      });

      const data = await res.json();

      if (data.waUrl) {
        window.location.href = data.waUrl;
      } else {
        alert("No se pudo iniciar el contacto por WhatsApp.");
      }
    } catch {
      alert("No se pudo conectar con el sistema. Intentá nuevamente.");
    } finally {
      setLoading(null);
    }
  }

  function solicitarIntervencionDesdeCalculadora() {
    const pain =
      `Completé la Calculadora de Fricción Operativa. ` +
      `Resultado: ${frictionScore}/100 (${frictionLabel}). ` +
      `Cobranzas: ${answers.cobranzas}/4. ` +
      `Comprobantes: ${answers.comprobantes}/4. ` +
      `Reportes: ${answers.reportes}/4. ` +
      `Decisiones: ${answers.decisiones}/4. ` +
      `Quiero evaluar cómo ordenar procesos administrativos y financieros con LF360.`;

    enviarLead("cfo", pain);
  }

  return (
    <main className="min-h-screen bg-[#020617] font-sans text-slate-300 selection:bg-emerald-500/30">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <BrandMark />

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-400 md:flex">
            <a href="#dolores" className="transition hover:text-white">
              Problemas frecuentes
            </a>
            <a href="#calculadora" className="transition hover:text-white">
              Test operativo
            </a>
            <a href="#lf360" className="transition hover:text-white">
              Método LF360
            </a>
            <a href="#autoridad" className="transition hover:text-white">
              Experiencia
            </a>
            <button
              onClick={() => enviarLead("general")}
              disabled={loading !== null}
              className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-emerald-400 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Solicitar evaluación inicial
            </button>
          </nav>
        </div>
      </header>

      <section
        id="inicio"
        className="relative overflow-hidden px-6 pb-20 pt-32 md:pt-40"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_40%)]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono uppercase tracking-widest text-slate-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Finanzas · Procesos · Automatización
            </div>

            <h1 className="bg-gradient-to-br from-white to-slate-500 bg-clip-text text-5xl font-black leading-[1.05] tracking-tight text-transparent md:text-6xl xl:text-7xl">
              Evolucioná tu gestión financiera. <br />
              Ordená la empresa como un{" "}
              <span className="text-emerald-400">sistema.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
              Luján Finanzas integra contabilidad, control operativo y
              automatización para que dejes de decidir solo con el saldo del
              banco, planillas desactualizadas o información dispersa.
            </p>

            <p className="mt-4 max-w-2xl text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
              Contador Público + experiencia gestionando empresa + automatización real de procesos
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => enviarLead("cfo")}
                disabled={loading !== null}
                className="group relative flex items-center justify-center gap-3 rounded-xl bg-white px-8 py-4 text-sm font-bold text-slate-950 transition-all hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Solicitar evaluación de estructura
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => enviarLead("pyme")}
                disabled={loading !== null}
                className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Aplicar al diagnóstico LF360
              </button>
            </div>
          </div>

          <div className="relative z-10 hidden lg:block lg:-mt-10">
            <div className="rounded-2xl border border-white/15 shadow-[0_0_80px_rgba(16,185,129,0.10)] transition-all duration-700 hover:shadow-[0_0_100px_rgba(16,185,129,0.15)]">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      <div className="border-y border-white/5 bg-white/[0.02] py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-10 px-6 opacity-60">
          <p className="text-sm font-mono font-bold uppercase tracking-widest">
            Herramientas de trabajo:
          </p>
          <p className="font-bold">Google Apps Script</p>
          <p className="font-bold">Google Sheets CRM</p>
          <p className="font-bold">WhatsApp Business</p>
          <p className="font-bold">Looker / Power BI</p>
          <p className="font-bold">Bases de datos</p>
        </div>
      </div>

      <section id="dolores" className="px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
            Problemas que suelen aparecer cuando la empresa empieza a crecer.
          </h2>
          <p className="mt-4 max-w-2xl text-slate-400">
            No siempre falta esfuerzo. Muchas veces falta un circuito claro:
            dónde entra la información, quién la sigue y qué datos se usan para
            decidir.
          </p>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bentoCards.map((card) => (
              <BentoProblemCard
                key={card.segment}
                card={card}
                loading={loading === card.segment}
                disabled={loading !== null}
                onClick={() => enviarLead(card.segment)}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        id="calculadora"
        className="border-y border-white/5 bg-[#050B14] px-6 py-32"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
              <ClipboardCheck className="h-4 w-4" />
              Diagnóstico rápido
            </div>

            <h2 className="text-4xl font-black leading-none tracking-tight text-white md:text-6xl">
              Calculadora de Fricción Operativa
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
              Respondé cuatro preguntas simples. El resultado te muestra cuánta
              energía administrativa se puede estar perdiendo por falta de orden,
              seguimiento o automatización.
            </p>

            <button
              onClick={solicitarIntervencionDesdeCalculadora}
              disabled={loading !== null}
              className="mt-10 flex items-center gap-3 rounded-xl bg-emerald-400 px-7 py-4 text-sm font-black text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Evaluar este resultado con LF360
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur">
            <div className="grid gap-5">
              <FrictionQuestion
                title="¿Cómo hacen seguimiento de cobranzas?"
                options={[
                  ["Manual, cuando hay tiempo", 4],
                  ["Planilla actualizada a mano", 3],
                  ["Sistema básico con alertas", 2],
                  ["Circuito automatizado con responsables", 0]
                ]}
                value={answers.cobranzas}
                onChange={(value) =>
                  setAnswers((prev) => ({ ...prev, cobranzas: value }))
                }
              />

              <FrictionQuestion
                title="¿Dónde se ordenan los comprobantes?"
                options={[
                  ["WhatsApp, fotos y carpetas mezcladas", 4],
                  ["Drive, pero sin criterio claro", 3],
                  ["Carpetas por período", 2],
                  ["Circuito ordenado y trazable", 0]
                ]}
                value={answers.comprobantes}
                onChange={(value) =>
                  setAnswers((prev) => ({ ...prev, comprobantes: value }))
                }
              />

              <FrictionQuestion
                title="¿Cada cuánto revisás reportes reales?"
                options={[
                  ["Casi nunca", 4],
                  ["Cuando aparece un problema", 3],
                  ["Una vez al mes", 2],
                  ["Semanalmente, con indicadores claros", 0]
                ]}
                value={answers.reportes}
                onChange={(value) =>
                  setAnswers((prev) => ({ ...prev, reportes: value }))
                }
              />

              <FrictionQuestion
                title="¿Cómo decidís pagos, caja y costos?"
                options={[
                  ["Mirando el saldo del banco", 4],
                  ["Con una planilla informal", 3],
                  ["Con reportes parciales", 2],
                  ["Con información actualizada y ordenada", 0]
                ]}
                value={answers.decisiones}
                onChange={(value) =>
                  setAnswers((prev) => ({ ...prev, decisiones: value }))
                }
              />
            </div>

            <div className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-6">
              <p className="text-xs font-mono uppercase tracking-widest text-emerald-300">
                Resultado estimado
              </p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-5xl font-black text-white">
                    {frictionScore}
                    <span className="text-xl text-slate-400">/100</span>
                  </p>
                  <p className="mt-2 font-bold text-emerald-300">
                    {frictionLabel}
                  </p>
                </div>
                <div className="h-24 w-24 rounded-full border border-emerald-400/30 bg-slate-950 p-2">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all"
                    style={{
                      clipPath: `inset(${100 - frictionScore}% 0 0 0 round 999px)`
                    }}
                  />
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-slate-300">
                Este puntaje no busca señalar errores. Sirve para detectar dónde
                la gestión diaria puede estar consumiendo más tiempo del
                necesario.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="lf360"
        className="border-t border-white/5 bg-[#060D18] px-6 py-32"
      >
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-start">
          <div className="sticky top-32">
            <div className="mb-6 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-emerald-400">
              <Zap className="h-4 w-4" />
              Método de trabajo
            </div>

            <h2 className="text-4xl font-black leading-none tracking-tight text-white md:text-6xl">
              Arquitectura <br />
              LF360
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-slate-400">
              LF360 ordena la gestión financiera desde adentro: información,
              obligaciones, procesos, responsables y reportes. El objetivo es
              que la empresa tenga más control sin sumar complejidad.
            </p>
          </div>

          <div className="grid gap-4">
            <EngineStep
              num="01"
              title="Diagnóstico financiero-operativo"
              desc="Relevamos flujo de caja, cobranzas, comprobantes, vencimientos y puntos de fricción administrativa."
            />
            <EngineStep
              num="02"
              title="Orden fiscal y administrativo"
              desc="Clarificamos obligaciones, documentación y circuitos para reducir urgencias, omisiones y retrabajo."
            />
            <EngineStep
              num="03"
              title="Automatización operativa"
              desc="Implementamos bases de datos, recordatorios, mensajería y seguimiento para reducir tareas repetitivas."
            />
            <EngineStep
              num="04"
              title="Reportes para decidir"
              desc="Construimos indicadores claros para mirar caja, pendientes, cumplimiento y prioridades con mayor rapidez."
            />
          </div>
        </div>
      </section>

      <section id="autoridad" className="px-6 py-32">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-sm md:p-16">
          <div className="pointer-events-none absolute right-0 top-0 rounded-full bg-emerald-500 p-32 opacity-20 blur-[120px]" />

          <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
            Formación contable, experiencia de gestión y capacidad tecnológica.
          </h2>

          <p className="mt-6 max-w-3xl text-xl leading-relaxed text-slate-400">
            Luján Finanzas nace de combinar tres miradas: la precisión técnica
            del contador, la experiencia de haber gestionado empresa, inventario
            y caja, y la capacidad de automatizar procesos administrativos con
            herramientas concretas.
          </p>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-400">
            Hablamos el mismo idioma que el dueño porque conocemos la operación
            desde adentro: vender, cobrar, pagar, ordenar documentación y tomar
            decisiones con información incompleta.
          </p>

          <div className="mt-12 grid gap-6 border-t border-white/10 pt-10 sm:grid-cols-3">
            <AuthorityBlock
              icon={<ShieldCheck className="h-6 w-6 text-emerald-400" />}
              title="Contador Público"
              text="UNCuyo. Perito Partidor. Base técnica para ordenar fiscalidad e información."
            />
            <AuthorityBlock
              icon={<Server className="h-6 w-6 text-emerald-400" />}
              title="Consultoría tecnológica"
              text="Automatización con Google Apps Script, bases de datos y flujos operativos."
            />
            <AuthorityBlock
              icon={<BarChart3 className="h-6 w-6 text-emerald-400" />}
              title="Gestión real de empresa"
              text="Experiencia directa administrando inventario, caja, rentabilidad y operación comercial."
            />
          </div>
        </div>
      </section>

      <section className="px-6 pb-32">
        <div className="mx-auto max-w-5xl rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-10 text-center">
          <LockKeyhole className="mx-auto h-8 w-8 text-emerald-400" />
          <h2 className="mt-5 text-3xl font-black tracking-tight text-white md:text-5xl">
            ¿Querés avanzar con orden desde el primer día?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
            El onboarding LF360 está pensado para relevar la información clave
            sin cadenas interminables de mensajes ni archivos sueltos.
          </p>
          <a
            href="/onboarding"
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-white px-8 py-4 text-sm font-black text-slate-950 transition hover:bg-slate-200"
          >
            Iniciar onboarding LF360
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <button
        onClick={() => enviarLead("general")}
        disabled={loading !== null}
        className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="Solicitar evaluación inicial"
      >
        <Terminal className="h-6 w-6" />
      </button>
    </main>
  );
}

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10">
        <Zap className="h-5 w-5 text-emerald-400" />
      </div>
      <div>
        <p className="text-sm font-black tracking-widest text-white">LUJÁN</p>
        <p className="font-mono text-[10px] tracking-[0.2em] text-emerald-400">
          FINANZAS
        </p>
      </div>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0A101D] p-2 shadow-2xl">
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
        </div>
        <p className="ml-4 font-mono text-[10px] text-slate-500">
          lf360 / control operativo
        </p>
      </div>

      <div className="p-6 font-mono text-sm">
        <p className="text-slate-400">
          <span className="text-emerald-400">➜</span> LF360.scan_empresa()
        </p>
        <p className="mt-2 text-slate-500">[OK] Información centralizada.</p>
        <p className="text-slate-500">
          [ALERTA] Comprobantes pendientes de ordenar.
        </p>
        <p className="text-slate-500">
          [ALERTA] Cobranzas sin seguimiento definido.
        </p>
        <p className="mt-4 text-emerald-400">
          Generando mapa financiero-operativo... 100%
        </p>

        <div className="mt-6 rounded-lg border border-white/5 bg-white/[0.02] p-4">
          <div className="mb-2 flex justify-between text-xs">
            <span className="text-slate-400">Claridad operativa</span>
            <span className="text-emerald-400">+84%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-[84%] bg-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

function BentoProblemCard({
  card,
  loading,
  disabled,
  onClick
}: {
  card: BentoCard;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const isDark = card.className.includes("bg-[#0A101D]");

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex min-h-[410px] w-full flex-col justify-between rounded-3xl border p-8 text-left transition-all hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60 ${card.className}`}
    >
      <div>
        <p
          className={`font-mono text-xs font-bold uppercase tracking-widest ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}
        >
          {card.eyebrow}
        </p>

        <h3
          className={`mt-4 text-2xl font-black tracking-tight ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {card.title}
        </h3>

        <p
          className={`mt-4 text-sm leading-relaxed ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          {card.problem}
        </p>

        <p
          className={`mt-5 text-sm font-bold leading-relaxed ${
            isDark ? "text-slate-200" : "text-slate-800"
          }`}
        >
          {card.outcome}
        </p>
      </div>

      <div
        className={`mt-8 inline-flex w-fit items-center gap-2 rounded-xl px-4 py-3 text-sm font-black transition-all ${
          isDark
            ? "bg-emerald-400 text-slate-950 group-hover:bg-emerald-300"
            : "bg-slate-950 text-white"
        }`}
      >
        {loading ? "Iniciando..." : card.cta}
        <ChevronRight className="h-4 w-4" />
      </div>
    </button>
  );
}

function FrictionQuestion({
  title,
  options,
  value,
  onChange
}: {
  title: string;
  options: [string, number][];
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <p className="font-bold text-white">{title}</p>
      <div className="mt-4 grid gap-2">
        {options.map(([label, optionValue]) => (
          <button
            key={label}
            onClick={() => onChange(optionValue)}
            className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
              value === optionValue
                ? "border-emerald-400 bg-emerald-400/10 text-emerald-300"
                : "border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/[0.05]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function EngineStep({
  num,
  title,
  desc
}: {
  num: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="group flex gap-6 rounded-2xl border border-transparent p-6 transition-colors hover:border-white/5 hover:bg-white/[0.02]">
      <div className="font-mono text-xl text-slate-600 transition-colors group-hover:text-emerald-400">
        {num}
      </div>
      <div>
        <h4 className="text-lg font-bold text-white">{title}</h4>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{desc}</p>
      </div>
    </div>
  );
}

function AuthorityBlock({
  icon,
  title,
  text
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div>
      <div className="mb-4">{icon}</div>
      <h3 className="font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
    </div>
  );
}

function buildLeadPayload(segment: Segment, extraPain?: string) {
  const payloads: Record<Segment, any> = {
    monotributo: {
      segment,
      source: "landing_revision_fiscal",
      path: "/",
      urgency: "media",
      pain:
        extraPain ||
        "Quiero una revisión de mi situación fiscal para entender mejor mis números y ordenar obligaciones."
    },
    pyme: {
      segment,
      source: "landing_diagnostico_pyme",
      path: "/",
      urgency: "alta",
      pain:
        extraPain ||
        "La empresa vende, pero la administración llega tarde. Quiero evaluar procesos administrativos y financieros."
    },
    agro: {
      segment,
      source: "landing_mapa_agro_bodega",
      path: "/",
      urgency: "alta",
      pain:
        extraPain ||
        "Necesito un mapa financiero-operativo para mi PyME, finca, bodega o empresa agro."
    },
    cfo: {
      segment,
      source: "landing_calculadora_friccion_operativa",
      path: "/",
      urgency: "alta",
      pain:
        extraPain ||
        "Quiero evaluar la estructura financiera y operativa de mi empresa para crecer con más control."
    },
    general: {
      segment,
      source: "landing_cta_general",
      path: "/",
      urgency: "media",
      pain:
        extraPain ||
        "Quiero una evaluación inicial con Luján Finanzas para ordenar números, procesos y control operativo."
    }
  };

  return payloads[segment];
}