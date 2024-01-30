import type { DB } from "./db/types";
import type { Kysely } from "kysely";
import { nanoid } from "./nanoid.server";

export type Database = Kysely<DB>;


/**
 * @returns the list of new team ids
 */
export async function addTeamsToComp(
  db: Database,
  compName: string,
  teamNumbers: number[],
) {
  return await db.transaction().execute(async (tx) => {
    return await Promise.all(
      teamNumbers.map(async (teamNumber) => {
        const id = nanoid();
        await tx
          .insertInto("Teams")
          .values({
            competition_name: compName,
            team_number: teamNumber,
            id,
          })
          .execute();

        return id;
      }),
    );
  });
}
