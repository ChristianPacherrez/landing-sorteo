"use client";

import Image from "next/image";
import Header from "@/components/Header";

type Props = {
  onContinue: () => void;
};

export default function StepQR({ onContinue }: Props) {
  return (
    <section className="relative flex h-full flex-col">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/image-background.webp')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/95 via-primary/90 to-primary/80" />

      <div className="relative z-10 flex flex-col h-full">
        <Header />

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white">
            ¡Sigamos conectados!
          </h2>
          <p className="text-sm text-center text-white/80 mt-2 mb-8">
            Registra tus datos y participa de un obsequio<br />especial de DAIKIN SAEG
          </p>

          <div className="flex items-start gap-6">
            <div className="flex flex-col items-center gap-3">
              <Image
                src="/icons/logo-instagram.svg"
                alt="Instagram"
                width={44}
                height={44}
              />
              <div className="rounded-xl bg-white p-3">
                <Image
                  src="/icons/qr-instagram.svg"
                  alt="QR Instagram"
                  width={160}
                  height={160}
                />
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <Image
                src="/icons/logo-linkedin.svg"
                alt="LinkedIn"
                width={44}
                height={44}
              />
              <div className="rounded-xl bg-white p-3">
                <Image
                  src="/icons/qr-linkedin.svg"
                  alt="QR LinkedIn"
                  width={160}
                  height={160}
                />
              </div>
            </div>
          </div>

          <button
            onClick={onContinue}
            className="mt-10 rounded-full border-2 border-white px-8 py-3 text-sm font-bold uppercase text-white tracking-wide transition-all hover:bg-white hover:text-primary active:scale-[0.98]"
          >
            ¡Ya los sigo! Ir a la ruleta
          </button>
        </div>
      </div>
    </section>
  );
}
