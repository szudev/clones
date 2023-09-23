import { CreateSubredditPayload } from '@/lib/validators/subreddit'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { toast } from './use-toast'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useCustomToast from './use-custom-toast'

export default function useCreateCommunity() {
  const [input, setInput] = useState<string>('')
  const router = useRouter()
  const { loginRequiredToast } = useCustomToast()

  const { mutate: createCommunity, isLoading: createCommunityLoading } =
    useMutation({
      mutationFn: async () => {
        const payload: CreateSubredditPayload = {
          name: input
        }

        const { data } = await axios.post('/api/subreddit', payload)
        return data as string
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          if (error.response?.status === 409) {
            return toast({
              title: 'Subreddit already exists.',
              description: 'Please type a different subreddit name.',
              variant: 'destructive'
            })
          }
          if (error.response?.status === 422) {
            return toast({
              title: 'Invalid subreddit name.',
              description:
                'Please type a name larger between 2 and 30 characters.',
              variant: 'destructive'
            })
          }
          if (error.response?.status === 401) {
            return loginRequiredToast()
          }
        }

        toast({
          title: 'An error occurred.',
          description: 'Could not create a subreddit.',
          variant: 'destructive'
        })
      },
      onSuccess: (data) => {
        router.push(`/r/${data}`)
      }
    })

  return { createCommunity, createCommunityLoading, input, setInput, router }
}
