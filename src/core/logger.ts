// import pino from "pino"
// import pretty from "pino-pretty"
// import { pinoLogger } from "hono-pino"
import { logger as honoLogger } from "hono/logger"

// import { env } from "@/env"

export function logger() {
  return honoLogger()
  // return pinoLogger({
  //   pino: pino(
  //     { level: env.LOG_LEVEL },
  //     env.NODE_ENV === "production" ? undefined : pretty()
  //   ),
  // })
}
