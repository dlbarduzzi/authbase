import { OpenAPIHono } from "@hono/zod-openapi"

import { env } from "./env"
import { status } from "./status"

const app = new OpenAPIHono()

app.get("/", ctx => {
  return ctx.text("Hello Hono!")
})

app.onError((err, ctx) => {
  console.error(err)
  const { code, text } = status.internalServerError
  const stack = env.NODE_ENV === "production" ? undefined : err.stack
  return ctx.json({ ok: false, error: text, stack }, code)
})

app.notFound(ctx => {
  const { code, text } = status.notFound
  return ctx.json({ ok: false, error: text }, code)
})

export { app }
