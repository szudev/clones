'use client'

import { useRef, useState } from 'react'
import UserAvatar from './UserAvatar'
import { Comment, CommentVote, User } from '@prisma/client'
import { formatTimeToNow } from '@/lib/utils'
import CommentVotes from './CommentVotes'
import { Button } from './ui/Button'
import { MessageSquare } from 'lucide-react'
import useCustomToast from '@/hooks/use-custom-toast'
import { Label } from './ui/Label'
import { Textarea } from './ui/Textarea'
import usePostReply from '@/hooks/use-post-reply'
import PostReplies from './PostReplies'
import { Session } from 'next-auth'

type ExtendedComment = Comment & {
  votes: CommentVote[]
  author: User
}

interface Props {
  comment: ExtendedComment
  votesAmount: number
  currentVote: CommentVote | undefined
  repliesAmount: number
  session: Session | null
}

export default function PostComment({
  comment,
  votesAmount,
  currentVote,
  repliesAmount,
  session
}: Props) {
  const commentRef = useRef<HTMLDivElement>(null)
  const { loginRequiredToast } = useCustomToast()
  const [isReplying, setIsReplying] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')

  const { isPostReplyLoading, postReply } = usePostReply({
    setInput,
    setIsReplying,
    commentId: comment.id
  })

  return (
    <div ref={commentRef} className='flex flex-col'>
      <div className='flex flex-col'>
        <div className='flex items-center'>
          <UserAvatar
            user={{
              image: comment.author.image || null,
              name: comment.author.name || null
            }}
            className='h-6 w-6'
          />
          <div className='ml-2 flex items-center gap-x-2'>
            <p className='text-sm font-medium text-gray-900'>
              u/{comment.author.username}
            </p>
            <p className='max-h-40 truncate text-xs text-zinc-500'>
              {formatTimeToNow(new Date(comment.createdAt))}
            </p>
          </div>
        </div>
        <p className='text-sm text-zinc-900 mt-2'>{comment.text}</p>
        <div className='flex flex-col gap-2'>
          <div className='flex gap-2 items-start'>
            <CommentVotes
              commentId={comment.id}
              initialVotesAmount={votesAmount}
              initialVote={currentVote}
            />
            <Button
              variant='ghost'
              size='xs'
              aria-label='reply'
              onClick={() => {
                if (!session) return loginRequiredToast()
                setIsReplying((prev) => !prev)
              }}
            >
              <MessageSquare className='h-4 w-4 mr-1.5' />
              Reply
            </Button>
          </div>
          {isReplying ? (
            <div className='pt-4 grid w-full gap-1.5 flex-wrap'>
              <Label htmlFor={`reply-${comment.id}`}>Your reply</Label>
              <div className='mt-2'>
                <Textarea
                  id={`reply-${comment.id}`}
                  placeholder='Add a reply here'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={1}
                />
                <div className='mt-2 flex justify-end gap-1'>
                  <Button
                    tabIndex={-1}
                    variant='subtle'
                    onClick={() => setIsReplying(false)}
                    disabled={isPostReplyLoading}
                  >
                    Close
                  </Button>
                  <Button
                    isLoading={isPostReplyLoading}
                    disabled={input.length === 0 || isPostReplyLoading}
                    onClick={() => {
                      if (!input) return
                      postReply({
                        commentId: comment.id,
                        text: input
                      })
                    }}
                  >
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {repliesAmount > 0 && (
        <PostReplies
          repliesAmount={repliesAmount}
          commentId={comment.id}
          session={session}
          postReply={postReply}
          isPostReplyLoading={isPostReplyLoading}
        />
      )}
    </div>
  )
}
