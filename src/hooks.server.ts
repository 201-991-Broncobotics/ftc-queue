import type { Handle } from '@sveltejs/kit';
import { drizzle as d1drizzle } from 'drizzle-orm/d1';
import { drizzle as bundrizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from '$lib/schema';

export const handle: Handle = async ({ resolve, event }) => {
  const d1db = event.platform?.env.DB;

  const db = d1db
    ? d1drizzle(d1db, { schema })
    : bundrizzle(await import('bun:sqlite').then(({ Database }) => new Database('db.sqlite')), {
      schema
    });

  event.locals.db = db;

  return resolve(event);
};
