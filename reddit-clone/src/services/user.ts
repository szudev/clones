import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import axios from 'axios'
import { ExtendedPost, ExtendedSubreddit } from '@/types/db'

interface Props {
  username: string
  pageParam?: number
}

interface Result {
  posts: ExtendedPost[]
  currentPage: string
  hasNextPage: boolean
}

interface ResultSubreddit {
  subreddits: ExtendedSubreddit[]
  currentPage: string
  hasNextPage: boolean
}

const INFINITE_SCROLLING_SUBREDDIT_PAGINATION_RESULTS = 3

export async function getUserPosts({ username, pageParam = 1 }: Props) {
  const query = `/api/user/posts?username=${username}&limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}`
  const { data } = await axios.get(query)
  return data as Result
}

export async function getUserSubreddits({ username, pageParam = 1 }: Props) {
  const query = `/api/user/subreddits?username=${username}&limit=${INFINITE_SCROLLING_SUBREDDIT_PAGINATION_RESULTS}&page=${pageParam}`
  const { data } = await axios.get(query)
  return data as ResultSubreddit
}
