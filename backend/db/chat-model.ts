import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { ProfileModel } from "./profile-model";

export const ChatModel = pgTable("chats", {
  id: uuid("id").primaryKey().defaultRandom().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
  userId: uuid("user_id").references(() => ProfileModel.id),
  title: text("title").notNull().default("New Chat"),
});
