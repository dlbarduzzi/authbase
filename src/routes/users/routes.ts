import { createRoute, z } from "@hono/zod-openapi"

import { userSchema } from "@/db/schemas/users"
import { signInSchema } from "./schemas"
import { createErrorSchema } from "@/lib/zod"
import { StatusUnauthorized, StatusUnprocessableEntity } from "@/core/status"

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
          schema: signInSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            ok: z.literal(true),
            user: userSchema,
            message: z.string(),
          }),
        },
      },
      description: "The authenticated user",
    },
    401: {
      content: {
        "application/json": {
          schema: z.object({
            ok: z.literal(false),
            error: z.literal(StatusUnauthorized),
            details: z.string(),
          }),
        },
      },
      description: "The user authentication error",
    },
    422: {
      content: {
        "application/json": {
          schema: z.object({
            ok: z.literal(false),
            error: z.literal(StatusUnprocessableEntity),
            details: createErrorSchema(signInSchema),
          }),
        },
      },
      description: "The user payload validation error",
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
