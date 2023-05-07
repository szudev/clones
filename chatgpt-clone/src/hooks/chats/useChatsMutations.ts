import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { createNewChatMutation, deleteChatMutation } from './mutations'
import { Chat } from '@prisma/client'

export function useNewChatMutation() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const {
    mutate: newChatMutation,
    isLoading: isCreateNewChatMutationLoading,
    isError: isCreateNewChatErrorMutation
  } = useMutation({
    mutationFn: createNewChatMutation,
    onSuccess: (newChat: Chat) => {
      router.push(`/chat/${newChat.id}`)
      queryClient.setQueryData(['chats'], (oldData?: Chat[]) => {
        if (oldData == null) return [newChat]
        return [...oldData, newChat]
      })
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['chats'] })
    }
  })

  return {
    newChatMutation,
    isCreateNewChatMutationLoading,
    isCreateNewChatErrorMutation,
    router
  }
}

export function useDeleteChatMutation() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const {
    mutate: removeChatMutation,
    isLoading: isDeleteChatMutationLoading,
    isError: isDeleteChatMutationError
  } = useMutation({
    mutationFn: deleteChatMutation,
    onSuccess: (deletedChat: Chat) => {
      queryClient.setQueryData(['chats'], (oldData?: Chat[]) => {
        if (oldData == null || oldData.length === 0) return []
        return oldData.filter((chat) => chat.id !== deletedChat.id)
      })
      router.push('/chat')
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['chats'] })
    }
  })

  return {
    removeChatMutation,
    isDeleteChatMutationLoading,
    isDeleteChatMutationError
  }
}
