import { z } from 'zod'

export const UserAccountValidator = z.object({
  userId: z.string()
})

export type UserAccountRequest = z.infer<typeof UserAccountValidator>
