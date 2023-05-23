import { NextApiRequest, NextApiResponse } from 'next'
import {
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessageRoleEnum
} from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

const INITIAL_MESSAGES = [
  {
    role: ChatCompletionRequestMessageRoleEnum.System,
    content:
      'I will send you prompts and u will answer those prompts, please only put the answer and keep in mind that those prompt can be in any languaje'
  }
]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).end()
  const { prompt } = req.body

  if (!prompt) {
    return res.status(400).json({ error: 'Promp is required.' })
  }

  try {
    const completion = await openai.createChatCompletion({
      //text-davinci-003
      model: 'gpt-3.5-turbo',
      temperature: 0,
      messages: [
        ...INITIAL_MESSAGES,
        {
          role: ChatCompletionRequestMessageRoleEnum.User,
          content: prompt
        }
      ]
    })

    return res
      .status(200)
      .json({ response: completion.data.choices[0].message?.content ?? '' })
  } catch (error) {
    return res.status(500).json({ error })
  }
}
