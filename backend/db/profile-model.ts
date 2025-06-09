import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  integer,
} from "drizzle-orm/pg-core";

export const ProfileModel = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom().unique(),
  displayName: text("display_name").notNull(),
  accountType: varchar("account_type", { length: 255 })
    .notNull()
    .default("regular"),
  usageInput: integer("usage_input").notNull().default(0),
  usageOutput: integer("usage_output").notNull().default(0),
  usageCompletions: integer("usage_completions").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});
