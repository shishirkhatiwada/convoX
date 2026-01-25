import {  pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
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