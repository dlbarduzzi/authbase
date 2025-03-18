import type { SignIn, Profile } from "./routes"
import type { AppRouteHandler } from "@/core/types"

import { eq } from "drizzle-orm"

import { db } from "@/db/conn"
import { env } from "@/env"
import { users } from "@/db/schemas/users"
import { lowercase } from "@/lib/utils"
import { signInSchema } from "./schemas"
import { setCookieHeader, createSetCookie } from "@/tools/cookies/main"
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

  const cookie = createSetCookie("authbase.session_token", {
    value: crypto.randomUUID(),
    path: "/",
    secure: env.NODE_ENV === "production",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    httponly: true,
    samesite: "lax",
  })

  if (cookie !== "invalid") {
    ctx.res.headers.append("Set-Cookie", cookie)
  }

  setCookieHeader(ctx.req.raw.headers, ctx.res)

  return ctx.json({ ok: true, user, message: "User authenticated successfully" }, 200)
}

export const profile: AppRouteHandler<Profile> = async ctx => {
  const user = await db.query.users.findFirst()
  if (user == null) {
    throw new Error("No user. Please update schema to handle this.")
  }
  return ctx.json({ user }, 200)
}
