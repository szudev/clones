import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { SubredditValidator } from '@/lib/validators/subreddit'
import { z } from 'zod'

export async function POST(request: Request) {
  // Se utilizarán prisma.$transaction para las sequencias de queries
  // Estas reemplazarán y envolverán las queries sueltas que tienen que realizarse exitosamente en conjunto
  try {
    const session = await getAuthSession()
    if (!session?.user) {
      return new Response('Unauthorized', {
        status: 401
      })
    }

    const body = await request.json()
    const { name } = SubredditValidator.parse(body)

    const checkSubredditExist = await db.subreddit.findFirst({
      where: {
        name
      }
    })

    if (checkSubredditExist) {
      return new Response('Subreddit alrady exists', {
        status: 409
      })
    }

    const newSubreddit = await db.subreddit.create({
      data: {
        name,
        creatorId: session.user.id
      }
    })

    await db.subscription.create({
      data: {
        userId: session.user.id,
        subredditId: newSubreddit.id
      }
    })

    return new Response(newSubreddit.name)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }

    return new Response('Could not create a new subreddit', { status: 500 })
  }
}
