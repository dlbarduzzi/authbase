import type { SignIn, SignUp } from "./routes"
import type { AppRouteHandler } from "@/core/types"

export const signIn: AppRouteHandler<SignIn> = ctx => {
  return ctx.json({ token: "abcd-1234" }, 200)
}

export const signUp: AppRouteHandler<SignUp> = ctx => {
  return ctx.json({ token: "abcd-1234" }, 200)
}
