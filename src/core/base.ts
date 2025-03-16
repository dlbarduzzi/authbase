import type { AppBindings, AppOpenAPIHono } from "./types"

import { requestId } from "hono/request-id"
import { OpenAPIHono } from "@hono/zod-openapi"
import { apiReference } from "@scalar/hono-api-reference"

import { logger } from "@/app/logger"
import { status } from "@/app/status"

import packageJSON from "../../package.json"

export function createApp() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json(
          {
            ok: false,
            error: status.unprocessableEntity.text,
            details: result.error,
          },
          status.unprocessableEntity.code
        )
      }
    },
  })
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

export function bootstrapOpenAPI(app: AppOpenAPIHono) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "AuthBase API",
    },
  })
  app.get(
    "/reference",
    apiReference({
      url: "/doc",
      theme: "kepler",
      layout: "classic",
      darkMode: true,
    })
  )
}
