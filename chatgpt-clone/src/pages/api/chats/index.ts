import { createNewChat, getChats, deleteChat } from '@/lib/prisma/chat'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' })
    }
    try {
      const { chat, error } = await createNewChat({ email })
      if (error) return res.status(500).json({ error })
      return res.status(200).json({ chat })
    } catch (error) {
      return res.status(500).json({ error })
    }
  }
  if (req.method === 'GET') {
    const email = req.query.email as string
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' })
    }
    try {
      const { chats } = await getChats({ email })
      return res.status(200).json({ chats })
    } catch (error) {
      return res.status(500).json({ error })
    }
  }
  if (req.method === 'DELETE') {
    const { chatId, email } = req.body
    if (!chatId || !email)
      return res.status(400).json({ error: 'Missing required values.' })
    try {
      const { deletedChat, error } = await deleteChat({ chatId, email })
      if (error) return res.status(500).json({ error })
      return res.status(200).json({ deletedChat })
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
  res.status(425).end(`Method ${req.method} is not allowed.`)
}
