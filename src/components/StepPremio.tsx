"use client";

import { useEffect, useState } from "react";
import { playClickSound } from "@/lib/sounds";

type ConfettiPiece = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
};

const CONFETTI_COLORS = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96E6A1", "#DDA0DD", "#FF8C00", "#00CED1"];

function generateConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 3,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: 6 + Math.random() * 10,
  }));
}

type FireworkBurst = {
  id: number;
  cx: number;
  cy: number;
  color: string;
  delay: number;
  size: number;
  rays: number;
};

const FIREWORK_COLORS = ["#0097E0", "#4ECDC4", "#96E6A1", "#FF6B6B", "#FFD700", "#DDA0DD"];

function generateFireworks(count: number): FireworkBurst[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    cx: 5 + Math.random() * 90,
    cy: 15 + Math.random() * 70,
    color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
    delay: Math.random() * 4,
    size: 50 + Math.random() * 80,
    rays: 12 + Math.floor(Math.random() * 8),
  }));
}

type Props = {
  premio: string;
  onReset: () => void;
};

export default function StepPremio({ premio, onReset }: Props) {
  const [confetti] = useState(() => generateConfetti(50));
  const [fireworks] = useState(() => generateFireworks(8));
  const [show, setShow] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
  }, []);

  return (
    <section className="relative flex min-h-full flex-col overflow-hidden bg-gradient-to-b from-[#1a0a3e] via-[#2d1b69] to-[#1a0a3e]">
      {/* Confetti */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute z-30 pointer-events-none"
          style={{
            left: `${piece.left}%`,
            top: "-20px",
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: piece.size > 12 ? "50%" : "2px",
            animation: `confetti-fall ${piece.duration}s linear ${piece.delay}s infinite`,
          }}
        />
      ))}

      {/* Firework bursts (radial lines) */}
      {fireworks.map((fw) => (
        <svg
          key={fw.id}
          className="absolute pointer-events-none z-20"
          style={{
            left: `${fw.cx}%`,
            top: `${fw.cy}%`,
            width: fw.size,
            height: fw.size,
            marginLeft: -fw.size / 2,
            marginTop: -fw.size / 2,
            animation: `firework 3s ease-out ${fw.delay}s infinite`,
          }}
          viewBox="0 0 100 100"
        >
          {Array.from({ length: fw.rays }).map((_, j) => {
            const angle = (j * 360) / fw.rays;
            const rad = (angle * Math.PI) / 180;
            const x2 = 50 + 45 * Math.cos(rad);
            const y2 = 50 + 45 * Math.sin(rad);
            return (
              <line
                key={j}
                x1="50"
                y1="50"
                x2={x2}
                y2={y2}
                stroke={fw.color}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      ))}

      <div className="relative z-10 flex flex-1 items-center justify-center">
        <div
          className={`flex flex-col items-center justify-center px-8 py-12 transition-all duration-1000 ${
            show ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        >
          <h2
            className="text-4xl md:text-5xl font-bold text-center text-white leading-tight"
            style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
          >
            🎉 ¡Felicitaciones! 🤩
          </h2>
          <h3
            className="text-3xl md:text-4xl font-bold text-center text-yellow-400 mt-3"
            style={{ animation: "pulse-glow 2s ease-in-out 0.5s infinite" }}
          >
            ¡Ganaste {premio}!
          </h3>
          <p className="text-base text-center text-white/70 mt-6 max-w-sm">
            Gracias por participar en nuestra experiencia. Solicita tu obsequio a nuestra anfitriona
          </p>

          <button
            onClick={() => { playClickSound(); onReset(); }}
            className="mt-10 border-2 border-white px-10 py-4 text-base font-bold uppercase text-white tracking-wide rounded-xl transition-all hover:bg-white hover:text-purple active:scale-[0.98]"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </section>
  );
}
