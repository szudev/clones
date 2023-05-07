import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Chat } from '@prisma/client'
import { useRouter } from 'next/router'
import { getAllChatsQuery } from './chats/queries'
import { createNewChatMutation } from './chats/mutations'

export default function useChats() {
  const { data, isLoading, isError, isFetched, error } = useQuery<
    Chat[],
    Error
  >(['chats'], getAllChatsQuery, {
    refetchOnWindowFocus: false
  })
  const router = useRouter()
  const queryClient = useQueryClient()

  const {
    mutate: newChatMutation,
    isLoading: isLoadingMutation,
    isError: isErrorMutation
  } = useMutation({
    mutationFn: createNewChatMutation,
    onSuccess: (newChat: Chat) => {
      queryClient.setQueryData(['chats'], (oldData?: Chat[]) => {
        if (oldData == null) return [newChat]
        return [...oldData, newChat]
      })
      router.push(`/chat/${newChat.id}`)
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
