"use client";

import { useState } from "react";
import type { FormData } from "@/app/page";
import Header from "@/components/Header";
import { playClickSound } from "@/lib/sounds";

const SERVICIOS_OPTIONS = [
  "Aire acondicionado residencial",
  "Climatización comercial",
  "Sistemas VRV/VRF",
  "Ventilación y calidad de aire",
  "Mantenimiento preventivo",
];

type Props = {
  onSubmit: (data: FormData) => void;
};

export default function StepRegistro({ onSubmit }: Props) {
  const [form, setForm] = useState<FormData>({
    nombres: "",
    email: "",
    telefono: "",
    empresa: "",
    servicios: [],
  });
  const [acepta, setAcepta] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showServicios, setShowServicios] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "nombres") {
      const cleaned = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, "");
      setForm({ ...form, [name]: cleaned });
      return;
    }
    if (name === "telefono") {
      const cleaned = value.replace(/[^0-9+\-\s]/g, "");
      setForm({ ...form, [name]: cleaned });
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const toggleServicio = (servicio: string) => {
    setForm((prev) => ({
      ...prev,
      servicios: prev.servicios.includes(servicio)
        ? prev.servicios.filter((s) => s !== servicio)
        : [...prev.servicios, servicio],
    }));
  };

  const isValid =
    form.nombres.trim() &&
    form.email.trim() &&
    form.telefono.trim() &&
    form.empresa.trim() &&
    form.servicios.length > 0 &&
    acepta;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);

    try {
      await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      // continue to next step even if email fails
    }

    setLoading(false);
    playClickSound();
    onSubmit(form);
  };

  return (
    <section className="relative flex min-h-full flex-col">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/image-background.webp')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-transparent" />

      <div className="relative z-10 flex flex-col min-h-full">
        <Header />

        <div className="flex-1 px-8 pb-10">
          <div className="mx-auto max-w-md">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-dark mt-6 leading-tight">
              ¡Bienvenido a nuestra experiencia!
            </h1>
            <p className="text-base text-center text-gray-600 mt-3 mb-8">
              Registra tus datos y participa de un obsequio especial de DAIKIN SAEG
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700">Nombres y apellidos*</label>
                <input
                  name="nombres"
                  type="text"
                  required
                  value={form.nombres}
                  onChange={handleChange}
                  className="w-full border border-gray-300 bg-white/70 px-4 py-3.5 text-base text-dark outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Correo electrónico*</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 bg-white/70 px-4 py-3.5 text-base text-dark outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Teléfono*</label>
                <input
                  name="telefono"
                  type="tel"
                  required
                  value={form.telefono}
                  onChange={handleChange}
                  className="w-full border border-gray-300 bg-white/70 px-4 py-3.5 text-base text-dark outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Empresa*</label>
                  <input
                    name="empresa"
                    type="text"
                    required
                    value={form.empresa}
                    onChange={handleChange}
                    className="w-full border border-gray-300 bg-white/70 px-4 py-3.5 text-base text-dark outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Interesado en*</label>
                  <button
                    type="button"
                    onClick={() => setShowServicios(!showServicios)}
                    className="w-full border border-gray-300 bg-white/70 px-4 py-3.5 text-base text-left text-dark outline-none focus:border-primary"
                  >
                    {form.servicios.length > 0
                      ? `${form.servicios.length} seleccionado(s)`
                      : "Seleccionar"}
                  </button>
                </div>
              </div>

              {showServicios && (
                <div className="rounded-lg bg-white/90 p-4 shadow-lg backdrop-blur">
                  {SERVICIOS_OPTIONS.map((servicio) => (
                    <label
                      key={servicio}
                      className="flex items-center gap-3 py-2 text-base text-dark cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={form.servicios.includes(servicio)}
                        onChange={() => toggleServicio(servicio)}
                        className="h-5 w-5 rounded accent-primary"
                      />
                      {servicio}
                    </label>
                  ))}
                </div>
              )}

              <label className="flex items-start gap-3 cursor-pointer mt-3">
                <input
                  type="checkbox"
                  checked={acepta}
                  onChange={(e) => setAcepta(e.target.checked)}
                  className="mt-0.5 h-5 w-5 rounded accent-primary"
                />
                <span className="text-sm text-gray-600">
                  Autorizo el tratamiento de mis datos personales para ser contactado por DAIKIN SAEG
                </span>
              </label>

              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={!isValid || loading}
                  className="bg-primary px-12 py-3.5 text-base font-bold uppercase text-white tracking-wide rounded-full disabled:opacity-50 transition-all hover:bg-primary-dark active:scale-[0.98]"
                >
                  {loading ? "Registrando..." : "Registrarme y continuar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
