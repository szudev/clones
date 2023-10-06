import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { ReplyValidator } from '@/lib/validators/reply'
import { z } from 'zod'

export async function PATCH(request: Request) {
  try {
    const session = await getAuthSession()
    if (!session?.user) return new Response('Unauthorized', { status: 401 })
    const body = await request.json()
    const { commentId, text } = ReplyValidator.parse(body)
    await db.commentReply.create({
      data: {
        text,
        authorId: session.user.id,
        replyToId: commentId
      }
    })
    return new Response('Ok')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid PATCH request data.', { status: 400 })
    }
    return new Response('Could save the comment, please try again.', {
      status: 500
    })
  }
}
