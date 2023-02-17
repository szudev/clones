import { create } from 'zustand'
import { sendPromptProps } from '@/types/props.type'

type messageType = {
  id: number
  ia: boolean
  message: string
}

interface MessageState {
  messages: messageType[]
  sendPrompt: ({ prompt }: sendPromptProps) => Promise<void>
}

export const useMessageStore = create<MessageState>()((set, get) => ({
  messages: [],
  sendPrompt: async ({ prompt }) => {
    const messageIAid = get().messages.length + 1

    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: state.messages.length,
          ia: false,
          message: prompt
        },
        {
          id: messageIAid,
          ia: true,
          message: ''
        }
      ]
    }))

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      })

      const json = await response.json()
      set((state) => ({
        messages: state.messages.map((entry) => {
          if (entry.id === messageIAid) {
            return {
              ...entry,
              message: json.response
            }
          }
          return entry
        })
      }))
    } catch (error) {
      console.log({ path: 'sendPrompt from useMessageStore', error })
    }
  }
}))
