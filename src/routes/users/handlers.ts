import type { SignIn, Profile } from "./routes"
import type { AppRouteHandler } from "@/core/types"

export const signIn: AppRouteHandler<SignIn> = ctx => {
  // TODO:
  // When ready to sign in:
  // Get all existing "Set-Cookie" headers
  // Parse "Set-Cookie" headers and append new session cookie to "Set-Cookie"
  // Test by setting a cookie and parsing correctly.
  ctx.res.headers.set(
    "Set-Cookie",
    "session=12345678; HttpOnly; Secure???; SameSite=Lax; Max-Age=600; Path=/"
  )
  const setCookieHeader = ctx.res.headers.get("Set-Cookie")
  console.log({ setCookieHeader })
  return ctx.json(
    {
      user: { id: "abcd-1234-efgh-5678", email: "test@email.com" },
      message: "User authenticated successfully!",
    },
    200
  )
}

export const profile: AppRouteHandler<Profile> = ctx => {
  // TODO: Validate session cookie exists.
  const cookies = ctx.req.header("Cookie")
  console.log(cookies)
  return ctx.json(
    {
      user: {
        id: "abcd-1234-efgh-5678",
        email: "test@email.com",
      },
    },
    200
  )
}
