import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Competitions = {
    id: string;
    secret: string;
    toa_id: string;
    name: string;
};
export type CompetitionsToUsers = {
    A: string;
    B: string;
};
export type Matches = {
    id: string;
    is_queuing: number;
    is_done: number;
    name: string;
    order: number;
    competition_id: string;
};
export type Sessions = {
    id: string;
    expires_at: number;
    user_id: string;
};
export type Teams = {
    id: string;
    name: string;
    team_number: number;
    competition_id: string;
};
export type TeamToMatch = {
    alliance: string;
    team_id: string;
    match_id: string;
    competitionsId: string | null;
};
export type Users = {
    id: string;
    google_id: string;
    pfp_url: string;
    name: string;
    phone_number: string | null;
};
export type DB = {
    _CompetitionsToUsers: CompetitionsToUsers;
    Competitions: Competitions;
    Matches: Matches;
    Sessions: Sessions;
    Teams: Teams;
    TeamToMatch: TeamToMatch;
    Users: Users;
};
