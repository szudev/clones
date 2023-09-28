import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { CommentValidator } from '@/lib/validators/comment'
import { z } from 'zod'

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const session = await getAuthSession()
    if (!session?.user) return new Response('Unauthorized', { status: 401 })
    const { postId, text, replyToId } = CommentValidator.parse(body)

    await db.comment.create({
      data: {
        text,
        postId,
        authorId: session.user.id,
        replyToId
      }
    })

    return new Response('OK')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid PATCH request data.', { status: 400 })
    }

    return new Response('Could save the comment, please try again.', {
      status: 500
    })
  }
}
