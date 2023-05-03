import { create } from 'zustand'
import { Chat, Message } from '@prisma/client'

type ChatProps = {
  email: string
}

export interface ChatsType extends Chat {
  messages: Message[]
}

interface ChatState {
  chats: ChatsType[]
  clientLoading: boolean
  serverLoading: boolean
  errorClient: string
  errorServer: string
  createNewChat: ({ email }: ChatProps) => Promise<string | void>
  getChatsClient: ({ email }: ChatProps) => Promise<void>
  setChats: (chats: ChatsType[]) => void
  setErrorServer: (error: string) => void
}

export const useChatStore = create<ChatState>()((set, get) => ({
  chats: [],
  clientLoading: false,
  serverLoading: true,
  errorClient: '',
  errorServer: '',
  createNewChat: async ({ email }) => {
    set({ clientLoading: true })
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/chats`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        }
      )

      const json = await response.json()
      set((state) => ({
        chats: [...state.chats, json.chat],
        clientLoading: false
      }))
      return json.chat.id as string
    } catch (error) {
      set({ errorClient: error as string, clientLoading: false })
    }
  },
  getChatsClient: async ({ email }) => {
    set({ clientLoading: true })
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/chats`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        }
      )
      const { chats } = await response.json()
      set(() => ({
        chats,
        loading: false
      }))
    } catch (error) {
      set({ errorClient: error as string, clientLoading: false })
    }
  },
  setChats: (chats) => {
    set({ chats, serverLoading: false })
  },
  setErrorServer: (error) => {
    set({ errorServer: error })
  }
}))
