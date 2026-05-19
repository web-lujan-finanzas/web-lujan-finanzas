"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, LockKeyhole, ShieldCheck } from "lucide-react";

type FormState = {
  razonSocial: string;
  cuit: string;
  actividad: string;
  responsable: string;
  telefono: string;
  email: string;
  empleados: string;
  facturacion: string;
  principalProblema: string;
  driveLink: string;
  preferenciaAccesos: string;
  observaciones: string;
};

const initialState: FormState = {
  razonSocial: "",
  cuit: "",
  actividad: "",
  responsable: "",
  telefono: "",
  email: "",
  empleados: "",
  facturacion: "",
  principalProblema: "",
  driveLink: "",
  preferenciaAccesos: "Coordinar por llamada",
  observaciones: ""
};

export default function OnboardingPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit() {
    setLoading(true);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.ok) {
        setDone(true);
        if (data.waUrl) {
          setTimeout(() => {
            window.location.href = data.waUrl;
          }, 900);
        }
      } else {
        alert("No se pudo enviar el onboarding.");
      }
    } catch {
      alert("Error al enviar el onboarding.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#020617] px-6 py-12 text-slate-300">
      <div className="mx-auto max-w-5xl">
        <a href="/" className="text-sm font-bold text-emerald-400">
          ← Volver a Luján Finanzas
        </a>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl md:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-300">
                <LockKeyhole className="h-4 w-4" />
                Onboarding LF360
              </div>

              <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
                Arrancamos sin Excels sueltos, sin cadenas eternas de WhatsApp y sin perder contexto.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
                Completá esta ficha inicial. No pedimos claves fiscales ni
                contraseñas por este formulario. Los accesos se coordinan por un
                canal seguro o llamada guiada.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-300">
                Buen onboarding no es pedir “todo”. Es pedir lo necesario,
                ordenado y en el momento correcto.
              </p>
            </div>
          </div>

          {done ? (
            <div className="mt-12 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-8 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
              <h2 className="mt-5 text-3xl font-black text-white">
                Onboarding recibido.
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-slate-300">
                Ya quedó registrado. Ahora se abrirá WhatsApp para confirmar el
                inicio y coordinar próximos pasos.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Razón social / Nombre comercial"
                  value={form.razonSocial}
                  onChange={(value) => update("razonSocial", value)}
                />
                <Input
                  label="CUIT"
                  value={form.cuit}
                  onChange={(value) => update("cuit", value)}
                />
                <Input
                  label="Actividad / Rubro"
                  value={form.actividad}
                  onChange={(value) => update("actividad", value)}
                />
                <Input
                  label="Responsable operativo"
                  value={form.responsable}
                  onChange={(value) => update("responsable", value)}
                />
                <Input
                  label="Teléfono"
                  value={form.telefono}
                  onChange={(value) => update("telefono", value)}
                />
                <Input
                  label="Email"
                  value={form.email}
                  onChange={(value) => update("email", value)}
                />
                <Input
                  label="Cantidad aproximada de empleados"
                  value={form.empleados}
                  onChange={(value) => update("empleados", value)}
                />
                <Input
                  label="Facturación aproximada mensual"
                  value={form.facturacion}
                  onChange={(value) => update("facturacion", value)}
                />
              </div>

              <Textarea
                label="Principal problema operativo/financiero hoy"
                value={form.principalProblema}
                onChange={(value) => update("principalProblema", value)}
              />

              <Input
                label="Link a carpeta de Drive con documentación inicial, si ya existe"
                value={form.driveLink}
                onChange={(value) => update("driveLink", value)}
              />

              <Select
                label="Cómo preferís coordinar accesos sensibles"
                value={form.preferenciaAccesos}
                onChange={(value) => update("preferenciaAccesos", value)}
                options={[
                  "Coordinar por llamada",
                  "Entrega presencial",
                  "Usuario delegado / acceso limitado",
                  "A definir"
                ]}
              />

              <Textarea
                label="Observaciones"
                value={form.observaciones}
                onChange={(value) => update("observaciones", value)}
              />

              <button
                onClick={submit}
                disabled={loading}
                className="mt-4 flex items-center justify-center gap-3 rounded-2xl bg-emerald-400 px-8 py-5 text-sm font-black text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
              >
                {loading ? "Enviando onboarding..." : "Enviar onboarding LF360"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Input({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-300">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition focus:border-emerald-400"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-300">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition focus:border-emerald-400"
      />
    </label>
  );
}

function Select({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-300">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition focus:border-emerald-400"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-slate-950">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}