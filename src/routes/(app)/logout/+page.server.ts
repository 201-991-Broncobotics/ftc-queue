import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
  default: async ({ locals: { session, lucia }, cookies }) => {
    if (!session) {
      return fail(401);
    }

    await lucia.invalidateSession(session.id);
    const newSession = lucia.createBlankSessionCookie();

    cookies.set(newSession.name, newSession.value, {
      path: ".",
      ...newSession.attributes,
    });

    throw redirect(302, "/login");
  },
};
