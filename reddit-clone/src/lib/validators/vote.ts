import { z } from 'zod'

export const PostVoteValidator = z.object({
  postId: z.string(),
  voteType: z.enum(['UP', 'DOWN'])
})

export const CommentVoteValidator = z.object({
  commentId: z.string(),
  voteType: z.enum(['UP', 'DOWN'])
})

export const ReplyVoteValidator = z.object({
  replyId: z.string(),
  voteType: z.enum(['UP', 'DOWN'])
})

export type PostVoteRequest = z.infer<typeof PostVoteValidator>
export type CommentVoteRequest = z.infer<typeof CommentVoteValidator>
export type ReplyVoteRequest = z.infer<typeof ReplyVoteValidator>
