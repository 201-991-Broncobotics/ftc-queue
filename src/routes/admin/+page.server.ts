import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { zfd } from "zod-form-data";
import { z } from "zod";
import isMobilePhone from "validator/lib/isMobilePhone";
import { nanoid } from "$lib/nanoid.server";
import { parseURL } from "ufo";
import { toa } from "$lib/toa.server";
import { sql } from "kysely";

export const load = (async ({ locals }) => {
  if (!locals.user) throw redirect(302, "/login");

  const comps = await locals.db
    .selectFrom("Competitions")
    .innerJoin(
      "_CompetitionsToUsers",
      "Competitions.id",
      "_CompetitionsToUsers.A",
    )
    .select(["Competitions.id as comp_id", "Competitions.name as comp_name"])
    .where("_CompetitionsToUsers.B", "=", locals.user.id)
    .select(() => [
      // no idea how to do this in kysely syntax, but this works so idrc
      sql<number>`(SELECT COUNT(*) FROM Matches WHERE competition_id = Competitions.id AND Matches.is_done = 1)`.as(
        "done_matches",
      ),
      sql<number>`(SELECT COUNT(*) FROM Matches WHERE competition_id = Competitions.id AND Matches.is_queuing = 1 AND Matches.is_done = 0)`.as(
        "queueing_matches",
      ),
      sql<number>`(SELECT COUNT(*) FROM Matches WHERE competition_id = Competitions.id)`.as(
        "total_matches",
      ),
    ])
    .execute();

  return {
    comps: comps,
  };
}) satisfies PageServerLoad;

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
    let eventName: string;
    try {
      eventName = (await toa.getEvent(toa_id)).eventName;
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
          name: eventName,
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

  joinComp: async ({ locals, request }) => {
    if (!locals.user) throw redirect(302, "/login");
    const data = zfd
      .formData({
        secret: zfd.text(z.string().min(3)),
      })
      .safeParse(await request.formData());

    if (!data.success) {
      return fail(402);
    }

    const { secret } = data.data;

    const comp = await locals.db
      .selectFrom("Competitions")
      .where("secret", "=", secret)
      .select(["id"])
      .executeTakeFirst();

    if (!comp) return fail(404);

    await locals.db
      .insertInto("_CompetitionsToUsers")
      .values({
        A: comp.id,
        B: locals.user.id,
      })
      .execute();

    return redirect(302, "/admin");
  },
} satisfies Actions;
