import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { ReplyVoteValidator } from '@/lib/validators/vote'
import { z } from 'zod'

export async function PATCH(request: Request) {
  try {
    const session = await getAuthSession()
    if (!session?.user) return new Response('Unauthorized', { status: 401 })
    const body = await request.json()
    const { replyId, voteType } = ReplyVoteValidator.parse(body)
    const existingVote = await db.replyVote.findFirst({
      where: {
        userId: session.user.id,
        commentReplyId: replyId
      }
    })
    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.replyVote.delete({
          where: {
            userId_commentReplyId: {
              userId: session.user.id,
              commentReplyId: replyId
            }
          }
        })
      } else {
        await db.replyVote.update({
          where: {
            userId_commentReplyId: {
              userId: session.user.id,
              commentReplyId: replyId
            }
          },
          data: {
            type: voteType
          }
        })
      }
      return new Response('Ok')
    }

    await db.replyVote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        commentReplyId: replyId
      }
    })
    return new Response('Ok')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid PATCH request data passed', { status: 422 })
    }

    return new Response('Could not update your vote, please try again.', {
      status: 500
    })
  }
}
