import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createNewMessageMutation,
  regenerateAnswerMutation,
  createNewMessageWithoutChatIdMutation
} from './mutations'
import {
  IMessageApiResponse,
  INewMessageWithoutChatIdResponse,
  TTemporaryMessage
} from '@/types/props.type'
import { generateTemporaryIds } from '@/utils/uuid'
import { displayToast } from '@/utils/toastify'
import { useSession } from 'next-auth/react'
import { useMessageStore } from '@/store/messages'
import { useMutationLoadingsStore } from '@/store/mutationLoadings'
import { useEffect } from 'react'
import { useOpenAiKeyStore } from '@/store/openAIKey'

export function useSendPromptWithChatIdMutation() {
  const queryClient = useQueryClient()
  const { sendPromptWithChatIdLoading, toggleWithChatIdLoading } =
    useMutationLoadingsStore((state) => state)

  const {
    mutate: sendPromptWithChatIdMutate,
    isLoading: isSendPromptWithChatIdMutationLoading
  } = useMutation({
    mutationFn: createNewMessageMutation,
    onMutate: async (messageProps) => {
      //Generamos un array<string> con 2 id temporales
      //Estas ids serán utilizadas para realizar un optimistic update
      //una vez acabe el mutate, ya sea exitoso o en error,
      //se realizará una invalidación de la query del chat para actualizar el cache
      //con los datos verdaderos (obtenidos de la base de datos)
      const { temporaryIds } = generateTemporaryIds(1)
      await queryClient.cancelQueries(['messages', messageProps.chatId])
      /*const previousMessages = queryClient.getQueryData([
        'messages',
        messageProps.chatId
      ])*/
      queryClient.setQueryData(
        ['messages', messageProps.chatId],
        (oldData?: IMessageApiResponse[]) => {
          const newMessage: IMessageApiResponse = {
            id: temporaryIds[0],
            message: messageProps.prompt,
            answer: null
          }
          if (oldData == null) return [newMessage]
          return [...oldData, newMessage]
        }
      )
      return { chatId: messageProps.chatId }
    },
    onError: (error: Error, variables, context) => {
      /*if (context?.previousMessages != null) {
        queryClient.setQueryData(
          ['messages', context.chatId],
          context.previousMessages
        )
      }*/
      displayToast({ message: error.message, toastType: 'error' })
    },
    onSettled: async (data, error, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: ['messages', context?.chatId]
      })
    }
  })

  useEffect(() => {
    toggleWithChatIdLoading(isSendPromptWithChatIdMutationLoading)
  }, [isSendPromptWithChatIdMutationLoading])

  return {
    sendPromptWithChatIdMutate,
    sendPromptWithChatIdLoading
  }
}

export function useSendPromptWithoutChatIdMutation() {
  const { data } = useSession()
  const email = data?.user?.email as string
  const queryClient = useQueryClient()
  const { openAiKey } = useOpenAiKeyStore((state) => state)
  const {
    addMessage,
    updateMessage,
    removeLastMessage,
    temporaryChat: { chatId }
  } = useMessageStore((state) => state)
  const { sendPromptWithOutChatIdLoading, toggleWithoutChatIdLoading } =
    useMutationLoadingsStore((state) => state)

  const {
    mutate: sendPromptWithoutChatIdMutate,
    isLoading: isSendPromptWithoutChatIdMutationLoading
  } = useMutation({
    mutationFn: async ({ prompt }: { prompt: string }) =>
      await createNewMessageWithoutChatIdMutation({
        email,
        chatId,
        prompt,
        openAiKey
      }),
    onMutate: (messageProps) => {
      const { temporaryIds } = generateTemporaryIds(1)
      const newTemporaryMessage: TTemporaryMessage = {
        id: temporaryIds[0],
        message: messageProps.prompt,
        answer: null
      }
      addMessage(newTemporaryMessage)

      return {
        temporaryMessageId: newTemporaryMessage.id
      }
    },
    onSuccess: async (
      data: INewMessageWithoutChatIdResponse,
      variables,
      context
    ) => {
      updateMessage(
        data.chatId,
        context?.temporaryMessageId!,
        data.id,
        data.answer?.id!,
        data.answer?.answer!
      )
      await queryClient.invalidateQueries({ queryKey: ['chats'] })
    },
    onError: (error: Error) => {
      displayToast({ message: error.message, toastType: 'error' })
      removeLastMessage()
    }
  })

  useEffect(() => {
    toggleWithoutChatIdLoading(isSendPromptWithoutChatIdMutationLoading)
  }, [isSendPromptWithoutChatIdMutationLoading])

  return {
    sendPromptWithoutChatIdMutate,
    sendPromptWithOutChatIdLoading
  }
}

export function useRegenerateAnswerMutation() {
  const queryClient = useQueryClient()

  const { mutate, isLoading } = useMutation({
    mutationFn: regenerateAnswerMutation,
    onSuccess: async (newAnswer) => {
      await queryClient.invalidateQueries([
        'messages',
        newAnswer.message.chatId
      ])
    },
    onError: (error: Error) => {
      displayToast({ message: error.message, toastType: 'error' })
    }
  })

  return {
    regenerateAnswerMutate: mutate,
    isRegenerateAnswerMutationLoading: isLoading
  }
}
