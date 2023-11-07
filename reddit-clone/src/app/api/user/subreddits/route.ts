import { db } from '@/lib/db'
import { z } from 'zod'

export async function GET(request: Request) {
  const url = new URL(request.url)
  try {
    const { username, limit, page } = z
      .object({
        username: z.string(),
        limit: z.string(),
        page: z.string()
      })
      .parse({
        username: url.searchParams.get('username'),
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page')
      })

    const take = parseInt(limit)
    const skip = (parseInt(page) - 1) * take

    const subreddits = await db.subreddit.findMany({
      take,
      skip,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        creator: true,
        _count: {
          select: {
            posts: true,
            subscribers: true
          }
        }
      },
      where: {
        creator: {
          username: username
        }
      }
    })

    const totalSubreddits = await db.subreddit.count({
      where: {
        creator: {
          username: username
        }
      }
    })

    const hasNextPage = skip + take < totalSubreddits

    return new Response(
      JSON.stringify({ subreddits, currentPage: page, hasNextPage })
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid GET search params data', { status: 422 })
    }
    return new Response('Could not fetch the posts, please try again later.', {
      status: 500
    })
  }
}
