import {
  sendNewPromptWithChatId,
  regenerateAnswer,
  sendNewPromptWithoutChatId
} from '@/services/messages'
import {
  IMessageApiResponse,
  INewMessageWithoutChatIdResponse
} from '@/types/props.type'

interface ICreateNewMessageMutationProps {
  chatId: string
  prompt: string
  openAiKey: string
}

interface IRegenerateAnswerMutationProps {
  messageId: string
  prompt: string
  openAiKey: string
}

interface ICreateNewMessageWithoutChatIdMutationProps {
  email: string
  chatId: string
  prompt: string
  openAiKey: string
}

export async function createNewMessageMutation({
  chatId,
  prompt,
  openAiKey
}: ICreateNewMessageMutationProps): Promise<IMessageApiResponse> {
  return await sendNewPromptWithChatId({ chatId, prompt, openAiKey })
}

export async function regenerateAnswerMutation({
  messageId,
  prompt,
  openAiKey
}: IRegenerateAnswerMutationProps) {
  return await regenerateAnswer({ messageId, prompt, openAiKey })
}

export async function createNewMessageWithoutChatIdMutation({
  email,
  chatId,
  prompt,
  openAiKey
}: ICreateNewMessageWithoutChatIdMutationProps): Promise<INewMessageWithoutChatIdResponse> {
  if (chatId === '') {
    return await sendNewPromptWithoutChatId({ email, prompt, openAiKey })
  } else {
    return await sendNewPromptWithChatId({ chatId, prompt, openAiKey })
  }
}
