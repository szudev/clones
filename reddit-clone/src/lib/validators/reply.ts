import { z } from 'zod'

export const ReplyValidator = z.object({
  commentId: z.string(),
  text: z.string()
})

export type ReplyRequest = z.infer<typeof ReplyValidator>
