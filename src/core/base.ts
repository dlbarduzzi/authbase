import type { OpenAPI, Variables } from "./types"

import { requestId } from "hono/request-id"
import { OpenAPIHono } from "@hono/zod-openapi"

import { logger } from "@/app/logger"
import { status } from "@/app/status"

import packageJSON from "../../package.json"

export function createApp() {
  return new OpenAPIHono<{ Variables: Variables }>({ strict: false })
}

export function bootstrap() {
  const app = createApp()

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

export function bootstrapOpenAPI(app: OpenAPI) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "AuthBase API",
    },
  })
}
