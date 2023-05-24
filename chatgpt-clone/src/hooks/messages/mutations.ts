import { sendNewPromptWithChatId, regenerateAnswer } from '@/services/messages'
import { IMessageApiResponse } from '@/types/props.type'

interface ICreateNewMessageMutationProps {
  chatId: string
  prompt: string
}

interface IRegenerateAnswerMutationProps {
  messageId: string
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
