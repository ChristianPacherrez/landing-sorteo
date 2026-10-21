"use client";

type Props = {
  onContinue: () => void;
};

export default function StepQR({ onContinue }: Props) {
  return (
    <section className="flex h-full flex-col items-center justify-center gap-8 p-8">
      <h2 className="text-3xl font-bold text-center">Síguenos en redes</h2>
      <p className="text-lg text-center text-gray-600">
        Escanea los códigos QR para seguirnos
      </p>

      <div className="flex gap-8">
        {/* TODO: Replace with actual QR images from Figma design */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-48 w-48 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400">
            QR Instagram
          </div>
          <span className="text-sm font-medium">Instagram</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="h-48 w-48 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400">
            QR TikTok
          </div>
          <span className="text-sm font-medium">TikTok</span>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="mt-4 rounded-lg bg-black px-12 py-4 text-lg font-semibold text-white"
      >
        Continuar
      </button>
    </section>
  );
}
