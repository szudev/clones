'use client'

import useCustomToast from '@/hooks/use-custom-toast'
import { usePrevious } from '@mantine/hooks'
import { VoteType } from '@prisma/client'
import { useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { PostVoteRequest } from '@/lib/validators/vote'
import axios, { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'

interface Props {
  postId: string
  initialVotesAmount: number
  initialVote?: VoteType | null
}

export default function PostVoteClient({
  postId,
  initialVotesAmount,
  initialVote
}: Props) {
  const { loginRequiredToast } = useCustomToast()
  const [votesAmount, setVotesAmount] = useState<number>(initialVotesAmount)
  const [currentVote, setCurrentVote] = useState(initialVote)
  const prevVote = usePrevious(currentVote)

  useEffect(() => {
    setCurrentVote(initialVote)
  }, [initialVote])

  const { mutate: vote, isLoading: isVoteLoading } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: PostVoteRequest = {
        postId,
        voteType
      }

      await axios.patch('/api/subreddit/post/vote', payload)
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
      if (currentVote === type) {
        setCurrentVote(undefined)
        if (type === 'UP') setVotesAmount((prev) => prev - 1)
        else if (type === 'DOWN') setVotesAmount((prev) => prev + 1)
      } else {
        setCurrentVote(type)
        if (type === 'UP')
          setVotesAmount((prev) => prev + (currentVote ? 2 : 1))
        else if (type === 'DOWN')
          setVotesAmount((prev) => prev - (currentVote ? 2 : 1))
      }
    }
  })

  return (
    <div className='flex items-center gap-1 justify-center md:flex-col'>
      <Button
        onClick={(e) => {
          e.stopPropagation()
          vote('UP')
        }}
        size='sm'
        variant='ghost'
        aria-label='upvote'
        disabled={isVoteLoading}
      >
        <ArrowBigUp
          className={cn('h-5 w-5 text-zinc-700', {
            'text-emerald-500 fill-emerald-500': currentVote === 'UP'
          })}
        />
      </Button>
      <p className='text-center font-medium text-sm text-zinc-900'>
        {votesAmount}
      </p>
      <Button
        onClick={(e) => {
          e.stopPropagation()
          vote('DOWN')
        }}
        size='sm'
        variant='ghost'
        aria-label='downvote'
        disabled={isVoteLoading}
      >
        <ArrowBigDown
          className={cn('h-5 w-5 text-zinc-700', {
            'text-red-500 fill-red-500': currentVote === 'DOWN'
          })}
        />
      </Button>
    </div>
  )
}
