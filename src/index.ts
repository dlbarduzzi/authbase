import { serve } from "@hono/node-server"

import { env } from "@/app/env"
import { app } from "@/app/core"

serve(
  {
    fetch: app.fetch,
    port: env.APP_PORT,
  },
  info => {
    console.log(`[Info] Server is running on port ${info.port}`)
  }
)
