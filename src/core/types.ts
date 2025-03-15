import type { PinoLogger } from "hono-pino"
import type { OpenAPIHono } from "@hono/zod-openapi"

export type Variables = {
  logger: PinoLogger
}

export type OpenAPI = OpenAPIHono<{ Variables: Variables }>
