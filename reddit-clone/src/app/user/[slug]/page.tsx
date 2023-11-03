import UserContent from '@/components/UserContent'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'

interface Props {
  params: {
    slug: string
  }
}

export default async function Page({ params }: Props) {
  const { slug } = params
  const posts = await db.post.findMany({
    where: {
      author: {
        username: slug
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      subreddit: true,
      votes: true,
      author: true,
      comments: true
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS
  })
  const session = await getAuthSession()
  return <UserContent posts={posts} session={session} username={slug} />
}
