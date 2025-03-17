import { z } from "zod"

export const signInSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .min(1, "Email is required")
    .email("Not a valid email"),
  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required"),
})
