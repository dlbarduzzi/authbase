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
            email: z.string().min(1, "Email is required").email("Not a valid email"),
            password: z.string().min(1, "Password is required"),
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
            token: z.string(),
          }),
        },
      },
      description: "Authenticate user",
    },
  },
})

const PASSWORD_MIN_CHARS = 8
const PASSWORD_MAX_CHARS = 72

function hasNumber(value: string) {
  return /[0-9]/.test(value)
}

function hasSpecialChar(value: string) {
  return /[!?@#$&^*_\-=+]/.test(value)
}

function hasLowercaseChar(value: string) {
  return /[a-z]/.test(value)
}

function hasUppercaseChar(value: string) {
  return /[A-Z]/.test(value)
}

export const signUp = createRoute({
  path: `${basePath}/sign-up`,
  tags,
  method: "post",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z
            .object({
              email: z.string().min(1, "Email is required").email("Not a valid email"),
              password: z
                .string()
                .min(1, "Password is required")
                .min(PASSWORD_MIN_CHARS, {
                  // eslint-disable-next-line max-len
                  message: `Password must be at least ${PASSWORD_MIN_CHARS} characters long`,
                })
                .max(PASSWORD_MAX_CHARS, {
                  // eslint-disable-next-line max-len
                  message: `Password must be at most ${PASSWORD_MAX_CHARS} characters long`,
                }),
            })
            .superRefine((input, ctx) => {
              if (!hasNumber(input.password)) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: ["password"],
                  message: "Password must contain at least 1 number",
                })
              }
              if (!hasLowercaseChar(input.password)) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: ["password"],
                  message: "Password must contain at least 1 lowercase character",
                })
              }
              if (!hasUppercaseChar(input.password)) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: ["password"],
                  message: "Password must contain at least 1 uppercase character",
                })
              }
              if (!hasSpecialChar(input.password)) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: ["password"],
                  message: "Password must contain at least 1 special character",
                })
              }
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
            token: z.string(),
          }),
        },
      },
      description: "Create a new user",
    },
  },
})

export type SignIn = typeof signIn
export type SignUp = typeof signUp
