import { getMessagesByChatId } from '@/lib/prisma/message'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const chatId = req.query.chatId as string
    if (!chatId) {
      return res.status(400).json({ error: 'chatId is required.' })
    }
    try {
      const { messages } = await getMessagesByChatId({ chatId })
      return res.status(200).json({ messages })
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  res.setHeader('Allow', ['GET'])
  res.status(425).end(`Method ${req.method} is not allowed.`)
}
