import { dev } from "$app/environment";
import { initializeLucia } from "$lib/auth.server";
import type { DB } from "$lib/db/types";
import type { Handle } from "@sveltejs/kit";
import { Kysely } from "kysely";
import { BunSqliteDialect } from "kysely-bun-sqlite";
import { D1Dialect } from "kysely-d1";

export const handle: Handle = async ({ resolve, event }) => {
  let lucia: import("lucia").Lucia;

  if (!dev) {
    const db = event.platform?.env.DB;
    if (db) {
      const dialect = new D1Dialect({ database: db });
      event.locals.db = new Kysely<DB>({ dialect });

      lucia = await initializeLucia(db);
    } else {
      // when we're built, we're probably on cloudflare
      lucia = await initializeLucia(null as any);
    }
  } else {
    const { Database } = await import("bun:sqlite");
    const db = new Database("db.sqlite");
    event.locals.db = new Kysely<DB>({
      dialect: new BunSqliteDialect({
        database: db,
      }) as any,
    });

    lucia = await initializeLucia(db);
  }

  event.locals.lucia = lucia;

  // copy pasted from https://v3.lucia-auth.com/getting-started/sveltekit
  const sessionId = event.cookies.get(lucia.sessionCookieName);
  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    // sveltekit types deviates from the de-facto standard
    // you can use 'as any' too
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });
  }
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });
  }
  event.locals.user = user;
  event.locals.session = session;
  return resolve(event);
};
