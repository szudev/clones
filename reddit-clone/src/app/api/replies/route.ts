import { db } from '@/lib/db'
import { z } from 'zod'

export async function GET(request: Request) {
  const url = new URL(request.url)

  try {
    const { limit, page, commentId } = z
      .object({
        limit: z.string(),
        page: z.string(),
        commentId: z.string()
      })
      .parse({
        commentId: url.searchParams.get('commentId'),
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page')
      })

    const take = parseInt(limit)
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const replies = await db.commentReply.findMany({
      take,
      skip,
      orderBy: {
        createdAt: 'asc'
      },
      include: {
        author: true,
        votes: true
      },
      where: {
        replyToId: commentId
      }
    })

    const totalReplies = await db.commentReply.count({
      where: {
        replyToId: commentId
      }
    })

    const hasNextPage = skip + take < totalReplies

    return new Response(
      JSON.stringify({ replies, currentPage: page, hasNextPage })
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid GET search params data', { status: 422 })
    }
    return new Response(
      'Could not fetch the replies, please try again later.',
      {
        status: 500
      }
    )
  }
}
