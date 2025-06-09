import { pgTable, timestamp, uuid, varchar, jsonb } from "drizzle-orm/pg-core";
import { ChatModel } from "./chat-model";

export const MessagePairModel = pgTable("message_pairs", {
  id: uuid("id").primaryKey().defaultRandom().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
  status: varchar("status", { length: 255 }).notNull().default("pending"),
  chatId: uuid("chat_id").references(() => ChatModel.id),
  userMessage: jsonb("user_message").notNull(),
  aiMessage: jsonb("ai_message"),
});
