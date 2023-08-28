import type { RequestEvent } from "./$types";
import { prisma } from "$lib/server/prisma";

export const GET = async ({ params }: RequestEvent) => {
  const casillero = params.id;

  let cliente;
  if (casillero.length > 0) {
    cliente = await prisma.usuarios.findFirst({
      where: {
        casillero: {
          equals: parseInt(casillero),
        },
      },
    });
  }

  return new Response(
    JSON.stringify({
      cliente,
    }),
    {
      headers: { "Content-Type": "application/json", Location: "/" },
      status: 200,
    }
  );
};
export const POST = async ({ request, params }: RequestEvent) => {
  const { usuario } = await request.json();
  let { nombre, apellido, casillero, correo, telefono, precio } = usuario;

  casillero = parseInt(casillero);

  try {
    const updatedCliente = await prisma.usuarios.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        nombre,
        casillero,
        apellido,
        correo,
        telefono,
        precio: Number(precio),
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({
        message: "Hubo un error, contacte al tecnico",
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

  return new Response(
    JSON.stringify({
      message: "Casillero Actualizado",
      status: "success",
    }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    }
  );
};
