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
}

interface IRegenerateAnswerMutationProps {
  messageId: string
  prompt: string
}

interface ICreateNewMessageWithoutChatIdMutationProps {
  email: string
  chatId: string
  prompt: string
}

export async function createNewMessageMutation({
  chatId,
  prompt
}: ICreateNewMessageMutationProps): Promise<IMessageApiResponse> {
  return await sendNewPromptWithChatId({ chatId, prompt })
}

export async function regenerateAnswerMutation({
  messageId,
  prompt
}: IRegenerateAnswerMutationProps) {
  return await regenerateAnswer({ messageId, prompt })
}

export async function createNewMessageWithoutChatIdMutation({
  email,
  chatId,
  prompt
}: ICreateNewMessageWithoutChatIdMutationProps): Promise<INewMessageWithoutChatIdResponse> {
  if (chatId === '') {
    return await sendNewPromptWithoutChatId({ email, prompt })
  } else {
    return await sendNewPromptWithChatId({ chatId, prompt })
  }
}
