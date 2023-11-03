import { getPosts } from '@/services/post'
import { useInfiniteQuery } from '@tanstack/react-query'

interface Props {
  subredditName?: string
}

export default function useFetchFeedPosts({ subredditName }: Props) {
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetching,
    isFetchedAfterMount
  } = useInfiniteQuery(
    ['infinite-post-feeds'],
    async ({ pageParam }) => await getPosts({ pageParam, subredditName }),
    {
      getNextPageParam: (lastPage) => {
        const nextPage = lastPage?.hasNextPage
        return nextPage ? Number(lastPage.currentPage) + 1 : undefined
      },
      refetchOnWindowFocus: false
    }
  )

  return {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetching,
    isFetchedAfterMount
  }
}
