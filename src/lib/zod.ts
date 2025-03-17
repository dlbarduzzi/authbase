// Inspired by w3cj/stoker
// https://github.com/w3cj/stoker/blob/main/src/openapi/helpers/types.ts

import { z } from "@hono/zod-openapi"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export type ZodSchema = z.ZodUnion | z.AnyZodObject | z.ZodArray<z.AnyZodObject>

export const createErrorSchema = <T extends ZodSchema>(schema: T) => {
  const { error } = schema.safeParse(
    schema._def.typeName === z.ZodFirstPartyTypeKind.ZodArray ? [] : {}
  )
  return z
    .array(
      z.object({
        code: z.string(),
        path: z.array(z.union([z.string(), z.number()])),
        message: z.string().optional(),
      })
    )
    .openapi({
      example: error,
    })
}
