import {  pgRole, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql/sql";

export const user = pgTable("user", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name"),
  organization_id: text("organization_id").notNull(),
  email: text("email").unique(),
  image: text("image"),
  createdAt: timestamp("created_at").default(sql`now()`),
});


export const metadata = pgTable("metadata", {
 id: text("id").primaryKey().default(sql`gen_random_uuid()`),
 user_email: text("user_email").notNull(),
 business_name: text("business_name").notNull(),
  website_url: text("website_url").notNull(),
  external_link: text("external_link"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const knowledge_source = pgTable("knowledge_source", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  user_email: text("user_email").notNull(),
  type: text("type").notNull(), // "url" or "file"
  name: text("name"),
  status: text("status").notNull().default("active"), // "active" or "inactive"
  source_url: text("source_url"),
  content: text("content"),
  meta_data: text("meta_data"),
  created_at: timestamp("created_at").default(sql`now()`),
  last_updated_at: timestamp("last_updated_at").default(sql`now()`),
})

export const section = pgTable("sections", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  user_email: text("user_email").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  source_ids: text("source_ids").notNull(),
  tone: text("tone").notNull(),
  allowed_topics: text("allowed_topics"),
  blocked_topics: text("blocked_topics"),
  status: text("status").notNull().default("active"),
  created_at: timestamp("created_at").default(sql`now()`),
})

export const chatBotMetadata = pgTable("chatbot_metadata", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  user_email: text("user_email").notNull(),
 color: text("color").default("#000000"),
 welcome_messasge: text("welcome_messasge").default("Welcome to our chatbot! How can I help you today?"),
  created_at: timestamp("created_at").default(sql`now()`),
})