import type { PinoLogger } from "hono-pino"
import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi"

export type AppBindings = {
  Variables: {
    logger: PinoLogger
  }
}

export type AppOpenAPIHono = OpenAPIHono<AppBindings>
export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>
