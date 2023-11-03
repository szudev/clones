import { getCommentReplies } from '@/services/reply'
import { useInfiniteQuery } from '@tanstack/react-query'

interface Props {
  commentId: string
}

export default function useFetchCommentReplies({ commentId }: Props) {
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetching,
    refetch,
    isRefetching
  } = useInfiniteQuery(
    [`infinite-comment-${commentId}-replies`],
    async ({ pageParam }) => await getCommentReplies({ commentId, pageParam }),
    {
      getNextPageParam: (lastPage) => {
        const nextPage = lastPage?.hasNextPage
        return nextPage ? Number(lastPage.currentPage) + 1 : undefined
      },
      refetchOnWindowFocus: false,
      enabled: false
    }
  )

  return {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetching,
    refetch,
    isRefetching
  }
}
