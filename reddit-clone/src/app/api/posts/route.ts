import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const session = await getAuthSession()

  let followedCommunitiesIds: string[] = []

  if (session) {
    const followedCommunities = await db.subscription.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        subreddit: true
      }
    })

    followedCommunitiesIds = followedCommunities.map(
      ({ subreddit }) => subreddit.id
    )
  }

  try {
    const { limit, page, subredditName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subredditName: z.string().nullish().optional()
      })
      .parse({
        subredditName: url.searchParams.get('subredditName'),
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page')
      })

    let whereClause = {}
    if (subredditName) {
      whereClause = {
        subreddit: {
          name: subredditName
        }
      }
    } else if (session && followedCommunitiesIds.length > 0) {
      whereClause = {
        subreddit: {
          id: {
            in: followedCommunitiesIds
          }
        }
      }
    }

    const take = parseInt(limit)
    const skip = (parseInt(page) - 1) * parseInt(limit)

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
      where: whereClause
    })

    const totalPosts = await db.post.count({
      where: whereClause
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
