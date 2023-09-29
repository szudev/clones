import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { CommentVoteValidator } from '@/lib/validators/vote'
import { z } from 'zod'

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { commentId, voteType } = CommentVoteValidator.parse(body)
    const session = await getAuthSession()

    if (!session?.user) return new Response('Unauthorized', { status: 401 })

    const existingVote = await db.commentVote.findFirst({
      where: {
        userId: session.user.id,
        commentId
      }
    })

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.commentVote.delete({
          where: {
            userId_commentId: {
              commentId,
              userId: session.user.id
            }
          }
        })
      } else {
        await db.commentVote.update({
          where: {
            userId_commentId: {
              commentId,
              userId: session.user.id
            }
          },
          data: {
            type: voteType
          }
        })
      }
      return new Response('Ok')
    }

    await db.commentVote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        commentId
      }
    })

    return new Response('OK')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid PATCH request data passed', { status: 422 })
    }

    return new Response('Could not update your vote, please try again.', {
      status: 500
    })
  }
}
