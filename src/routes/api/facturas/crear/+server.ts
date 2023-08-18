import type { RequestEvent } from "./$types";
import { prisma } from "$lib/server/prisma";

export const POST = async ({ request }: RequestEvent) => {
  const { info, id, total } = await request.json();
  const fecha = new Date().toLocaleDateString("en-GB");

  const factura = await prisma.facturas.create({
    data: {
      casillero: id,
      trackings: {
        create: info.trackings,
      },
      fecha,
      total,
    },
  });

  return new Response(
    JSON.stringify({
      message: "Factura Creada",
      status: "success",
      factura_id: factura.factura_id,
    }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    }
  );
};
