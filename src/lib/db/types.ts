import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Competitions = {
    name: string;
};
export type Matches = {
    id: string;
    isQueuing: number;
    isDone: number;
    competitionsName: string;
};
export type Teams = {
    id: string;
    team_number: number;
    competitionsName: string;
};
export type TeamToMatch = {
    alliance: string;
    teamId: string;
    matchId: string;
};
export type DB = {
    Competitions: Competitions;
    Matches: Matches;
    Teams: Teams;
    TeamToMatch: TeamToMatch;
};
