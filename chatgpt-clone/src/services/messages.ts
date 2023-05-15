interface IGetMessagesByChatId {
  chatId: string
}

export async function getMessagesByChatId({ chatId }: IGetMessagesByChatId) {
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
