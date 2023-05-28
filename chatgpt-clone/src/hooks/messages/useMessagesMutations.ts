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
import { useRouter } from 'next/router'
import { generateTemporaryIds } from '@/utils/uuid'
import { displayToast } from '@/utils/toastify'
import { useSession } from 'next-auth/react'
import { useMessageStore } from '@/store/messages'

export function useNewMessageMutation() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const hasChatId = router.query.id
  const { data } = useSession()
  const {
    addMessage,
    updateMessage,
    temporaryChat: { chatId }
  } = useMessageStore((state) => state)
  const email = data?.user?.email as string

  if (hasChatId) {
    const { mutate, isLoading } = useMutation({
      mutationFn: async ({ prompt }: { prompt: string }) =>
        await createNewMessageMutation({ chatId: hasChatId as string, prompt }),
      onMutate: async (messageProps) => {
        //Generamos un array<string> con 2 id temporales
        //Estas ids serán utilizadas para realizar un optimistic update
        //una vez acabe el mutate, ya sea exitoso o en error,
        //se realizará una invalidación de la query del chat para actualizar el cache
        //con los datos verdaderos (obtenidos de la base de datos)
        const { temporaryIds } = generateTemporaryIds(2)
        await queryClient.cancelQueries(['messages', hasChatId])
        const previousMessages = queryClient.getQueryData([
          'messages',
          hasChatId
        ])
        queryClient.setQueryData(
          ['messages', hasChatId],
          (oldData?: IMessageApiResponse[]) => {
            const newMessage: IMessageApiResponse = {
              id: temporaryIds[0],
              message: messageProps.prompt,
              answer: {
                id: temporaryIds[1],
                answer: ''
              }
            }
            if (oldData == null) return [newMessage]
            return [...oldData, newMessage]
          }
        )
        return { previousMessages, chatId: hasChatId }
      },
      onError: (error: Error, variables, context) => {
        if (context?.previousMessages != null) {
          queryClient.setQueryData(
            ['messages', context.chatId],
            context.previousMessages
          )
        }
        displayToast({ message: error.message, toastType: 'error' })
      },
      onSettled: async (data, error, variables, context) => {
        await queryClient.invalidateQueries({
          queryKey: ['messages', context?.chatId]
        })
      }
    })

    return {
      createMessagemutation: mutate,
      isCreateMessageMutationLoading: isLoading
    }
  } else {
    const { mutate, isLoading } = useMutation({
      mutationFn: async ({ prompt }: { prompt: string }) =>
        await createNewMessageWithoutChatIdMutation({ email, chatId, prompt }),
      onMutate: (messageProps) => {
        const { temporaryIds } = generateTemporaryIds(2)
        const newTemporaryMessage: TTemporaryMessage = {
          id: temporaryIds[0],
          message: messageProps.prompt,
          answer: {
            id: temporaryIds[1],
            answer: ''
          }
        }
        addMessage(newTemporaryMessage)

        return { temporaryMessageId: newTemporaryMessage.id }
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
      }
    })

    return {
      createMessagemutation: mutate,
      isCreateMessageMutationLoading: isLoading
    }
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
