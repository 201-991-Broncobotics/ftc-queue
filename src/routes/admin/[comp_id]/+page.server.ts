import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { toa } from "$lib/toa.server";
import type { AllianceRecord, BasicMatch } from "./types";

export const load: PageServerLoad = async ({ params, locals }) => {
  const { comp_id } = params;

  if (!locals.user) throw redirect(307, "/login");

  const comp = await getComp(locals.db, locals.user.id, comp_id);

  const teamsInMatch = new Map<
    string,
    Partial<AllianceRecord<{ team_number: number }>>
  >();

  const m = await locals.db
    .selectFrom("Matches")
    .where("competition_id", "=", comp.id)
    .innerJoin("TeamToMatch", "Matches.id", "TeamToMatch.match_id")
    .select([
      "name",
      "is_queuing",
      "is_done",
      "alliance",
      "team_id",
      "match_id",
      "order",
    ])
    .execute();

  m.forEach((match) => {
    if (!teamsInMatch.has(match.match_id)) {
      teamsInMatch.set(match.match_id, {});
    }

    const alliance = teamsInMatch.get(match.match_id)!;
    // @ts-expect-error I'm way too lazy to fix this on the type level
    alliance[match.alliance] = {
      team_number: parseInt(match.team_id.split(":")[1]!),
    };
  });

  // remove duplicated "match_id"s
  const matches: BasicMatch[] = m
    .filter(
      (m, i, arr) => arr.findIndex((m2) => m2.match_id === m.match_id) === i,
    )
    .map((m) => ({
      ...m,
      teams: teamsInMatch.get(m.match_id) as any,
      is_done: !!m.is_done,
      is_queuing: !!m.is_queuing,
      alliance: undefined,
    }));

  return {
    comp,
    matches,
  };
};

export const actions = {
  import: async ({ locals, params }) => {
    if (!locals.user) throw redirect(307, "/login");

    const comp = await getComp(locals.db, locals.user.id, params.comp_id);

    locals.db.transaction().execute(async (trx) => {
      // first we make sure all the teams are in the db already
      const currentTeams = await trx
        .selectFrom("Teams")
        .where("competition_id", "=", comp.id)
        .select(["team_number"])
        .execute();

      const teams = (await toa.getEventTeams(comp.toa_id))
        .map(({ team: { teamNumber, teamNameShort } }) => ({
          team_number: teamNumber,
          name: teamNameShort,
          id: `${comp.id}:${teamNumber}`,
          competition_id: comp.id,
        }))
        .filter(
          ({ team_number }) =>
            !currentTeams.some((t) => t.team_number === team_number),
        );

      if (teams.length !== 0) {
        await trx.insertInto("Teams").values(teams).execute();
      }

      // then we get the matches
      // we only want to import matches that are not already in the db
      const currentMatches = await trx
        .selectFrom("Matches")
        .where("competition_id", "=", comp.id)
        .select(["id"])
        .execute();

      const newMatches = (await toa.getEventMatches(comp.toa_id)).filter(
        ({ matchKey }) =>
          !currentMatches.some((m) => m.id.split(":")[1] === matchKey),
      );

      const matches = newMatches.map((match, i) => ({
        is_queuing: 0,
        is_done: 0,
        name: match.matchName,
        competition_id: comp.id,
        id: `${comp.id}:${match.matchKey}`,
        order: i,
      }));

      if (matches.length !== 0) {
        await trx.insertInto("Matches").values(matches).execute();
      }

      const teamsToMatches = newMatches.flatMap((match) =>
        match.participants.map((participant) => {
          return {
            match_id: `${comp.id}:${match.matchKey}`,
            team_id: `${comp.id}:${participant.teamKey}`,
            alliance:
              STATION_TO_ALLIANCE[participant.station.toString()] || "other",
          };
        }),
      );

      if (matches.length != 0) {
        await trx.insertInto("TeamToMatch").values(teamsToMatches).execute();
      }
    });
  },
} satisfies Actions;

async function getComp(db: App.Locals["db"], userId: string, compId: string) {
  // we select from _CompetitionsToUsers to ensure that the user is authorized
  const comp = await db
    .selectFrom("_CompetitionsToUsers")
    .where("B", "=", userId)
    .where("A", "=", compId)
    .innerJoin("Competitions", "Competitions.id", "_CompetitionsToUsers.A")
    .select([
      "Competitions.id as id",
      "Competitions.name as name",
      "Competitions.secret as secret",
      "Competitions.toa_id as toa_id",
    ])
    .executeTakeFirst();

  if (!comp) throw redirect(307, "/login");

  return comp;
}

const STATION_TO_ALLIANCE: Record<string, string> = {
  "11": "Red1",
  "12": "Red2",
  "13": "Red3",
  "21": "Blue1",
  "22": "Blue2",
  "23": "Blue3",
};
