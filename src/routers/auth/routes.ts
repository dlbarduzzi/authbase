import { createRoute, z } from "@hono/zod-openapi"

const tags = ["Users"]

export const list = createRoute({
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

export type ListRoute = typeof list
