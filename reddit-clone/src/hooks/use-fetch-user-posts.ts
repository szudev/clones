import { getUserPosts } from '@/services/user'
import { useInfiniteQuery } from '@tanstack/react-query'

interface Props {
  username: string
}

export default function useFetchUserPosts({ username }: Props) {
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchedAfterMount,
    isFetching,
    isFetchingNextPage
  } = useInfiniteQuery(
    ['infinite-user-posts'],
    async ({ pageParam }) => await getUserPosts({ username, pageParam }),
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
    hasNextPage,
    fetchNextPage,
    isFetchedAfterMount,
    isFetching,
    isFetchingNextPage
  }
}
