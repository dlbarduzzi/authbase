import { userSchema } from "@/db/schemas/users"
import { createRoute, z } from "@hono/zod-openapi"

const tags = ["Users"]
const basePath = "/api/v1/users"

export const signIn = createRoute({
  path: `${basePath}/sign-in`,
  tags,
  method: "post",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            email: z
              .string({ message: "Email is required" })
              .min(1, "Email is required")
              .email("Not a valid email"),
            password: z
              .string({ message: "Password is required" })
              .min(1, "Password is required"),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            user: userSchema,
            message: z.string(),
          }),
        },
      },
      description: "Authenticate user",
    },
  },
})

export const profile = createRoute({
  path: `${basePath}/profile`,
  tags,
  method: "get",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            user: userSchema,
          }),
        },
      },
      description: "Get user profile",
    },
  },
})

export type SignIn = typeof signIn
export type Profile = typeof profile
