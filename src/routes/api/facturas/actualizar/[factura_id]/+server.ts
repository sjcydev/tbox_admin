import type { RequestEvent } from "./$types";
import { prisma } from "$lib/server/prisma";

export const POST = async ({ request, params }: RequestEvent) => {
  const { pagado } = await request.json();

  try {
    const updated = await prisma.facturas.update({
      where: {
        factura_id: parseInt(params.factura_id),
      },
      data: {
        pagado: !pagado,
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
      message: "Factura Actualizada",
      status: "success",
    }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    }
  );
};
