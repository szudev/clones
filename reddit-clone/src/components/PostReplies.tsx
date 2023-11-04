'use client'

import useFetchCommentReplies from '@/hooks/use-fetch-comment-replies'
import { Button } from './ui/Button'
import { useEffect, useState } from 'react'
import PostReply from './PostReply'
import { Session } from 'next-auth'
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  repliesAmount: number
  commentId: string
  session: Session | null
}

export default function PostReplies({
  repliesAmount,
  commentId,
  session
}: Props) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
    isRefetching
  } = useFetchCommentReplies({ commentId })
  const [showReplies, setShowReplies] = useState<boolean>(false)
  const [fetchReplies, setFetchReplies] = useState<boolean>(false)

  const handleShowReplies = () => {
    setShowReplies((prev) => {
      if (!fetchReplies) setFetchReplies(true)
      return !prev
    })
  }

  useEffect(() => {
    if (fetchReplies) refetch()
  }, [fetchReplies, refetch])

  const replies = data?.pages.flatMap((page) => page.replies)
  return (
    <section className='flex flex-col'>
      <Button
        className='self-start gap-2'
        variant='ghost'
        onClick={handleShowReplies}
      >
        {showReplies ? (
          <ChevronUp className='h-5 w-5 text-zinc-800' />
        ) : (
          <ChevronDown className='h-5 w-5 text-zinc-800' />
        )}
        {repliesAmount === 1
          ? repliesAmount + ' reply'
          : repliesAmount + ' replies'}
      </Button>
      {(isRefetching || isFetching) && fetchReplies && !isFetchingNextPage && (
        <div className='flex h-full self-start ml-2 py-2 pl-4 items-center justify-center'>
          <Loader2 className='h-8 w-8 animate-spin text-zinc-500' />
        </div>
      )}
      <div className='flex flex-col'>
        {showReplies &&
          replies &&
          replies.map((reply) => {
            const replyVotesAmount = reply.votes.reduce((acc, vote) => {
              if (vote.type === 'UP') return acc + 1
              if (vote.type === 'DOWN') return acc - 1
              return acc
            }, 0)
            const replyVote = reply.votes.find(
              (vote) => vote.userId === session?.user.id
            )
            return (
              <div
                key={reply.id}
                className='ml-2 py-2 pl-4 border-l-2 border-zinc-200'
              >
                <PostReply
                  reply={reply}
                  currentVote={replyVote}
                  votesAmount={replyVotesAmount}
                  commentId={commentId}
                />
              </div>
            )
          })}
        {showReplies && hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            disabled={isFetchingNextPage}
            variant='link'
            className='self-start'
          >
            Show more
          </Button>
        )}
      </div>
    </section>
  )
}
