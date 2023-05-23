import { createAnswer } from '@/lib/prisma/answer'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { answer, messageId } = req.body
    if (!answer || !messageId)
      return res.status(400).json('Missing required values.')
    try {
      const { newAnswer } = await createAnswer({ answer, messageId })
      return res.status(201).json({ newAnswer })
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  res.setHeader('Allow', ['POST'])
  res.status(425).end(`Method ${req.method} is not allowed.`)
}
