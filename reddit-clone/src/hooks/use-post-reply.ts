import { ReplyRequest } from '@/lib/validators/reply'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import useCustomToast from './use-custom-toast'
import { toast } from './use-toast'
import { Dispatch, SetStateAction } from 'react'

interface Props {
  setIsReplying: Dispatch<SetStateAction<boolean>>
  setInput: Dispatch<SetStateAction<string>>
}

export default function usePostReply({ setIsReplying, setInput }: Props) {
  const router = useRouter()
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
      return toast({
        title: 'Success',
        description: 'The reply was successfully registered.'
      })
    }
  })

  return { postReply, isPostReplyLoading }
}
