import { z } from 'zod'

export const UserAccountValidator = z.object({
  userId: z.string()
})

export type UserAccountValidator = z.infer<typeof UserAccountValidator>
