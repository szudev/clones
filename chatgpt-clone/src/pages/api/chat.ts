import { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

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
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Simulate that you are the conversational AI of ChatGPT and give an answer to the follow prompt:\n\n${prompt}`,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    })

    if (response.status !== 200) {
      return res.status(500).json({ error: 'OPENAI API error' })
    }

    return res
      .status(200)
      .json({ response: response.data.choices[0].text?.trim() })
  } catch (error) {
    return res.status(500).json({ error })
  }
}
