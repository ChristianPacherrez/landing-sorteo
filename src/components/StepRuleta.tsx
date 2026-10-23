"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import { playClickSound } from "@/lib/sounds";

const PREMIOS = [
  { nombre: "Tomatodo", imagen: "/images/tomatodo.webp", type: "prize" },
  { nombre: "Gira una vez más", imagen: "/icons/cambiar.svg", type: "retry" },
  { nombre: "Gota antiestrés", imagen: "/images/gota-antiestres.webp", type: "prize" },
  { nombre: "Gira una vez más", imagen: "/icons/cambiar.svg", type: "retry" },
  { nombre: "Kit Completo", imagen: "/images/kit-completo.webp", type: "prize" },
  { nombre: "Gira una vez más", imagen: "/icons/cambiar.svg", type: "retry" },
];

const SEGMENT_ANGLE = 360 / PREMIOS.length;

const SEGMENT_COLORS = [
  "#0097E0",
  "#2AABE8",
  "#0097E0",
  "#2AABE8",
  "#0097E0",
  "#2AABE8",
];

function getWeightedPrizeIndex(): number {
  const weights = [40, 20, 20, 10, 5, 5];
  const total = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    random -= weights[i];
    if (random <= 0) return i;
  }
  return 0;
}

function splitText(text: string): string[] {
  const words = text.split(" ");
  if (words.length <= 2) return [text];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

type Props = {
  onPremio: (premio: string) => void;
};

export default function StepRuleta({ onPremio }: Props) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<SVGSVGElement>(null);

  const spin = () => {
    if (spinning) return;
    playClickSound();
    setSpinning(true);

    const winnerIndex = getWeightedPrizeIndex();
    const targetAngle = SEGMENT_ANGLE * winnerIndex + SEGMENT_ANGLE / 2;
    const fullSpins = 5 * 360;
    const finalRotation = rotation + fullSpins + (360 - targetAngle);

    setRotation(finalRotation);

    setTimeout(() => {
      const premio = PREMIOS[winnerIndex];
      setSpinning(false);
      if (premio.type === "retry") {
        // allow spinning again
      } else {
        onPremio(premio.nombre);
      }
    }, 5000);
  };

  return (
    <section className="relative flex min-h-full flex-col overflow-hidden">
      {/* Bicolor background: white top, blue bottom */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-[40%] bg-white" />
        <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-primary" />
      </div>

      <div className="relative z-10 flex flex-col min-h-full">
        <Header />

        <div className="flex-1 flex flex-col items-center px-6 pt-6 pb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-dark">
            ¡Llego tu turno!
          </h2>
          <p className="text-base text-center text-gray-500 mt-2 mb-6">
            Gira la ruleta y descubre que obsequio te llevas
          </p>

          {/* Wheel + base container */}
          <div className="relative flex flex-col items-center flex-1 w-full">
            {/* Wheel wrapper */}
            <div className="relative w-[440px] h-[440px] md:w-[500px] md:h-[500px] flex-shrink-0 z-10">
              {/* Pointer triangle */}
              <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 z-20">
                <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-t-[28px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg" />
              </div>

              {/* Wheel */}
              <svg
                ref={wheelRef}
                viewBox="0 0 400 400"
                className="w-full h-full drop-shadow-2xl"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning
                    ? "transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                    : "none",
                }}
              >
                {/* Outer ring */}
                <circle cx="200" cy="200" r="198" fill="#1a3a5c" />
                <circle cx="200" cy="200" r="190" fill="none" stroke="#2a5a8c" strokeWidth="2" />

                {/* Segments */}
                {PREMIOS.map((premio, i) => {
                  const startAngle = i * SEGMENT_ANGLE - 90;
                  const endAngle = startAngle + SEGMENT_ANGLE;
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;
                  const r = 185;
                  const x1 = 200 + r * Math.cos(startRad);
                  const y1 = 200 + r * Math.sin(startRad);
                  const x2 = 200 + r * Math.cos(endRad);
                  const y2 = 200 + r * Math.sin(endRad);
                  const midAngle = startAngle + SEGMENT_ANGLE / 2;
                  const textR = 145;
                  const textRad = (midAngle * Math.PI) / 180;
                  const tx = 200 + textR * Math.cos(textRad);
                  const ty = 200 + textR * Math.sin(textRad);
                  const imgR = 110;
                  const imgRad = (midAngle * Math.PI) / 180;
                  const imgX = 200 + imgR * Math.cos(imgRad);
                  const imgY = 200 + imgR * Math.sin(imgRad);
                  const lines = splitText(premio.nombre.toUpperCase());

                  return (
                    <g key={i}>
                      <path
                        d={`M200,200 L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
                        fill={SEGMENT_COLORS[i]}
                        stroke="#1a3a5c"
                        strokeWidth="1"
                      />
                      <image
                        href={premio.imagen}
                        x={imgX - 22}
                        y={imgY - 22}
                        width="44"
                        height="44"
                        transform={`rotate(${midAngle + 90}, ${imgX}, ${imgY})`}
                      />
                      <text
                        x={tx}
                        y={ty}
                        fill="white"
                        fontSize="13"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${midAngle + 90}, ${tx}, ${ty})`}
                      >
                        {lines.length === 1 ? (
                          lines[0]
                        ) : (
                          <>
                            <tspan x={tx} dy="-0.6em">{lines[0]}</tspan>
                            <tspan x={tx} dy="1.2em">{lines[1]}</tspan>
                          </>
                        )}
                      </text>
                    </g>
                  );
                })}

                {/* Decorative dots on outer ring */}
                {Array.from({ length: 24 }).map((_, i) => {
                  const angle = (i * 15 * Math.PI) / 180;
                  const cx = 200 + 193 * Math.cos(angle);
                  const cy = 200 + 193 * Math.sin(angle);
                  return (
                    <circle
                      key={i}
                      cx={cx}
                      cy={cy}
                      r="3.5"
                      fill={i % 2 === 0 ? "#FFD700" : "#ffffff"}
                    />
                  );
                })}
              </svg>

              {/* Center button */}
              <button
                onClick={spin}
                disabled={spinning}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-24 h-24 rounded-full bg-gradient-to-b from-[#1a3a5c] to-[#0d2137] border-4 border-[#2a5a8c] text-white font-bold text-base uppercase shadow-xl transition-transform active:scale-95 disabled:opacity-70"
              >
                GIRAR
              </button>
            </div>

            {/* SVG Base/pedestal */}
            <div className="relative w-[387px] md:w-[440px] -mt-16 z-0" style={{ mixBlendMode: "multiply" }}>
              <svg viewBox="0 0 387 335" fill="none" className="w-full h-auto">
                <g style={{ mixBlendMode: "multiply" }}>
                  <path d="M311.255 250.642L287.015 113.596L266.923 0H230.934H156.061H120.071L75.7451 250.642L61.0403 333.779H156.061H230.934H325.96L311.255 250.642Z" fill="#0097E0"/>
                </g>
                <path d="M387 335H0C0 297.325 30.608 266.784 68.3643 266.784H318.631C356.387 266.784 386.995 297.325 386.995 335H387Z" fill="#004F73"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
