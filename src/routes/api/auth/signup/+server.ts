import type { RequestEvent } from "./$types";
import { prisma } from "$lib/server/prisma";
import * as SIB from "@sendinblue/client";
import { SECRET_SIB_API_KEY, CODIGO_SECRETO } from "$env/static/private";
import { render } from "svelte-email";
import { auth } from "$lib/server/lucia";
import { generate } from "generate-password";
import NuevoUsuario from "$lib/components/emails/NuevoUsuario.svelte";

export const POST = async ({ request }: RequestEvent) => {
  let { usuario } = await request.json();

  const { nombre, apellido, codigo, username, correo } = usuario as Registro;

  let usedEmail = await prisma.authUser.findUnique({ where: { correo } });
  let password = generate({ length: 12, numbers: true });

  if (usedEmail) {
    return new Response(
      JSON.stringify({
        message: "Correo ya esta registrado",
        status: "warning",
      }),
      {
        headers: { "content-Type": "application/json" },
        status: 400,
      }
    );
  }

  if (codigo !== CODIGO_SECRETO) {
    return new Response(
      JSON.stringify({
        message: "Codigo Secreto invalido, contacte al tecnico.",
        status: "warning",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 401,
      }
    );
  }

  let user;

  try {
    user = await auth.createUser({
      primaryKey: {
        providerId: "username",
        providerUserId: username,
        password,
      },
      attributes: {
        username,
        nombre,
        correo,
        apellido,
        password_updated: false,
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        message: "Nombre de usuario ya esta registrado",
        status: "warning",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }

  try {
    const html = render({
      template: NuevoUsuario,
      props: {
        nombre,
        username,
        password,
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
          email: "developers@logisticdev.com",
          name: "LogisticDev",
        },
        to: [
          {
            email: correo,
          },
        ],
        subject: "Detalles e Instrucciones - Sistema de Facturación",
        htmlContent: html,
      })
      .then((err) => {
        console.log(err);
        return new Response(
          JSON.stringify({ message: err, status: "warning" }),
          {
            headers: { "Content-Type": "application/json" },
            status: 500,
          }
        );
      });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ message: err, status: "warning" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({
      message: "Usuario Registrado Exitosamente!",
      status: "success",
    }),
    {
      headers: { "Content-Type": "application/json" },
      status: 201,
    }
  );
};
