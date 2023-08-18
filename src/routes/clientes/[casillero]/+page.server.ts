import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";
import { redirect, error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, params }) => {
  const { user } = await locals.auth.validateUser();

  if (!user) {
    throw redirect(302, "/login");
  }

  let usuario;
  if (parseInt(params.casillero)) {
    usuario = await prisma.usuarios.findFirst({
      where: {
        casillero: {
          equals: parseInt(params.casillero),
        },
      },
    });
  }

  if (!usuario) throw error(404, "Cliente No Encontrado");
  return { usuario };
};
