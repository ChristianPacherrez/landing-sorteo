"use client";

type Props = {
  premio: string;
  onReset: () => void;
};

export default function StepPremio({ premio, onReset }: Props) {
  return (
    <section className="flex h-full flex-col items-center justify-center gap-8 p-8">
      <h2 className="text-3xl font-bold text-center">🎉 ¡Felicidades!</h2>
      <p className="text-xl text-center">Ganaste:</p>
      <div className="rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 px-12 py-8">
        <p className="text-3xl font-bold text-white text-center">{premio}</p>
      </div>

      <button
        onClick={onReset}
        className="mt-8 rounded-lg bg-black px-12 py-4 text-lg font-semibold text-white"
      >
        Volver al inicio
      </button>
    </section>
  );
}
