import type { RequestEvent } from "./$types";
import { prisma } from "$lib/server/prisma";

export const POST = async ({ request }: RequestEvent) => {
  let { info, id, total } = await request.json();
  const fecha = new Date().toLocaleDateString("en-GB");

  info.trackings = info.trackings.map((tracking: Trackings) => {
    return {
      numero_tracking: tracking.numero_tracking,
      precio: tracking.precio,
      base: tracking.base,
      peso: tracking.peso,
    };
  });

  const factura = await prisma.facturas.create({
    data: {
      casillero: id,
      trackings: {
        create: info.trackings satisfies Trackings,
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
