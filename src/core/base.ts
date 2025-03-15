import type { Variables } from "./types"

import { requestId } from "hono/request-id"
import { OpenAPIHono } from "@hono/zod-openapi"

import { env } from "@/app/env"
import { logger } from "@/app/logger"

import { status } from "./status"

export function bootstrap() {
  const app = new OpenAPIHono<{ Variables: Variables }>({ strict: false })

  app.use(requestId())
  app.use(logger())

  app.onError((err, ctx) => {
    const { code, text } = status.internalServerError
    return ctx.json(
      {
        ok: false,
        error: text,
        stack: env.NODE_ENV === "production" ? undefined : err.stack,
      },
      code
    )
  })

  app.notFound(ctx => {
    const { code, text } = status.notFound
    return ctx.json({ ok: false, error: text }, code)
  })

  return app
}
