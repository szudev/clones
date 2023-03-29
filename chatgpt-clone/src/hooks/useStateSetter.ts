import { ChatsType, useChatStore } from '@/store/chats'
import { useUserStore } from '@/store/user'
import { useEffect } from 'react'

type UseStateSetterProps = {
  email: string
  retrievedChats: ChatsType[]
  errorMessage: string | null
}

export default function useStateSetter({
  email,
  retrievedChats,
  errorMessage
}: UseStateSetterProps) {
  const { setUserEmail } = useUserStore((state) => state)
  const { setChats, setErrorServer } = useChatStore((state) => state)

  useEffect(() => {
    if (errorMessage) {
      setErrorServer(errorMessage)
      setUserEmail({ email })
    } else {
      setChats(retrievedChats)
      setUserEmail({ email })
    }
  }, [setChats, setErrorServer])
}
