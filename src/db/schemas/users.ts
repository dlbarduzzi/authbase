import { createSelectSchema } from "drizzle-zod"
import { pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core"

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  table => [uniqueIndex("email_index").on(table.email)]
)

export const userSchema = createSelectSchema(users)
