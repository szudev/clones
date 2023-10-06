'use client'

import useCustomToast from '@/hooks/use-custom-toast'
import { toast } from '@/hooks/use-toast'
import { ReplyRequest } from '@/lib/validators/reply'
import { CommentReply, ReplyVote, User } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import UserAvatar from './UserAvatar'
import { formatTimeToNow } from '@/lib/utils'
import { Button } from './ui/Button'
import { useSession } from 'next-auth/react'
import { MessageSquare } from 'lucide-react'
import { Label } from './ui/Label'
import { Textarea } from './ui/Textarea'
import ReplyVotes from './ReplyVotes'
import usePostReply from '@/hooks/use-post-reply'

type ExtendedReply = CommentReply & {
  votes: ReplyVote[]
  author: User
}

interface Props {
  reply: ExtendedReply
  votesAmount: number
  currentVote: ReplyVote | undefined
  commentId: string
}

export default function PostReply({
  reply,
  currentVote,
  votesAmount,
  commentId
}: Props) {
  const commentRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()
  const { loginRequiredToast } = useCustomToast()
  const [isReplying, setIsReplying] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const { isPostReplyLoading, postReply } = usePostReply({
    setInput,
    setIsReplying
  })

  return (
    <div ref={commentRef} className='flex flex-col'>
      <div className='flex items-center'>
        <UserAvatar
          user={{
            image: reply.author.image || null,
            name: reply.author.name || null
          }}
          className='h-6 w-6'
        />
        <div className='ml-2 flex items-center gap-x-2'>
          <p className='text-sm font-medium text-gray-900'>
            u/{reply.author.username}
          </p>
          <p className='max-h-40 truncate text-xs text-zinc-500'>
            {formatTimeToNow(new Date(reply.createdAt))}
          </p>
        </div>
      </div>
      <p className='text-sm text-zinc-900 mt-2'>{reply.text}</p>
      <div className='flex gap-2 items-center'>
        <ReplyVotes
          replyId={reply.id}
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
        {isReplying ? (
          <div className='pt-4 grid w-full gap-1.5 flex-wrap'>
            <Label htmlFor={`reply-${reply.id}`}>Your reply</Label>
            <div className='mt-2'>
              <Textarea
                id={`reply-${reply.id}`}
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
                  disabled={input.length === 0}
                  onClick={() => {
                    if (!input) return
                    postReply({
                      commentId,
                      text: input
                    })
                  }}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
