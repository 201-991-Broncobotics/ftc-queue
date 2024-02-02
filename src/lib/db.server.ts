import type { DB } from "./db/types";
import type { Kysely } from "kysely";

export type Database = Kysely<DB>;
