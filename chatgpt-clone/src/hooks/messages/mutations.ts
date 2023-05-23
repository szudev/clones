import { sendNewPromptWithChatId } from '@/services/messages'
import { IMessageApiResponse } from '@/types/props.type'

interface ICreateNewMessageMutationProps {
  chatId: string
  prompt: string
}

export async function createNewMessageMutation({
  chatId,
  prompt
}: ICreateNewMessageMutationProps): Promise<IMessageApiResponse> {
  return await sendNewPromptWithChatId({ chatId, prompt })
}
