interface IGetMessagesByChatIdProps {
  chatId: string
}

interface ICreateNewMessageProps extends IGetMessagesByChatIdProps {
  prompt: string
  answer: string | null
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

export async function createNewMessage({
  chatId,
  prompt,
  answer
}: ICreateNewMessageProps) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ chatId, prompt, answer })
    }
  )

  if (!response.ok) {
    throw new Error(
      'Messages are temporarily unavailable. We are working to restore this feature as soon as possible.'
    )
  }

  const json = await response.json()
  return json.newMessage
}
