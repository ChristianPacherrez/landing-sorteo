"use client";

import Image from "next/image";
import Header from "@/components/Header";
import { playClickSound } from "@/lib/sounds";

type Props = {
  onContinue: () => void;
};

export default function StepQR({ onContinue }: Props) {
  return (
    <section className="relative flex min-h-full flex-col">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/image-background.webp')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/95 via-primary/90 to-primary/85" />

      <div className="relative z-10 flex flex-col min-h-full">
        <Header />

        <div className="flex-1 flex flex-col items-center px-8 py-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mt-2">
            ¡Sigamos conectados!
          </h2>
          <p className="text-base text-center text-white/80 mt-2 mb-8">
            Registra tus datos y participa de un obsequio
            <br />especial de DAIKIN SAEG
          </p>

          <div className="flex items-start gap-8">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Image
                  src="/icons/logo-instagram.svg"
                  alt="Instagram"
                  width={32}
                  height={32}
                />
                <span className="text-sm font-semibold text-white">@daikin.peru</span>
              </div>
              <div className="rounded-xl bg-white p-3">
                <Image
                  src="/icons/qr-instagram.svg"
                  alt="QR Instagram"
                  width={180}
                  height={180}
                />
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Image
                  src="/icons/logo-linkedin.svg"
                  alt="LinkedIn"
                  width={32}
                  height={32}
                />
                <span className="text-sm font-semibold text-white">Daikin Peru</span>
              </div>
              <div className="rounded-xl bg-white p-3">
                <Image
                  src="/icons/qr-linkedin.svg"
                  alt="QR LinkedIn"
                  width={180}
                  height={180}
                />
              </div>
            </div>
          </div>

          <p className="text-base text-center text-white/90 font-medium mt-8 mb-3">
            Escanea y descarga nuestro portafolio
          </p>
          <div className="rounded-xl bg-white p-3">
            <Image
              src="/images/qr-portafolio.png"
              alt="QR Portafolio"
              width={180}
              height={180}
            />
          </div>

          <button
            onClick={() => { playClickSound(); onContinue(); }}
            className="mt-8 border-2 border-white px-10 py-3.5 text-base font-bold uppercase text-white tracking-wide transition-all hover:bg-white hover:text-primary active:scale-[0.98]"
          >
            ¡Ya los sigo! Ir a la ruleta
          </button>
        </div>
      </div>
    </section>
  );
}
