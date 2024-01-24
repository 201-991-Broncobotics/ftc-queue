import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (({ locals }) => {
  if (!locals.user) throw redirect(302, "/login");

  return {
    user: locals.user,
  };
}) satisfies LayoutServerLoad;
