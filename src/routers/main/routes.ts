import { createRoute, z } from "@hono/zod-openapi"

import { status } from "@/app/status"
import { createApp } from "@/core/base"

const router = createApp().openapi(
  createRoute({
    path: "/",
    method: "get",
    responses: {
      [status.ok.code]: {
        content: {
          "application/json": {
            schema: z.object({ message: z.string() }),
          },
        },
        description: "AuthBase API Index",
      },
    },
    tags: ["Index"],
  }),
  ctx => {
    return ctx.json({ message: "AuthBase API" }, status.ok.code)
  }
)

export const main = router
