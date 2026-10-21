import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  const body = await request.json();
  const { nombres, email, telefono, empresa, servicios } = body;

  if (!nombres || !email || !telefono || !empresa) {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `Nuevo registro - ${nombres}`,
      html: `
        <h2>Nuevo registro en el sorteo DAIKIN SAEG</h2>
        <p><strong>Nombres:</strong> ${nombres}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Empresa:</strong> ${empresa}</p>
        <p><strong>Servicios interesados:</strong> ${Array.isArray(servicios) ? servicios.join(", ") : "N/A"}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString("es-PE")}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Error al enviar" }, { status: 500 });
  }
}
