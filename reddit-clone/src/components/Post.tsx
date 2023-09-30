'use client'

import { formatTimeToNow } from '@/lib/utils'
import { ExtendedPost } from '@/types/db'
import { MessageSquare } from 'lucide-react'
import { useRef } from 'react'
import EditorOutput from './EditorOutput'
import PostVoteClient from './post-vote/PostVoteClient'
import { Vote } from '@prisma/client'
import { useRouter } from 'next/navigation'

type PartialVote = Pick<Vote, 'type'>

interface Props {
  subredditName: string
  post: ExtendedPost
  commentsCount: number
  votesAmount: number
  currentVote?: PartialVote
}

export default function Post({
  subredditName,
  post,
  commentsCount,
  votesAmount,
  currentVote
}: Props) {
  const pRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  return (
    <article
      className='rounded-md bg-white shadow hover:outline-1 hover:outline hover:outline-black hover:cursor-pointer'
      onClick={(e) => {
        e.stopPropagation()
        router.push(`/r/${subredditName}/post/${post.id}`)
      }}
    >
      <div className='px-6 py-4 flex justify-between'>
        <PostVoteClient
          initialVotesAmount={votesAmount}
          postId={post.id}
          initialVote={currentVote?.type}
        />
        <div className='w-0 flex-1'>
          <div className='max-h-40 mt-1 text-xs text-gray-500 gap-1 items-center flex'>
            {subredditName ? (
              <>
                <a
                  href={`/r/${subredditName}`}
                  className='underline text-zinc-900 text-sm underline-offset-2'
                >
                  r/{subredditName}
                </a>
                <span>•</span>
              </>
            ) : null}
            <span>Posted by u/{post.author.username}</span>
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          <a href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className='text-lg font-semibold py-2 leading-6 text-gray-900'>
              {post.title}
            </h1>
          </a>
          <div
            className='relative text-sm max-h-40 w-full overflow-clip'
            ref={pRef}
          >
            <EditorOutput content={post.content} />
            {pRef.current?.clientHeight === 160 ? (
              <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent' />
            ) : null}
          </div>
        </div>
      </div>
      <div className='bg-gray-50 z-20 text-sm'>
        <a
          href={`/r/${subredditName}/post/${post.id}`}
          className='w-fit flex items-center gap-2 hover:bg-zinc-100 p-4 sm:px-6 sm:py-4 rounded-bl-md rounded-tr-md'
        >
          <MessageSquare className='h-4 w-4' /> {commentsCount} comments
        </a>
      </div>
    </article>
  )
}
