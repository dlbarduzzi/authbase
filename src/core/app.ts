import { users } from "@/routes/users/apis"
import { documentApp, bootstrapApp } from "@/core/base"

const app = bootstrapApp()
documentApp(app)

const routes = [users] as const
routes.forEach(route => app.route("/", route))

export type AppType = (typeof routes)[number]
export { app }
