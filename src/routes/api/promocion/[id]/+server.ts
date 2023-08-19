import type { RequestEvent } from "./$types";
import { prisma } from "$lib/server/prisma";

export const GET = async ({ params }: RequestEvent) => {
  const id = params.id;

  let cliente;
  if (id.length > 0) {
    cliente = await prisma.promocion.findUnique({
      where: {
        cliente_id: parseInt(id),
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
