import { redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ platform, locals }) => { };

export const actions = {
  phone_num: async ({ locals }) => {
    if (!locals.user) throw redirect(302, "/login");
  },
} satisfies Actions;
