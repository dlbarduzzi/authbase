import { z } from "zod"
import { config } from "dotenv"
import { expand } from "dotenv-expand"

expand(config())

const schema = z.object({
  NODE_ENV: z.enum(["test", "development", "production"]),
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal"]),
  APP_URL: z.string().url(),
  APP_PORT: z.coerce.number(),
  DATABASE_URL: z.string().url(),
})

// eslint-disable-next-line no-process-env
const parsed = schema.safeParse(process.env)

if (!parsed.success) {
  console.error("❌ Invalid server environment variables ❌")
  console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2))
  /* eslint-disable-next-line no-process-exit */
  process.exit(1)
}

export const env = parsed.data
