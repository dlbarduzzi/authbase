import type { AppBindings, AppOpenAPIHono } from "./types"

import { ZodError } from "zod"
import { requestId } from "hono/request-id"
import { OpenAPIHono } from "@hono/zod-openapi"
import { apiReference } from "@scalar/hono-api-reference"
import { HTTPException } from "hono/http-exception"

import {
  StatusBadRequest,
  StatusNotFound,
  StatusUnprocessableEntity,
  StatusServerError,
} from "./status"

import { logger } from "./logger"
import packageJSON from "../../package.json"

export function createApp() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook: (result, ctx) => {
      if (!result.success) {
        return ctx.json(
          {
            ok: false,
            error: StatusUnprocessableEntity,
            details: result.error instanceof ZodError ? result.error.issues : undefined,
          },
          422
        )
      }
    },
  })
}

export function bootstrapApp() {
  const app = createApp()

  app.use(requestId())
  app.use(logger())

  app.onError((err, ctx) => {
    if (
      err instanceof HTTPException &&
      err.message === "Malformed JSON in request body"
    ) {
      return ctx.json({ ok: false, error: StatusBadRequest, message: err.message }, 400)
    }

    ctx.var.logger.error(err)

    return ctx.json(
      {
        ok: false,
        error: StatusServerError,
        message: "Something went wrong while processing your request",
      },
      500
    )
  })

  app.notFound(ctx => {
    return ctx.json(
      {
        ok: false,
        error: StatusNotFound,
        message: "The resource you are looking for does not exist",
      },
      404
    )
  })

  return app
}

export function documentApp(app: AppOpenAPIHono) {
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
