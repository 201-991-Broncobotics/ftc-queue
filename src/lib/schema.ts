import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
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
  name: text('id').primaryKey()
});

export const matches = sqliteTable('matches', {
  id: text('id').primaryKey(),
  isDone: integer('is_done', { mode: 'boolean' }).notNull(),
  isQueing: integer('is_queing', { mode: 'boolean' }).notNull()
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  expiresAt: integer('expires_at').notNull()
});

export const teamToMatch = sqliteTable('team_match', {
  teamId: text('team_id')
    .notNull()
    .references(() => teams.id),
  matchId: text('match_id')
    .notNull()
    .references(() => matches.id),
  alliance: text('alliance', { enum: ['R1', 'R2', 'R3', 'B1', 'B2', 'B3'] }).notNull()
});

export const teamToUser = sqliteTable('team_user', {
  teamId: text('team_id')
    .notNull()
    .references(() => teams.id),
  userId: text('user_id')
    .notNull()
    .references(() => users.id)
});

export const teamsRelations = relations(teams, ({ many, one }) => ({
  users: many(teamToUser),
  competition: one(competitions, {
    fields: [teams.competitionId],
    references: [competitions.name]
  })
}));

export const competitionsRelations = relations(competitions, ({ many }) => ({
  teams: many(teams)
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
