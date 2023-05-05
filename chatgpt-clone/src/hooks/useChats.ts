import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getChatsByEmail, createNewChat } from '@/services/chats'
import { getSession } from 'next-auth/react'
import { Chat } from '@prisma/client'
import { useRouter } from 'next/router'

export default function useChats() {
  const { data, isLoading, isError, isFetched, error } = useQuery<
    Chat[],
    Error
  >(
    ['chats'],
    async () => {
      const session = await getSession()
      const email = session?.user?.email!
      return await getChatsByEmail({ email })
    },
    {
      refetchOnWindowFocus: false
    }
  )
  const router = useRouter()
  const queryClient = useQueryClient()

  const {
    mutate: newChatMutation,
    isLoading: isLoadingMutation,
    isError: isErrorMutation
  } = useMutation({
    mutationFn: async () => {
      const session = await getSession()
      const email = session?.user?.email!
      return await createNewChat({ email })
    },
    onSuccess: (newChat: Chat) => {
      queryClient.setQueryData(['chats'], (oldData?: Chat[]) => {
        if (oldData == null) return [newChat]
        return [...oldData, newChat]
      })
      router.push(`/chat/${newChat.id}`, undefined, { shallow: true })
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['chats'] })
    }
  })

  return {
    chats: data,
    isLoading,
    isError,
    isFetched,
    error,
    newChatMutation,
    isLoadingMutation,
    router
  }
}
