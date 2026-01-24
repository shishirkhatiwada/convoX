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