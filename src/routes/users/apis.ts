import { createApp } from "@/core/base"

import * as routes from "./routes"
import * as handlers from "./handlers"

export const users = createApp()
  .openapi(routes.signIn, handlers.signIn)
  .openapi(routes.signUp, handlers.signUp)
