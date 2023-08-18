import type { RequestEvent } from "./$types";
import * as SIB from "@sendinblue/client";
import { SECRET_SIB_API_KEY } from "$env/static/private";
import Factura from "$lib/components/emails/Factura.svelte";
import { render } from "svelte-email";

export const POST = async ({ request }: RequestEvent) => {
  let { info, cliente, factura_id, pdf } = await request.json();

  pdf = pdf.split(",")[1];

  try {
    const html = render({
      template: Factura,
      props: {
        nombre: cliente.nombre,
        casillero: info.casillero,
        trackings: info.trackings,
      },
    });
    const text = render({
      template: Factura,
      props: {
        nombre: cliente.nombre,
        casillero: info.casillero,
        trackings: info.trackings,
      },
      options: {
        plainText: true,
      },
    });

    const sibAPI = new SIB.TransactionalEmailsApi();

    sibAPI.setApiKey(
      SIB.TransactionalEmailsApiApiKeys.apiKey,
      SECRET_SIB_API_KEY
    );

    await sibAPI
      .sendTransacEmail({
        sender: {
          email: "facturas@tboxexpress.com",
          name: "TBox Express",
        },
        to: [
          {
            email: cliente.correo,
          },
          {
            email: "sjcydev12@gmail.com",
          },
        ],
        subject: "Tienes paquetes listo para retirar!",
        htmlContent: html,
        textContent: text,
        attachment: [{ content: pdf, name: `Factura-${factura_id}.pdf` }],
      })
      .catch((err) => {
        return new Response(
          JSON.stringify({
            message: "Hubo un error, contacte al tecnico",
            status: "warning",
          }),
          {
            headers: { "Content-Type": "application/json" },
            status: 500,
          }
        );
      });
  } catch (err) {
    return new Response(
      JSON.stringify({
        message: "Hubo un error, contacte al tecnico",
        status: "warning",
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }

  return new Response(
    JSON.stringify({
      message: "Factura Enviada",
      status: "success",
    }),
    {
      headers: { "Content-Type": "application/json" },
      status: 201,
    }
  );
};
