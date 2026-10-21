"use client";

import { useState } from "react";
import StepRegistro from "@/components/StepRegistro";
import StepQR from "@/components/StepQR";
import StepRuleta from "@/components/StepRuleta";
import StepPremio from "@/components/StepPremio";

export type FormData = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
};

export default function Home() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
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
    setFormData({ nombre: "", apellido: "", email: "", telefono: "" });
    setPremio("");
    setStep(1);
  };

  return (
    <main className="h-screen w-screen overflow-hidden">
      {step === 1 && <StepRegistro onSubmit={handleRegistro} />}
      {step === 2 && <StepQR onContinue={handleQRContinue} />}
      {step === 3 && <StepRuleta onPremio={handlePremio} />}
      {step === 4 && <StepPremio premio={premio} onReset={handleReset} />}
    </main>
  );
}
