import { getMessagesByChatId } from '@/services/messages'

export async function getMessagesQuery(chatId: string) {
  return await getMessagesByChatId({ chatId })
}
