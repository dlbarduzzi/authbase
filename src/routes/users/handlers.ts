import type { SignIn, Profile } from "./routes"
import type { AppRouteHandler } from "@/core/types"

import { eq } from "drizzle-orm"

import { db } from "@/db/conn"
import { users } from "@/db/schemas/users"
import { lowercase } from "@/lib/utils"
import { signInSchema } from "./schemas"
import { StatusUnauthorized, StatusUnprocessableEntity } from "@/core/status"

export const signIn: AppRouteHandler<SignIn> = async ctx => {
  const data = ctx.req.valid("json")
  // This is already handled by our `defaultHook` in `@/core/base/createApp` function.
  // But I always like to keep al the checks in one place.
  const parsed = signInSchema.safeParse(data)
  if (!parsed.success) {
    return ctx.json(
      {
        ok: false,
        error: StatusUnprocessableEntity,
        details: parsed.error.issues,
      },
      422
    )
  }
  const user = await db.query.users.findFirst({
    where: eq(users.email, lowercase(parsed.data.email)),
  })
  if (user == null) {
    return ctx.json(
      {
        ok: false,
        error: StatusUnauthorized,
        details: "Invalid credentials",
      },
      401
    )
  }
  return ctx.json({ ok: true, user, message: "User authenticated successfully" }, 200)
}

export const profile: AppRouteHandler<Profile> = async ctx => {
  const user = await db.query.users.findFirst()
  if (user == null) {
    throw new Error("No user. Please update schema to handle this.")
  }
  return ctx.json({ user }, 200)
}
