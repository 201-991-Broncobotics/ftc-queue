import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { zfd } from "zod-form-data";
import isMobilePhone from "validator/es/lib/isMobilePhone";

// export const load: PageServerLoad = async ({ platform, locals, request }) => { };

export const actions = {
  phone: async ({ locals, request }) => {
    if (!locals.user) throw redirect(302, "/login");

    const schema = zfd.formData({
      tel: zfd
        .text()
        .refine((val) => isMobilePhone(val, "any", { strictMode: true })),
    });

    const data = schema.safeParse(await request.formData());

    if (!data.success) {
      return fail(400);
    }

    const { tel } = data.data;

    await locals.db
      .updateTable("Users")
      .set({ phone_number: tel })
      .where("id", "=", locals.user.id)
      .execute();

    return { success: true };
  },
} satisfies Actions;
