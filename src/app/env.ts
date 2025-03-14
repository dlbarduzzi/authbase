import { z } from "zod"
import { config } from "dotenv"
import { expand } from "dotenv-expand"

expand(config())

const schema = z.object({
  NODE_ENV: z.enum(["test", "development", "production"]),
  APP_URL: z.string().url(),
  APP_PORT: z.coerce.number(),
})

// eslint-disable-next-line no-process-env
const parsed = schema.safeParse(process.env)

// eslint-disable-next-line no-process-env
const skipValidation = process.env.SKIP_ENV_VALIDATIONS === "true"

function getEnvValues() {
  if (parsed.success) {
    return parsed.data
  }
  if (skipValidation && !parsed.success) {
    return {
      NODE_ENV: "development",
      APP_URL: "http://localhost:8000",
      APP_PORT: 8000,
    }
  }
  console.error("❌ Invalid server environment variables ❌")
  console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2))
  /* eslint-disable-next-line no-process-exit */
  process.exit(1)
}

export const env = getEnvValues()
