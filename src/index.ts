import { serve } from "@hono/node-server"

import { env } from "./env"
import { app } from "@/core/app"

serve(
  {
    fetch: app.fetch,
    port: env.APP_PORT,
  },
  info => {
    console.log(`[Info] Server is running on port ${info.port}`)
  }
)
