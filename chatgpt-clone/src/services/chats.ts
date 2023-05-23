interface Props {
  email: string
}

interface IDeleteChatProps {
  chatId: string
  email: string
}

export async function getChatsByEmail({ email }: Props) {
  return await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/chats?email=${email}`
  )
    .then(async (res) => {
      if (!res.ok)
        throw new Error(
          'History is temporarily unavailable. We are working to restore this feature as soon as possible.'
        )
      return await res.json()
    })
    .then((res) => {
      return res.chats
    })
}

export async function createNewChat({ email }: Props) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/chats`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    }
  )

  if (!response.ok) throw new Error('An unexpected error occurred.')

  const json = await response.json()
  return json.chat
}

export async function deleteChatByChatId({ chatId, email }: IDeleteChatProps) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/chats`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ chatId, email })
    }
  )

  //if (!response.ok) throw new Error('An unexpected error occurred.')

  const json = await response.json()
  return json.deletedChat
}
