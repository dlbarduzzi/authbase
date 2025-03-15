import { router } from "@/routers/base"
import { bootstrap, bootstrapOpenAPI } from "./base"

const app = bootstrap()
const routes = [router]

bootstrapOpenAPI(app)

routes.forEach(route => app.route("/", route))

export { app }
