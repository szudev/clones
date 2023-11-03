import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { ExtendedPost } from '@/types/db'
import axios from 'axios'

interface Props {
  pageParam?: number
  subredditName?: string
}

interface Result {
  posts: ExtendedPost[]
  currentPage: string
  hasNextPage: boolean
}

export async function getPosts({ pageParam = 1, subredditName }: Props) {
  const query =
    `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
    (!!subredditName ? `&subredditName=${subredditName}` : '')

  const { data } = await axios.get(query)
  return data as Result
}
