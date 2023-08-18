import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";
import { redirect } from "@sveltejs/kit";

import type { Actions } from "@sveltejs/kit";
import { auth } from "$lib/server/lucia";

export const actions: Actions = {
  logout: async ({ locals }) => {
    const { session } = await locals.auth.validateUser();
    await auth.invalidateSession(session.sessionId);
    locals.auth.setSession(null);
    throw redirect(302, "/login");
  },
};

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = await locals.auth.validateUser();

  if (!user) {
    throw redirect(302, "/login");
  }

  if (user && !user.password_updated) {
    throw redirect(302, "/password_update");
  }

  const usuarios = prisma.usuarios.findMany({
    orderBy: [
      {
        casillero: "asc",
      },
    ],
  });

  return { usuarios };
};
