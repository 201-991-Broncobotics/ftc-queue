import { Lucia } from "lucia";
import { Google } from "arctic";
import { dev } from "$app/environment";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private";
import type { D1Database } from "@cloudflare/workers-types";
import type { Database } from "bun:sqlite";
import { D1Adapter, BunSQLiteAdapter } from "@lucia-auth/adapter-sqlite";
import type { DB } from "./db/types";

export async function initializeLucia(db: D1Database | Database) {
  const tableNames = {
    user: "Users",
    session: "Sessions",
  } as const;

  let adapter: D1Adapter | BunSQLiteAdapter;
  if (!dev) {
    // when we're built, we're probably on d1
    adapter = new D1Adapter(db as any, tableNames);
  } else {
    adapter = new BunSQLiteAdapter(db as any, tableNames);
  }

  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        secure: !dev,
      },
    },
    getUserAttributes: ({ pfp_url, name }) => ({ pfp_url, name }),
  });
}

declare module "lucia" {
  interface Register {
    Lucia: Awaited<ReturnType<typeof initializeLucia>>;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

type DatabaseUserAttributes = DB["Users"];

export const redirectURL = dev
  ? "http://localhost:5173/auth/google/callback"
  : "https://q.broncobotics.org/auth/google/callback";

export const google = new Google(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  redirectURL,
);
