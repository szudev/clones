'use client'

import { useRef, useState } from 'react'
import UserAvatar from './UserAvatar'
import { Comment, CommentVote, User } from '@prisma/client'
import { formatTimeToNow } from '@/lib/utils'
import CommentVotes from './CommentVotes'
import { Button } from './ui/Button'
import { MessageSquare } from 'lucide-react'
import { useSession } from 'next-auth/react'
import useCustomToast from '@/hooks/use-custom-toast'
import { Label } from './ui/Label'
import { Textarea } from './ui/Textarea'
import { useMutation } from '@tanstack/react-query'
import { CommentRequest } from '@/lib/validators/comment'
import axios, { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

type ExtendedComment = Comment & {
  votes: CommentVote[]
  author: User
}

interface Props {
  comment: ExtendedComment
  votesAmount: number
  currentVote: CommentVote | undefined
  postId: string
}

export default function PostComment({
  comment,
  votesAmount,
  currentVote,
  postId
}: Props) {
  const commentRef = useRef<HTMLDivElement>(null)
  const { loginRequiredToast } = useCustomToast()
  const { data: session } = useSession()
  const [isReplying, setIsReplying] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const router = useRouter()
  const { mutate: reply, isLoading: isReplyLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId
      }

      const { data } = await axios.patch('/api/subreddit/post/comment', payload)
      return data
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginRequiredToast()
        }
      }

      return toast({
        title: 'Something went wrong',
        description: 'Reply wasn`t registered, please try again.',
        variant: 'destructive'
      })
    },
    onSuccess: () => {
      router.refresh()
      setIsReplying(false)
      setInput('')
      return toast({
        title: 'Success',
        description: 'The reply was successfully registered.'
      })
    }
  })

  return (
    <div ref={commentRef} className='flex flex-col'>
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
      <div className='flex gap-2 items-center'>
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
        {isReplying ? (
          <div className='pt-4 grid w-full gap-1.5 flex-wrap'>
            <Label htmlFor={`reply-${comment.replyToId ?? comment.id}`}>
              Your reply
            </Label>
            <div className='mt-2'>
              <Textarea
                id={`reply-${comment.replyToId ?? comment.id}`}
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
                  disabled={isReplyLoading}
                >
                  Close
                </Button>
                <Button
                  isLoading={isReplyLoading}
                  disabled={input.length === 0}
                  onClick={() => {
                    if (!input) return
                    reply({
                      postId,
                      text: input,
                      replyToId: comment.replyToId ?? comment.id
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
