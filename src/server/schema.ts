import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';
export const workspaceTable = sqliteTable('workspaces', {
  id: text('id').primaryKey(), tokenHash: text('token_hash').notNull(),
  createdAt: text('created_at').notNull(), lastSeen: text('last_seen').notNull()
});
export const incidentTable = sqliteTable('incidents', {
  id: text('id').primaryKey(), workspaceId: text('workspace_id').notNull(),
  version: integer('version').notNull(), currentAssessmentId: text('current_assessment_id'),
  createdAt: text('created_at').notNull(), updatedAt: text('updated_at').notNull()
});
