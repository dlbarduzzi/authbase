import { auth } from "@/routers/auth/routes"
import { main } from "@/routers/main/routes"
import { bootstrap, bootstrapOpenAPI } from "./base"

const app = bootstrap()
const routes = [main, auth]

bootstrapOpenAPI(app)

routes.forEach(route => app.route("/", route))

export { app }
