import { NextApiRequest, NextApiResponse } from 'next'
import {
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessageRoleEnum
} from 'openai'
import { promptInitialInstructions } from '@/utils/promptConfig'

const INITIAL_MESSAGES = [
  {
    role: ChatCompletionRequestMessageRoleEnum.System,
    content: promptInitialInstructions
  }
]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).end()
  const { prompt, openAiKey } = req.body

  if (!prompt || !openAiKey) {
    return res.status(400).json({ error: 'Required values missing.' })
  }

  try {
    const newConfig = new Configuration({
      apiKey: openAiKey
    })

    const newOpenai = new OpenAIApi(newConfig)

    const completion = await newOpenai.createChatCompletion({
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
