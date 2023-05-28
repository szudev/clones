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

export type TTemporaryMessage = {
  id: string
  message: string
  answer: Omit<Answer, 'messageId'> | null
}

export interface INewMessageWithoutChatIdResponse {
  id: string
  answer: Answer | null
  message: string
  chatId: string
}
