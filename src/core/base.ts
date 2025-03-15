import type { Variables } from "./types"

import { requestId } from "hono/request-id"
import { OpenAPIHono } from "@hono/zod-openapi"

import { logger } from "@/app/logger"
import { status } from "@/app/status"

export function bootstrap() {
  const app = new OpenAPIHono<{ Variables: Variables }>({ strict: false })

  app.use(requestId())
  app.use(logger())

  app.onError((_, ctx) => {
    const { code, text } = status.serverError
    return ctx.text(`${code} ${text}`, code)
  })

  app.notFound(ctx => {
    const { code, text } = status.notFound
    return ctx.text(`${code} ${text}`, code)
  })

  return app
}
