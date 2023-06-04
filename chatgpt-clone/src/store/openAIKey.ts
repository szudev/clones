import { create } from 'zustand'

interface IOpenAiKeyState {
  openAiKey: string
  keySetted: boolean
  setKey: (key: string) => void
  clearKey: () => void
}

export const useOpenAiKeyStore = create<IOpenAiKeyState>((set) => ({
  openAiKey: process.env.NEXT_PUBLIC_DEFAULT_OPENAI_KEY ?? '',
  keySetted: false,
  setKey: (key) =>
    set(() => ({
      openAiKey: key,
      keySetted: true
    })),
  clearKey: () =>
    set({
      openAiKey: '',
      keySetted: false
    })
}))
