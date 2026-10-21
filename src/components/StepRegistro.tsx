"use client";

import { useState } from "react";
import type { FormData } from "@/app/page";

type Props = {
  onSubmit: (data: FormData) => void;
};

export default function StepRegistro({ onSubmit }: Props) {
  const [form, setForm] = useState<FormData>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      // TODO: handle error
    }

    setLoading(false);
    onSubmit(form);
  };

  return (
    <section className="flex h-full items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center">Regístrate</h1>

        <input
          name="nombre"
          type="text"
          placeholder="Nombre"
          required
          value={form.nombre}
          onChange={handleChange}
          className="w-full rounded-lg border px-4 py-3 text-lg"
        />
        <input
          name="apellido"
          type="text"
          placeholder="Apellido"
          required
          value={form.apellido}
          onChange={handleChange}
          className="w-full rounded-lg border px-4 py-3 text-lg"
        />
        <input
          name="email"
          type="email"
          placeholder="Correo electrónico"
          required
          value={form.email}
          onChange={handleChange}
          className="w-full rounded-lg border px-4 py-3 text-lg"
        />
        <input
          name="telefono"
          type="tel"
          placeholder="Teléfono"
          required
          value={form.telefono}
          onChange={handleChange}
          className="w-full rounded-lg border px-4 py-3 text-lg"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black py-4 text-lg font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Registrando..." : "Registrarme y continuar"}
        </button>
      </form>
    </section>
  );
}
