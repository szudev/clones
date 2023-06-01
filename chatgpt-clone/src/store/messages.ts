import { create } from 'zustand'
import { Answer } from '@prisma/client'

type messageType = {
  id: string
  message: string
  answer: Omit<Answer, 'messageId'> | null
}

interface MessageState {
  temporaryChat: {
    chatId: string
    messages: messageType[]
  }
  addMessage: (newMessage: messageType) => void
  updateMessage: (
    chatId: string,
    messageId: string,
    newMessageId: string,
    newAnswerId: string,
    newAnswer: string
  ) => void
  removeLastMessage: () => void
  clearMessages: () => void
}

export const useMessageStore = create<MessageState>((set) => ({
  temporaryChat: {
    chatId: '',
    messages: []
  },
  addMessage: (newMessage) =>
    set((state) => ({
      temporaryChat: {
        ...state.temporaryChat,
        messages: [...state.temporaryChat.messages, newMessage]
      }
    })),
  updateMessage: (chatId, messageId, newMessageId, newAnswerId, newAnswer) =>
    set((state) => ({
      temporaryChat: {
        chatId,
        messages: state.temporaryChat.messages.map((message) =>
          message.id === messageId
            ? {
                ...message,
                id: newMessageId,
                answer: {
                  ...message.answer,
                  id: newAnswerId,
                  answer: newAnswer
                }
              }
            : message
        )
      }
    })),
  removeLastMessage: () => {
    set((state) => ({
      temporaryChat: {
        ...state.temporaryChat,
        messages: state.temporaryChat.messages.slice(0, -1)
      }
    }))
  },
  clearMessages: () =>
    set({
      temporaryChat: {
        chatId: '',
        messages: []
      }
    })
}))
