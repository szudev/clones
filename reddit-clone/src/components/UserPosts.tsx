'use client'

import { ExtendedPost } from '@/types/db'
import { useIntersection } from '@mantine/hooks'
import { Loader2 } from 'lucide-react'
import { Session } from 'next-auth'
import { useEffect, useRef } from 'react'
import Post from './Post'
import useFetchUserPosts from '@/hooks/use-fetch-user-posts'

interface Props {
  initialPosts: ExtendedPost[]
  session: Session | null
  username: string
}

export default function UserPosts({ initialPosts, session, username }: Props) {
  const rootRef = useRef<HTMLElement>(null)
  const { ref, entry } = useIntersection({
    root: rootRef.current,
    threshold: 1
  })
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchedAfterMount,
    isFetching,
    isFetchingNextPage
  } = useFetchUserPosts({ username })

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      fetchNextPage()
    }
  }, [entry, hasNextPage, fetchNextPage])

  const posts = data?.pages.flatMap((page) => page.posts) ?? initialPosts

  return !isFetchedAfterMount ? (
    <div className='flex h-full w-full items-center justify-center'>
      <Loader2 className='h-10 w-10 animate-spin text-zinc-500' />
    </div>
  ) : posts.length === 0 ? (
    <p>There is no posts yet.</p>
  ) : (
    <ul className='flex flex-col space-y-6'>
      {posts.map((post, index) => {
        const votesCount = post.votes.reduce((prev, vote) => {
          if (vote.type === 'UP') return prev + 1
          if (vote.type === 'DOWN') return prev - 1
          return prev
        }, 0)

        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user.id
        )

        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post
                votesAmount={votesCount}
                currentVote={currentVote}
                subredditName={post.subreddit.name}
                post={post}
                commentsCount={post.comments.length}
              />
            </li>
          )
        } else {
          return (
            <Post
              votesAmount={votesCount}
              currentVote={currentVote}
              key={post.id}
              subredditName={post.subreddit.name}
              post={post}
              commentsCount={post.comments.length}
            />
          )
        }
      })}
      {isFetchingNextPage && hasNextPage ? (
        <Loader2 className='h-8 w-8 animate-spin place-self-center text-zinc-400' />
      ) : !isFetching ? (
        <p className='flex items-center text-center text-lg place-self-center'>
          You have reached the end
        </p>
      ) : (
        <div className='flex h-full w-full items-center justify-center'>
          <Loader2 className='h-10 w-10 animate-spin text-zinc-500' />
        </div>
      )}
    </ul>
  )
}
