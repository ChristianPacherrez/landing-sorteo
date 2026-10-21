"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";

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

type FireworkDot = {
  id: number;
  cx: number;
  cy: number;
  color: string;
  delay: number;
  size: number;
};

function generateFireworks(count: number): FireworkDot[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    cx: 10 + Math.random() * 80,
    cy: 10 + Math.random() * 60,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    delay: Math.random() * 4,
    size: 40 + Math.random() * 60,
  }));
}

type Props = {
  premio: string;
  onReset: () => void;
};

export default function StepPremio({ premio, onReset }: Props) {
  const [confetti] = useState(() => generateConfetti(50));
  const [fireworks] = useState(() => generateFireworks(12));
  const [show, setShow] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
  }, []);

  return (
    <section className="relative flex h-full flex-col overflow-hidden bg-gradient-to-b from-[#1a0a3e] via-[#2d1b69] to-[#1a0a3e]">
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

      {/* Fireworks */}
      {fireworks.map((fw) => (
        <div
          key={fw.id}
          className="absolute pointer-events-none z-20"
          style={{
            left: `${fw.cx}%`,
            top: `${fw.cy}%`,
            width: fw.size,
            height: fw.size,
            borderRadius: "50%",
            border: `2px solid ${fw.color}`,
            animation: `firework 2s ease-out ${fw.delay}s infinite`,
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col h-full">
        <Header />

        <div
          className={`flex-1 flex flex-col items-center justify-center px-6 transition-all duration-1000 ${
            show ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        >
          <p className="text-5xl mb-2">🎉</p>
          <h2
            className="text-3xl md:text-4xl font-bold text-center text-white"
            style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
          >
            ¡Felicitaciones! 🤩
          </h2>
          <h3
            className="text-2xl md:text-3xl font-bold text-center text-yellow-400 mt-2"
            style={{ animation: "pulse-glow 2s ease-in-out 0.5s infinite" }}
          >
            Ganaste un {premio}
          </h3>
          <p className="text-sm text-center text-white/70 mt-4 max-w-xs">
            Gracias por participar en nuestra experiencia. Solicita tu obsequio a nuestra anfitriona
          </p>

          <button
            onClick={onReset}
            className="mt-8 border-2 border-white px-8 py-3 text-sm font-bold uppercase text-white tracking-wide transition-all hover:bg-white hover:text-purple active:scale-[0.98]"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </section>
  );
}
