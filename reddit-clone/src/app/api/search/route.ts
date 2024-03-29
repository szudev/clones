import { db } from '@/lib/db'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')

  if (!q) return new Response('Invalid query', { status: 400 })

  const subreddits = await db.subreddit.findMany({
    where: {
      name: {
        startsWith: q
      }
    },
    include: {
      _count: true
    },
    take: 5
  })

  return new Response(JSON.stringify(subreddits))
}
