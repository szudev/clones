import { getChatsByEmail } from '@/services/chats'
import { getSession } from 'next-auth/react'

export async function getAllChatsQuery() {
  const session = await getSession()
  const email = session?.user?.email!
  return await getChatsByEmail({ email })
}
