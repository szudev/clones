import { createNewMessage } from '@/services/messages'
import { IMessageApiResponse } from '@/types/props.type'

interface ICreateNewMessageMutationProps {
  chatId: string
  prompt: string
  answer: string | null
}

export async function createNewMessageMutation({
  chatId,
  prompt,
  answer
}: ICreateNewMessageMutationProps): Promise<IMessageApiResponse> {
  return await createNewMessage({ chatId, prompt, answer })
}
