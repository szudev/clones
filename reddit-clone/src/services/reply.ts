import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { ExtendedReply } from '@/types/db'
import axios from 'axios'

interface Props {
  pageParam?: number
  commentId: string
}

interface Result {
  replies: ExtendedReply[]
  currentPage: string
  hasNextPage: boolean
}

export async function getCommentReplies({ commentId, pageParam = 1 }: Props) {
  const query = `/api/replies?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}&commentId=${commentId}`
  const { data } = await axios.get(query)
  return data as Result
}
