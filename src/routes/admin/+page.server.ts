import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { zfd } from "zod-form-data";
import { z } from "zod";
import isMobilePhone from "validator/es/lib/isMobilePhone";
import { nanoid } from "$lib/nanoid.server";
import { parseURL } from "ufo";
import { toa } from "$lib/toa.server";

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

  createComp: async ({ locals, request }) => {
    if (!locals.user) throw redirect(302, "/login");

    const schema = zfd.formData({
      toaLink: zfd.text(z.string().url()),
    });

    const data = schema.safeParse(await request.formData());
    if (!data.success) {
      return fail(400);
    }

    const { toaLink } = data.data;
    const { pathname } = parseURL(toaLink);
    // checks that the link is a valid /events/[toa_id]/[...other] link
    if (!/\/events\/\d{4}-\w{1,}-\w{1,}(\/\w*)?/.test(toaLink)) {
      return fail(400);
    }

    const toa_id = pathname.split("/")[2]!;
    // check 2 that it's valid toa_id
    try {
      await toa.getEvent(toa_id);
    } catch (_) {
      return fail(400);
    }

    await locals.db.transaction().execute(async (trx) => {
      const comp_id = nanoid();

      await trx
        .insertInto("Competitions")
        .values({
          secret: nanoid(8),
          toa_id,
          id: comp_id,
        })
        .execute();

      await trx
        .insertInto("_CompetitionsToUsers")
        .values({
          A: comp_id,
          B: locals.user?.id!,
        })
        .execute();
    });
  },
} satisfies Actions;
