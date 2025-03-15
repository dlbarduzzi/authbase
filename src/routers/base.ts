import { createRoute, z } from "@hono/zod-openapi"
import { createApp } from "@/core/base"

export const router = createApp().openapi(
  createRoute({
    path: "/",
    method: "get",
    request: undefined,
    responses: {
      200: {
        content: {
          "application/json": {
            schema: z.object({ message: z.string() }),
          },
        },
        description: "AuthBase API Index",
      },
    },
  }),
  ctx => {
    return ctx.json({ message: "Welcome to AuthBase!" }, 200)
  }
)
