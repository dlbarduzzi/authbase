import { createApp } from "@/core/base"

import * as routes from "./routes"
import * as handlers from "./handlers"

const router = createApp().openapi(routes.list, handlers.list)

export const auth = router
