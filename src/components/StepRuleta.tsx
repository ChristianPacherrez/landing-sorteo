"use client";

import { useState } from "react";

const PREMIOS = [
  "10% de descuento",
  "Consultoría gratis",
  "Pack de redes",
  "Auditoría digital",
  "15% de descuento",
  "Sesión de fotos",
];

type Props = {
  onPremio: (premio: string) => void;
};

export default function StepRuleta({ onPremio }: Props) {
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);

    const randomIndex = Math.floor(Math.random() * PREMIOS.length);

    setTimeout(() => {
      onPremio(PREMIOS[randomIndex]);
    }, 5000);
  };

  return (
    <section className="flex h-full flex-col items-center justify-center gap-8 p-8">
      <h2 className="text-3xl font-bold text-center">
        ¡Gracias por registrarte!
      </h2>
      <p className="text-lg text-center text-gray-600">
        Gira la ruleta y gana un premio
      </p>

      {/* TODO: Replace with actual roulette wheel component matching Figma */}
      <div className="relative flex h-72 w-72 items-center justify-center rounded-full border-8 border-black bg-gradient-to-br from-yellow-400 to-orange-500">
        <span className="text-2xl font-bold text-white">
          {spinning ? "Girando..." : "🎰"}
        </span>
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className="rounded-lg bg-black px-12 py-4 text-lg font-semibold text-white disabled:opacity-50"
      >
        {spinning ? "Girando..." : "¡Girar la ruleta!"}
      </button>
    </section>
  );
}
