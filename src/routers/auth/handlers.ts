import type { ListRoute } from "./routes"
import type { AppRouteHandler } from "@/core/types"

export const list: AppRouteHandler<ListRoute> = ctx => {
  return ctx.json([{ name: "John Doe", isEmailVerified: false }], 200)
}
