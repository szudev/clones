import { NextApiRequest, NextApiResponse } from 'next'
import { getMessageById } from '@/lib/prisma/message'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { messageId } = req.query as { messageId: string }

    if (!messageId) {
      return res.status(400).json({ error: 'chatId is required.' })
    }

    try {
      const { message } = await getMessageById({ messageId })
      return res.status(200).json({ message })
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  res.setHeader('Allow', ['GET'])
  res.status(425).end(`Method ${req.method} is not allowed.`)
}
