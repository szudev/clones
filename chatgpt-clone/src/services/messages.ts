import { INewMessageWithoutChatIdResponse } from '@/types/props.type'

interface IGetMessagesByChatIdProps {
  chatId: string
}

interface ICreateNewMessageProps extends IGetMessagesByChatIdProps {
  prompt: string
}

interface IRegenerateAnswerProps {
  messageId: string
  prompt: string
}

interface IsendNewPromptWithoutChatIdProps {
  email: string
  prompt: string
}

export async function getMessagesByChatId({
  chatId
}: IGetMessagesByChatIdProps) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/messages?chatId=${chatId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  if (!response.ok) {
    throw new Error(
      'History is temporarily unavailable. We are working to restore this feature as soon as possible.'
    )
  }

  const json = await response.json()
  return json.messages
}

export async function sendNewPromptWithChatId({
  chatId,
  prompt
}: ICreateNewMessageProps): Promise<INewMessageWithoutChatIdResponse> {
  const newMessageResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ chatId, prompt })
    }
  )

  if (!newMessageResponse.ok) {
    throw new Error(
      'Messages are temporarily unavailable. We are working to restore this feature as soon as possible.'
    )
  }

  const { newMessage } = await newMessageResponse.json()

  const chatGPtResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/chat`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    }
  )

  if (!chatGPtResponse.ok) {
    throw new Error('OPENAI api error.')
  }

  const { response: gptResponse } = await chatGPtResponse.json()

  const newAnswerResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/answer`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ answer: gptResponse, messageId: newMessage.id })
    }
  )

  if (!newAnswerResponse.ok) {
    throw new Error('Error 500 - Server side error.')
  }

  const createdMessage = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/messages/${newMessage.id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  if (!createdMessage.ok) {
    throw new Error('Error on GET the new message.')
  }

  const { message } = await createdMessage.json()

  return message
}

export async function regenerateAnswer({
  messageId,
  prompt
}: IRegenerateAnswerProps) {
  const chatGPtResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/chat`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    }
  )

  if (!chatGPtResponse.ok) {
    throw new Error('OPENAI api error.')
  }

  const { response: gptResponse } = await chatGPtResponse.json()

  const newAnswerResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/answer`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ answer: gptResponse, messageId })
    }
  )

  if (!newAnswerResponse.ok) {
    throw new Error('Error on regenerating a response. Try again later.')
  }

  const { newAnswer } = await newAnswerResponse.json()

  return newAnswer
}

export async function sendNewPromptWithoutChatId({
  email,
  prompt
}: IsendNewPromptWithoutChatIdProps): Promise<INewMessageWithoutChatIdResponse> {
  const newChatResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/chats`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    }
  )

  if (!newChatResponse.ok) {
    throw new Error(
      'Chats and Messages are temporarily unavailable. We are working to restore this feature as soon as possible.'
    )
  }

  const { chat } = await newChatResponse.json()

  const newMessageResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ chatId: chat.id, prompt })
    }
  )

  if (!newMessageResponse.ok) {
    throw new Error(
      'Messages are temporarily unavailable. We are working to restore this feature as soon as possible.'
    )
  }

  const { newMessage } = await newMessageResponse.json()

  const chatGPtResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/chat`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    }
  )

  if (!chatGPtResponse.ok) {
    throw new Error('OPENAI api error.')
  }

  const { response: gptResponse } = await chatGPtResponse.json()

  const newAnswerResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/answer`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ answer: gptResponse, messageId: newMessage.id })
    }
  )

  if (!newAnswerResponse.ok) {
    throw new Error('Error 500 - Server side error.')
  }

  const createdMessage = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/messages/${newMessage.id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  if (!createdMessage.ok) {
    throw new Error('Error on GET the new message.')
  }

  const { message } = await createdMessage.json()

  return message
}
