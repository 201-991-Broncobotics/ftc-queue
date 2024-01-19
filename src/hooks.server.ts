import type { DB } from '$lib/db/types';
import type { Handle } from '@sveltejs/kit';
import { Kysely } from 'kysely';
import { BunSqliteDialect } from 'kysely-bun-sqlite';
import { D1Dialect } from 'kysely-d1';

export const handle: Handle = async ({ resolve, event }) => {
  const d1db = event.platform?.env.DB;

  const dialect = d1db
    ? new D1Dialect({ database: d1db })
    : (new BunSqliteDialect({
      database: await import('bun:sqlite').then(({ Database }) => new Database('db.sqlite'))
    }) as any);

  const db = new Kysely<DB>({ dialect });

  event.locals.db = db;

  return resolve(event);
};
