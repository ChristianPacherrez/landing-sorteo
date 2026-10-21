import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sorteo - Registro",
  description: "Regístrate y participa en nuestro sorteo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
