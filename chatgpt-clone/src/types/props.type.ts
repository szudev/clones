import { Chat } from '@prisma/client'
import { ReactNode } from 'react'

export type TypingEffectProps = {
  text: string
}

export type LayoutProps = {
  children: ReactNode
}

export type sendPromptProps = {
  prompt: string
}
