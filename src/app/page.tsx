"use client";

import { useState } from "react";
import StepRegistro from "@/components/StepRegistro";
import StepQR from "@/components/StepQR";
import StepRuleta from "@/components/StepRuleta";
import StepPremio from "@/components/StepPremio";

export type FormData = {
  nombres: string;
  email: string;
  telefono: string;
  empresa: string;
  servicios: string[];
};

export default function Home() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    nombres: "",
    email: "",
    telefono: "",
    empresa: "",
    servicios: [],
  });
  const [premio, setPremio] = useState("");

  const handleRegistro = (data: FormData) => {
    setFormData(data);
    setStep(2);
  };

  const handleQRContinue = () => {
    setStep(3);
  };

  const handlePremio = (premioGanado: string) => {
    setPremio(premioGanado);
    setStep(4);
  };

  const handleReset = () => {
    setFormData({ nombres: "", email: "", telefono: "", empresa: "", servicios: [] });
    setPremio("");
    setStep(1);
  };

  return (
    <main className="h-screen w-screen flex justify-center bg-gray-900 overflow-hidden">
      {/* Blurred sides on desktop */}
      <div className="hidden lg:block fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center blur-2xl scale-110 opacity-40"
          style={{ backgroundImage: "url('/images/image-background.webp')" }}
        />
        <div className="absolute inset-0 bg-gray-900/60" />
      </div>

      <div className="relative z-10 h-full w-full max-w-[768px] shadow-2xl overflow-y-auto">
        {step === 1 && <StepRegistro onSubmit={handleRegistro} />}
        {step === 2 && <StepQR onContinue={handleQRContinue} />}
        {step === 3 && <StepRuleta onPremio={handlePremio} />}
        {step === 4 && <StepPremio premio={premio} onReset={handleReset} />}
      </div>
    </main>
  );
}
