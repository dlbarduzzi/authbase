import pino from "pino"
import pretty from "pino-pretty"
import { pinoLogger } from "hono-pino"

export function logger(level: string, isProd: boolean) {
  return pinoLogger({
    pino: pino({ level }, isProd ? undefined : pretty()),
  })
}
