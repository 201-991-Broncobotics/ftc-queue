import { sqliteTable, integer, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const teams = sqliteTable('teams', {
  id: text('id').primaryKey(),
  team_number: integer('team_number').notNull(),
  competitionId: text('competition_id')
    .notNull()
    .references(() => competitions.name)
});

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phoneNumber: text('phone_number').notNull(),
  teamId: text('team_id')
    .notNull()
    .references(() => teams.id)
});

export const competitions = sqliteTable('competitions', {
  // no spaces (toa competition)
  name: text('name').primaryKey()
});

export const matches = sqliteTable('matches', {
  id: text('id').primaryKey(),
  isDone: integer('is_done', { mode: 'boolean' }).notNull().default(false),
  isQueing: integer('is_queing', { mode: 'boolean' }).notNull().default(false),
  competitionName: text('competition_name')
    .notNull()
    .references(() => competitions.name)
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  expiresAt: integer('expires_at').notNull()
});

export const teamToMatch = sqliteTable(
  'team_match',
  {
    teamId: text('team_id')
      .notNull()
      .references(() => teams.id),
    matchId: text('match_id')
      .notNull()
      .references(() => matches.id),
    alliance: text('alliance', { enum: ['R1', 'R2', 'R3', 'B1', 'B2', 'B3'] }).notNull()
  },
  (t) => ({ pk: primaryKey({ columns: [t.teamId, t.matchId] }) })
);

export const teamToUser = sqliteTable(
  'team_user',
  {
    teamId: text('team_id')
      .notNull()
      .references(() => teams.id),
    userId: text('user_id')
      .notNull()
      .references(() => users.id)
  },
  (t) => ({ pk: primaryKey({ columns: [t.teamId, t.userId] }) })
);

export const teamsRelations = relations(teams, ({ many, one }) => ({
  users: many(teamToUser, {
    relationName: 'users'
  }),
  competition: one(competitions, {
    fields: [teams.competitionId],
    references: [competitions.name]
  })
}));

export const competitionsRelations = relations(competitions, ({ many }) => ({
  teams: many(teams),
  matches: many(matches)
}));

export const matchesRelations = relations(matches, ({ many, one }) => ({
  teams: many(teamToMatch),
  competitions: one(competitions, {
    fields: [matches.competitionName],
    references: [competitions.name]
  })
}));

export const usersRelations = relations(users, ({ many }) => ({
  teams: many(teamToUser)
}));

export const teamToUserRelations = relations(teamToUser, ({ one }) => ({
  team: one(teams, {
    fields: [teamToUser.teamId],
    references: [teams.id]
  }),
  user: one(users, {
    fields: [teamToUser.userId],
    references: [users.id]
  })
}));
