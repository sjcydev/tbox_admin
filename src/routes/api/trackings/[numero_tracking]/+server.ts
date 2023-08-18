import type { RequestEvent } from "./$types";
import { prisma } from "$lib/server/prisma";

export const GET = async ({ params }: RequestEvent) => {
  const numero = params.numero_tracking;

  let tracking;
  if (numero.length > 0) {
    tracking = await prisma.trackings.findFirst({
      where: {
        numero_tracking: {
          equals: numero,
        },
      },
      include: {
        factura: {
          include: {
            cliente: true,
            trackings: true,
          },
        },
      },
    });
  }

  return new Response(
    JSON.stringify({
      tracking,
    }),
    {
      headers: { "Content-Type": "application/json", Location: "/" },
      status: 200,
    }
  );
};
