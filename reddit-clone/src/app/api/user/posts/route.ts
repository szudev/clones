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

    const posts = await db.post.findMany({
      take,
      skip,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        subreddit: true,
        votes: true,
        author: true,
        comments: true
      },
      where: {
        author: {
          username: username
        }
      }
    })

    const totalPosts = await db.post.count({
      where: {
        author: {
          username: username
        }
      }
    })

    const hasNextPage = skip + take < totalPosts

    return new Response(
      JSON.stringify({ posts, currentPage: page, hasNextPage })
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
