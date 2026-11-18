import { pgTable, uuid, varchar, text, timestamp, integer } from "drizzle-orm/pg-core";

export const contactSubmissions = pgTable("contact_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  reference: varchar("reference", { length: 40 }).notNull().unique(),
  name: varchar("name", { length: 80 }).notNull(),
  email: varchar("email", { length: 254 }).notNull(),
  company: varchar("company", { length: 120 }),
  service: varchar("service", { length: 80 }).notNull(),
  budget: varchar("budget", { length: 80 }),
  message: text("message").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  providerId: varchar("provider_id", { length: 100 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contactRateLimits = pgTable("contact_rate_limits", {
  key: varchar("key", { length: 100 }).primaryKey(),
  count: integer("count").notNull().default(1),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});
