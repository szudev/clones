'use client'

import useCustomToast from '@/hooks/use-custom-toast'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { CommentVoteRequest } from '@/lib/validators/vote'
import { usePrevious } from '@mantine/hooks'
import { CommentVote, VoteType } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { ArrowBigUp, ArrowBigDown } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/Button'

interface Props {
  commentId: string
  initialVotesAmount: number
  initialVote?: Pick<CommentVote, 'type'>
}

export default function CommentVotes({
  initialVotesAmount,
  commentId,
  initialVote
}: Props) {
  const { loginRequiredToast } = useCustomToast()
  const [votesAmount, setVotesAmount] = useState<number>(initialVotesAmount)
  const [currentVote, setCurrentVote] = useState(initialVote)
  const prevVote = usePrevious(currentVote)

  const { mutate: vote, isLoading: isVoteLoading } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: CommentVoteRequest = {
        commentId,
        voteType
      }

      await axios.patch('/api/subreddit/post/comment/vote', payload)
    },
    onError: (err, voteType) => {
      if (voteType === 'UP') {
        setVotesAmount((prev) => prev - 1)
      } else {
        setVotesAmount((prev) => prev + 1)
      }
      setCurrentVote(prevVote)

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginRequiredToast()
        }
      }

      return toast({
        title: 'Something went wrong',
        description: 'Your vote was not registered, try again later.',
        variant: 'destructive'
      })
    },
    onMutate: (type: VoteType) => {
      if (currentVote?.type === type) {
        setCurrentVote(undefined)
        if (type === 'UP') setVotesAmount((prev) => prev - 1)
        else if (type === 'DOWN') setVotesAmount((prev) => prev + 1)
      } else {
        setCurrentVote({ type })
        if (type === 'UP')
          setVotesAmount((prev) => prev + (currentVote ? 2 : 1))
        else if (type === 'DOWN')
          setVotesAmount((prev) => prev - (currentVote ? 2 : 1))
      }
    }
  })

  return (
    <div className='flex gap-1'>
      <Button
        onClick={() => vote('UP')}
        size='sm'
        variant='ghost'
        aria-label='upvote'
        disabled={isVoteLoading}
      >
        <ArrowBigUp
          className={cn('h-5 w-5 text-zinc-700', {
            'text-emerald-500 fill-emerald-500': currentVote?.type === 'UP'
          })}
        />
      </Button>
      <p className='text-center py-2 font-medium text-sm text-zinc-900'>
        {votesAmount}
      </p>
      <Button
        onClick={() => vote('DOWN')}
        size='sm'
        variant='ghost'
        aria-label='downvote'
        disabled={isVoteLoading}
      >
        <ArrowBigDown
          className={cn('h-5 w-5 text-zinc-700', {
            'text-red-500 fill-red-500': currentVote?.type === 'DOWN'
          })}
        />
      </Button>
    </div>
  )
}
