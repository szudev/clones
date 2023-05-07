import { useQuery } from '@tanstack/react-query'
import { Chat } from '@prisma/client'
import { getAllChatsQuery } from './queries'

export default function useChatsqueries() {
  const { data, isLoading, isError, isFetched, error } = useQuery<
    Chat[],
    Error
  >(['chats'], getAllChatsQuery, {
    refetchOnWindowFocus: false
  })

  return {
    chats: data,
    isChatsLoading: isLoading,
    isChatsError: isError,
    isChatsFetched: isFetched,
    chatsError: error
  }
}
