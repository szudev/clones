import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { getMessagesQuery } from './queries'
import { IMessageApiResponse } from '@/types/props.type'

export default function useMessagesQuery() {
  const router = useRouter()
  const chatId = router.query.id
  const { data, isLoading } = useQuery<IMessageApiResponse[]>({
    queryKey: ['messages', chatId],
    queryFn: () => getMessagesQuery(chatId as string)
  })

  return { messages: data, isMessagesLoading: isLoading }
}
