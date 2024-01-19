import type { DrizzleD1Database } from 'drizzle-orm/d1';
import type { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import { eq, and } from 'drizzle-orm';
import * as schema from '$lib/schema';
import { nanoid } from './nanoid.server';

const { teams, competitions, users } = schema;

export type DB = DrizzleD1Database<typeof schema> | BunSQLiteDatabase<typeof schema>;

export async function createComp(db: DB, name: string) {
  await db.insert(competitions).values({ name }).execute();
}

export async function addTeam(db: DB, team_number: number, competition_id: string) {
  const id = nanoid();
  await db.insert(teams).values({ team_number, competition_id, id }).execute();
}

export async function teamIdFromNumber(db: DB, team_number: number, competition_id: string) {
  const team = await db
    .select()
    .from(teams)
    .where(and(eq(teams.team_number, team_number), eq(teams.competitionId, competition_id)))
    .execute();

  return team[0]?.id;
}

export async function addUser(db: DB, name: string, phone_number: string, team_id: string) {
  const id = nanoid();
  await db.insert(users).values({ name, phone_number, team_id, id }).execute();
}
