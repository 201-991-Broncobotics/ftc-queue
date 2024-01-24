import type { DB } from './db/types';
import type { Kysely } from 'kysely';
import { nanoid } from './nanoid.server';

export type Database = Kysely<DB>;

export async function createCompetition(db: Database, toaId: string, name: string, userId: string) {
	await db.transaction().execute(async (tx) => {
		await tx
			.insertInto('Competitions')
			.values({
				toa_id: toaId,
				// it's called "secret", but we dgaf about security for this, and being able to type it easily could be useful
				secret: nanoid(8),
				name
			})
			.execute();

		await tx
			.insertInto('_CompetitionsToUsers')
			.values({
				A: toaId,
				B: userId
			})
			.execute();
	});
}

/**
 * @returns the list of new team ids
 */
export async function addTeamsToComp(db: Database, compName: string, teamNumbers: number[]) {
	return await db.transaction().execute(async (tx) => {
		return await Promise.all(
			teamNumbers.map(async (teamNumber) => {
				const id = nanoid();
				await tx
					.insertInto('Teams')
					.values({
						competition_name: compName,
						team_number: teamNumber,
						id
					})
					.execute();

				return id;
			})
		);
	});
}
