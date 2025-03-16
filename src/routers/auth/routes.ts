import type { AppRouteHandler } from "@/core/types"

import { createRoute, z } from "@hono/zod-openapi"

import { createApp } from "@/core/base"

const tags = ["Users"]

const listRoute = createRoute({
  path: "/users",
  tags,
  method: "get",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(
            z.object({
              name: z.string(),
              isEmailVerified: z.boolean(),
            })
          ),
        },
      },
      description: "The list of users",
    },
  },
})

type ListRoute = typeof listRoute

const listHandler: AppRouteHandler<ListRoute> = ctx => {
  return ctx.json([{ name: "John Doe", isEmailVerified: false }], 200)
}

const router = createApp().openapi(listRoute, listHandler)

export const auth = router
