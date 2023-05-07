import { createNewChat, deleteChatByChatId } from '@/services/chats'
import { getSession } from 'next-auth/react'

export async function createNewChatMutation() {
  const session = await getSession()
  const email = session?.user?.email!
  return await createNewChat({ email })
}

export async function deleteChatMutation(chatId: string) {
  const session = await getSession()
  const email = session?.user?.email!
  return await deleteChatByChatId({ chatId, email })
}
