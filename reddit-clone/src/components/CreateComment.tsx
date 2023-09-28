'use client'

import { useState } from 'react'
import { Label } from './ui/Label'
import { Textarea } from './ui/Textarea'
import { Button } from './ui/Button'
import { useMutation } from '@tanstack/react-query'
import { type CommentRequest } from '@/lib/validators/comment'
import axios, { AxiosError } from 'axios'
import useCustomToast from '@/hooks/use-custom-toast'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface Props {
  postId: string
  replyToId?: string
}

export default function CreateComment({ postId, replyToId }: Props) {
  const [input, setInput] = useState<string>('')
  const { loginRequiredToast } = useCustomToast()
  const router = useRouter()
  const { mutate: comment, isLoading: isCommentLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId
      }
      const { data } = await axios.patch(`/api/subreddit/post/comment`, payload)

      return data
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginRequiredToast()
        }
      }

      return toast({
        title: 'There was a problem',
        description: 'Something went wrong, please try again',
        variant: 'destructive'
      })
    },
    onSuccess: () => {
      router.refresh()
      setInput('')
      return toast({
        title: 'Success',
        description: 'Your comment was successfully registered.'
      })
    }
  })
  return (
    <div className='pt-4 grid w-full gap-1.5'>
      <Label htmlFor='comment'>Your comment</Label>
      <div className='mt-2'>
        <Textarea
          id='comment'
          placeholder='Add a comment here'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
        />
        <div className='mt-2 flex justify-end'>
          <Button
            isLoading={isCommentLoading}
            disabled={input.length === 0}
            onClick={() => comment({ postId, text: input, replyToId })}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  )
}
