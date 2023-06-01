import { create } from 'zustand'

interface ILoadingState {
  sendPromptWithChatIdLoading: boolean
  sendPromptWithOutChatIdLoading: boolean
  toggleWithChatIdLoading: (loadingValue: boolean) => void
  toggleWithoutChatIdLoading: (loadingValue: boolean) => void
}

export const useMutationLoadingsStore = create<ILoadingState>((set) => ({
  sendPromptWithChatIdLoading: false,
  sendPromptWithOutChatIdLoading: false,
  toggleWithChatIdLoading: (loadingValue) => {
    set(() => ({
      sendPromptWithChatIdLoading: loadingValue
    }))
  },
  toggleWithoutChatIdLoading: (loadingValue) => {
    set(() => ({
      sendPromptWithOutChatIdLoading: loadingValue
    }))
  }
}))
