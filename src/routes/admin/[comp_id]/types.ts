export type OptionalAlliances = "Red3" | "Blue3";
export type RequiredAlliances = "Red1" | "Red2" | "Blue1" | "Blue2";
export type Alliance = RequiredAlliances | OptionalAlliances;

export type AllianceRecord<T> = Record<RequiredAlliances, T> &
  Partial<Record<OptionalAlliances, T>>;

export type BasicMatch = {
  teams: AllianceRecord<{
    team_number: number;
  }>;
  is_done: boolean;
  is_queuing: boolean;
  order: number;
  name: string;
  match_id: string;
};
