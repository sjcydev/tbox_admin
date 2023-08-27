import type { RequestEvent } from "./$types";
import { prisma } from "$lib/server/prisma";

export const POST = async ({ request }: RequestEvent) => {
  let { promocion } = await request.json();

  if (promocion.cliente.promocion_id === 0) {
    await prisma.promocion.create({
      data: {
        cliente_id: promocion.cliente.cliente_id,
        libras: promocion.cliente.libras,
      },
    });
  } else {
    await prisma.promocion.update({
      where: {
        cliente_id: promocion.cliente.cliente_id,
      },
      data: {
        libras: promocion.cliente.libras,
      },
    });
  }

  return new Response(null, {
    headers: { "Content-Type": "application/json", Location: "/" },
    status: 200,
  });
};
