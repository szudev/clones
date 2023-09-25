import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { PostValidator } from '@/lib/validators/post'
import { z } from 'zod'

export async function POST(request: Request) {
  try {
    const session = await getAuthSession()
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }
    const body = await request.json()

    const { subredditId, title, content } = PostValidator.parse(body)
    const subscriptionExist = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id
      }
    })

    if (!subscriptionExist) {
      return new Response(
        'You have to be subscribed to post in this subreddit.',
        {
          status: 400
        }
      )
    }

    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        subredditId
      }
    })

    return new Response('Post created.')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }

    return new Response(
      'Could not post to the subreddit at this time, please try again later',
      { status: 500 }
    )
  }
}
