import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { db } from '@/lib/db'
import { Session } from 'next-auth'
import PostFeed from './PostFeed'
import { ExtendedPost } from '@/types/db'

interface Props {
  session: Session | null
}

export default async function CustomFeed({ session }: Props) {
  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session?.user.id
    },
    include: {
      subreddit: true
    }
  })

  let posts: ExtendedPost[] = []

  if (followedCommunities.length > 0) {
    posts = await db.post.findMany({
      where: {
        subreddit: {
          name: {
            in: followedCommunities.map(({ subreddit }) => subreddit.id)
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        votes: true,
        author: true,
        comments: true,
        subreddit: true
      },
      take: INFINITE_SCROLLING_PAGINATION_RESULTS
    })
  } else {
    posts = await db.post.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        votes: true,
        author: true,
        comments: true,
        subreddit: true
      },
      take: INFINITE_SCROLLING_PAGINATION_RESULTS
    })
  }

  return <PostFeed initialPosts={posts} session={session} />
}
