import { ReplyRequest } from '@/lib/validators/reply'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import useCustomToast from './use-custom-toast'
import { toast } from './use-toast'
import { Dispatch, SetStateAction } from 'react'
import useFetchCommentReplies from './use-fetch-comment-replies'

interface Props {
  setIsReplying: Dispatch<SetStateAction<boolean>>
  setInput: Dispatch<SetStateAction<string>>
  commentId: string
}

export default function usePostReply({
  setIsReplying,
  setInput,
  commentId
}: Props) {
  const router = useRouter()
  const { refetch } = useFetchCommentReplies({ commentId })
  const { loginRequiredToast } = useCustomToast()
  const { mutate: postReply, isLoading: isPostReplyLoading } = useMutation({
    mutationFn: async ({ commentId, text }: ReplyRequest) => {
      const payload: ReplyRequest = {
        commentId,
        text
      }

      const { data } = await axios.patch(
        '/api/subreddit/post/comment/reply',
        payload
      )
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
      refetch()
      return toast({
        title: 'Success',
        description: 'The reply was successfully registered.'
      })
    }
  })

  return { postReply, isPostReplyLoading }
}
