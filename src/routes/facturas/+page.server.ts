import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";

export const load: PageServerLoad = async () => {
  const facturas = prisma.facturas.findMany({
    include: {
      cliente: true,
      trackings: true,
    },
    orderBy: [{ factura_id: "desc" }],
  });

  return { facturas };
};
