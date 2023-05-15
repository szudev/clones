import { ReactNode } from 'react'
import { Message, Answer } from '@prisma/client'

export type TypingEffectProps = {
  text: string
}

export type LayoutProps = {
  children: ReactNode
}

export type sendPromptProps = {
  prompt: string
}

export interface IMessageApiResponse extends Omit<Message, 'chatId'> {
  answer: Omit<Answer, 'messageId'> | null
}
