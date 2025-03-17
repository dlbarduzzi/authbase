import type { SignIn, Profile } from "./routes"
import type { AppRouteHandler } from "@/core/types"

import { db } from "@/db/conn"

export const signIn: AppRouteHandler<SignIn> = async ctx => {
  const user = await db.query.users.findFirst()
  if (user == null) {
    throw new Error("No user. Please update schema to handle this.")
  }
  return ctx.json({ user, message: "User authenticated successfully" }, 200)
}

export const profile: AppRouteHandler<Profile> = async ctx => {
  const user = await db.query.users.findFirst()
  if (user == null) {
    throw new Error("No user. Please update schema to handle this.")
  }
  return ctx.json({ user }, 200)
}
