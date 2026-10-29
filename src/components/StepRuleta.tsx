"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Header from "@/components/Header";

const DEBUG = process.env.NODE_ENV === "development";

const PREMIOS = [
  { id: "tomatodo", nombre: "Tomatodo", displayText: "un tomatodo", imagen: "/images/tomatodo.webp", type: "prize" as const, weight: 40 },
  { id: "gira-1", nombre: "Gira una vez más", displayText: "", imagen: "/icons/cambiar.svg", type: "retry" as const, weight: 10 },
  { id: "gota-antiestres", nombre: "Gota antiestrés", displayText: "una gota antiestrés", imagen: "/images/gota-antiestres.webp", type: "prize" as const, weight: 25 },
  { id: "gira-2", nombre: "Gira una vez más", displayText: "", imagen: "/icons/cambiar.svg", type: "retry" as const, weight: 10 },
  { id: "kit-completo", nombre: "Kit completo", displayText: "un kit completo", imagen: "/images/kit-completo.webp", type: "prize" as const, weight: 5 },
  { id: "gira-3", nombre: "Gira una vez más", displayText: "", imagen: "/icons/cambiar.svg", type: "retry" as const, weight: 10 },
];

const NUM_SEGMENTS = PREMIOS.length;
const SEGMENT_ANGLE = 360 / NUM_SEGMENTS;

const SEGMENT_COLORS = [
  "#0097E0", "#2AABE8", "#0097E0", "#2AABE8", "#0097E0", "#2AABE8",
];

let prizeCount = 0;
const KIT_COMPLETO_EVERY = 20 + Math.floor(Math.random() * 11); // entre 20 y 30

function getNextPrizeIndex(): number {
  const RETRY_CHANCE = 0.35; // 35% de probabilidad de "gira otra vez"
  if (Math.random() < RETRY_CHANCE) {
    // Elegir uno de los 3 segmentos de retry (índices 1, 3, 5)
    const retrySlots = [1, 3, 5];
    return retrySlots[Math.floor(Math.random() * retrySlots.length)];
  }
  prizeCount++;
  if (prizeCount >= KIT_COMPLETO_EVERY) {
    prizeCount = 0;
    return 4; // kit-completo
  }
  // Alternar tomatodo (0) y gota antiestrés (2)
  return prizeCount % 2 === 1 ? 0 : 2;
}

function splitText(text: string): string[] {
  const words = text.split(" ");
  if (words.length <= 2) return [text];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

// ── Angle math ──────────────────────────────────────────────────────
//
// Segments are drawn clockwise from −90° (12 o'clock).
// Segment i occupies: [i × 60° − 90°,  (i+1) × 60° − 90°)
// Segment i center:   i × 60° − 60°
//
// Pointer is fixed at the top (−90° / 270°).
//
// After rotating the wheel R° clockwise (CSS rotate), the unrotated
// angle now under the pointer is:  −R  (mod 360, offset from −90°).
// The segment there:  floor( ((−R mod 360) + 360) % 360  /  60 )
//
// To land segment i's center under the pointer:
//   R ≡ 330 − i × 60   (mod 360)

function getSegmentAtPointer(totalRotation: number): number {
  const offset = (((-totalRotation) % 360) + 360) % 360;
  return Math.floor(offset / SEGMENT_ANGLE);
}

function computeSpinDegrees(winnerIndex: number, startRotation: number): number {
  // Target a random position within the winning segment (±20° from center)
  // so the result looks natural and never lands on a boundary.
  const jitter = (Math.random() - 0.5) * 36;
  const targetMod = ((330 - winnerIndex * SEGMENT_ANGLE + jitter) % 360 + 360) % 360;
  const currentMod = ((startRotation % 360) + 360) % 360;
  let neededOffset = ((targetMod - currentMod) % 360 + 360) % 360;
  if (neededOffset === 0) neededOffset = 360;
  const fullSpins = (6 + Math.floor(Math.random() * 3)) * 360;
  return fullSpins + neededOffset;
}

// ── Web Audio API sound engine ──────────────────────────────────────
let audioCtx: AudioContext | null = null;
function getAudioContext(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function playTickSound(volume = 0.15) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "triangle";
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.03);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  } catch { /* silently fail */ }
}

function playCelebrationSound() {
  try {
    const ctx = getAudioContext();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      const t = ctx.currentTime + i * 0.12;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.start(t);
      osc.stop(t + 0.3);
    });
  } catch { /* silently fail */ }
}

function playRetrySound() {
  try {
    const ctx = getAudioContext();
    [440, 520].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      const t = ctx.currentTime + i * 0.15;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.start(t);
      osc.stop(t + 0.2);
    });
  } catch { /* silently fail */ }
}

function playButtonClickSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch { /* silently fail */ }
}

type Props = {
  onPremio: (premio: string) => void;
};

export default function StepRuleta({ onPremio }: Props) {
  const [spinning, setSpinning] = useState(false);
  const [overlayType, setOverlayType] = useState<"prize" | "retry" | null>(null);
  const [overlayText, setOverlayText] = useState("");
  const wheelRef = useRef<SVGSVGElement>(null);
  const currentRotation = useRef(0);
  const animationRef = useRef<number>(0);
  const timers = useRef<number[]>([]);

  const cleanup = useCallback(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const spin = () => {
    if (spinning) return;
    playButtonClickSound();
    setSpinning(true);
    setOverlayType(null);

    // Step 1: Select winner by weighted probability
    const winnerIndex = getNextPrizeIndex();
    const startRot = currentRotation.current;

    // Step 2-3: Compute rotation to land on that segment
    const totalDegrees = computeSpinDegrees(winnerIndex, startRot);

    const accelDuration = 0.8;
    const sustainDuration = 2.0;
    const decelDuration = 3.5;
    const totalDuration = accelDuration + sustainDuration + decelDuration;

    const startTime = performance.now();

    function easeCustom(t: number): number {
      const t1 = accelDuration / totalDuration;
      const t2 = (accelDuration + sustainDuration) / totalDuration;
      if (t <= t1) {
        const p = t / t1;
        return p * p * t1;
      } else if (t <= t2) {
        return t1 + (t - t1);
      } else {
        const p = (t - t2) / (1 - t2);
        return t1 + (t2 - t1) + (1 - (1 - p) * (1 - p) * (1 - p)) * (1 - t2);
      }
    }

    const maxEase = easeCustom(1);
    let lastSegmentIndex = -1;

    // Step 4: Animate without changing the selected result
    function animate(now: number) {
      const elapsed = (now - startTime) / 1000;
      const t = Math.min(elapsed / totalDuration, 1);
      const progress = easeCustom(t) / maxEase;
      const currentDeg = startRot + totalDegrees * progress;
      currentRotation.current = currentDeg;

      if (wheelRef.current) {
        wheelRef.current.style.transform = `rotate(${currentDeg}deg)`;
      }

      const normalizedDeg = ((currentDeg % 360) + 360) % 360;
      const segIndex = Math.floor(normalizedDeg / SEGMENT_ANGLE);
      if (segIndex !== lastSegmentIndex && lastSegmentIndex !== -1) {
        const speed = t < 0.1 ? t * 10 : t > 0.7 ? Math.max(0.3, 1 - (t - 0.7) / 0.3) : 1;
        playTickSound(0.08 + speed * 0.12);
      }
      lastSegmentIndex = segIndex;

      if (t < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Set exact final position
        const finalRotation = startRot + totalDegrees;
        currentRotation.current = finalRotation;
        if (wheelRef.current) {
          wheelRef.current.style.transform = `rotate(${finalRotation}deg)`;
        }

        // Step 5: Geometric verification — which segment is ACTUALLY at the pointer?
        const visualSegment = getSegmentAtPointer(finalRotation);

        if (DEBUG) {
          const rotMod = ((finalRotation % 360) + 360) % 360;
          console.log(
            `[RULETA] Spin #${Math.round(finalRotation / 360)}\n` +
            `  Selected:  ${PREMIOS[winnerIndex].id} (idx ${winnerIndex})\n` +
            `  Verified:  ${PREMIOS[visualSegment].id} (idx ${visualSegment})\n` +
            `  Start:     ${startRot.toFixed(1)}°\n` +
            `  Added:     ${totalDegrees.toFixed(1)}°\n` +
            `  Final:     ${finalRotation.toFixed(1)}° (mod360: ${rotMod.toFixed(1)}°)\n` +
            `  Match:     ${visualSegment === winnerIndex ? "YES ✓" : "NO ✗ MISMATCH!"}`
          );
        }

        if (visualSegment !== winnerIndex) {
          console.error(
            `[RULETA] MISMATCH! Intended: ${PREMIOS[winnerIndex].id}, ` +
            `Visual: ${PREMIOS[visualSegment].id}, Rotation: ${finalRotation}°`
          );
        }

        // Step 6: ALWAYS use the visually verified segment as the result.
        // This guarantees what the user sees matches what we report.
        const premio = PREMIOS[visualSegment];

        if (premio.type === "retry") {
          playRetrySound();
          setOverlayType("retry");
          const t1 = window.setTimeout(() => {
            setOverlayType(null);
            setSpinning(false);
          }, 2500);
          timers.current.push(t1);
        } else {
          playCelebrationSound();
          setOverlayType("prize");
          setOverlayText(premio.displayText);
          const t1 = window.setTimeout(() => {
            setOverlayType(null);
            setSpinning(false);
            onPremio(premio.displayText);
          }, 2500);
          timers.current.push(t1);
        }
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  return (
    <section className="relative flex min-h-full flex-col overflow-hidden">
      {/* Bicolor background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-[35%] bg-white" />
        <div className="absolute bottom-0 left-0 right-0 h-[65%] bg-primary" />
      </div>

      <div className="relative z-10 flex flex-col min-h-full">
        <Header />

        <div className="flex-1 flex flex-col items-center px-6">
          <div className="pt-4 pb-2 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-dark">
              ¡Llego tu turno!
            </h2>
            <p className="text-base text-gray-500 mt-2">
              Gira la ruleta y descubre qué obsequio te llevas
            </p>
          </div>

          {/* Wheel + Podium area — centered vertically */}
          <div className="flex-1 w-full flex flex-col items-center justify-center relative">
            {/* Wheel + Podium stacked unit */}
            <div className="flex flex-col items-center">
              {/* Wheel */}
              <div className="relative w-[420px] h-[420px] flex-shrink-0 z-10">
                {/* Pointer */}
                <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 z-20">
                  <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-t-[28px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg" />
                </div>

                <svg
                  ref={wheelRef}
                  viewBox="0 0 400 400"
                  className="w-full h-full drop-shadow-2xl"
                  style={{ transition: "none" }}
                >
                  <circle cx="200" cy="200" r="198" fill="#1a3a5c" />
                  <circle cx="200" cy="200" r="190" fill="none" stroke="#2a5a8c" strokeWidth="2" />

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

                  {Array.from({ length: 24 }).map((_, i) => {
                    const angle = (i * 15 * Math.PI) / 180;
                    const cx = 200 + 193 * Math.cos(angle);
                    const cy = 200 + 193 * Math.sin(angle);
                    return (
                      <circle key={i} cx={cx} cy={cy} r="3.5"
                        fill={i % 2 === 0 ? "#FFD700" : "#ffffff"} />
                    );
                  })}
                </svg>

                <button
                  onClick={spin}
                  disabled={spinning}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-24 h-24 rounded-full bg-gradient-to-b from-[#1a3a5c] to-[#0d2137] border-4 border-[#2a5a8c] text-white font-bold text-base uppercase shadow-xl transition-transform active:scale-95 disabled:opacity-70"
                >
                  GIRAR
                </button>
              </div>

              {/* Podium — overlaps behind the lower part of the wheel */}
              <div className="relative z-0 -mt-[220px]" style={{ width: "460px" }}>
                <svg viewBox="0 0 387 335" className="w-full" preserveAspectRatio="xMidYMin meet" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_70_233)">
                    <path d="M311.255 250.642L287.016 113.596L266.924 0H230.934H156.062H120.072L75.7454 250.642L61.0405 333.779H156.062H230.934H325.96L311.255 250.642Z" fill="#0059C5"/>
                    <path d="M387 335H0C0 297.325 30.608 266.784 68.3643 266.784H318.631C356.387 266.784 386.995 297.325 386.995 335H387Z" fill="#004F73"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_70_233">
                      <rect width="387" height="335" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Overlay: prize won or retry */}
            {overlayType && (
              <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                <div className="bg-white/95 rounded-2xl px-10 py-6 shadow-2xl text-center animate-bounce-in">
                  {overlayType === "prize" ? (
                    <>
                      <p className="text-lg font-bold text-primary uppercase tracking-wide">
                        🎉 ¡Ganaste!
                      </p>
                      <p className="text-2xl font-bold text-dark mt-1">
                        {overlayText}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-bold text-primary uppercase tracking-wide">
                        🔄 ¡Otra oportunidad!
                      </p>
                      <p className="text-base text-gray-600 mt-1">
                        Vuelve a girar la ruleta
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
