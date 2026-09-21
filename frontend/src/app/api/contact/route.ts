import { NextResponse } from "next/server";
import { Resend } from "resend";

import { contactSchema } from "@/lib/contactSchema";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          status: 400,
          message: "Los datos enviados no son válidos.",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      contactNumber,
      subject,
      message,
    } = result.data;

    const { error } = await resend.emails.send({
      from: "StudySync <onboarding@resend.dev>",
      to: ["studysync.grupoj@gmail.com"],
      replyTo: email,
      subject: `[StudySync Contact] ${subject}`,
      text: `
Nuevo mensaje recibido desde StudySync

Nombre: ${name}
Correo: ${email}
Teléfono: ${contactNumber ?? "No proporcionado"}

Asunto:
${subject}

Mensaje:
${message}
      `.trim(),
    });

    if (error) {
      console.error("[CONTACT RESEND ERROR]", error);

      return NextResponse.json(
        {
          status: 502,
          message: "No fue posible enviar el mensaje.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        status: 200,
        message: "Mensaje enviado correctamente.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[CONTACT ERROR]", error);

    return NextResponse.json(
      {
        status: 500,
        message: "No fue posible procesar el mensaje.",
      },
      { status: 500 }
    );
  }
}