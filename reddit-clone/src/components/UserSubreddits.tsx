import { getUserSubreddits } from '@/services/user'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import SubredditCard from './SubredditCard'
import { Button } from './ui/Button'

interface Props {
  username: string
}

export default function UserSubreddits({ username }: Props) {
  const { data, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      ['user-subreddits', username],
      async ({ pageParam }) => await getUserSubreddits({ username, pageParam }),
      {
        getNextPageParam: (lastPage) => {
          const nextPage = lastPage?.hasNextPage
          return nextPage ? Number(lastPage.currentPage) + 1 : undefined
        },
        refetchOnWindowFocus: false
      }
    )

  const subreddits = data?.pages.flatMap((page) => page.subreddits)
  return (
    <section className='flex flex-col gap-4'>
      <div className='grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2'>
        {isFetching && !subreddits && (
          <div className='flex h-full w-full items-center justify-center'>
            <Loader2 className='h-10 w-10 animate-spin text-zinc-500' />
          </div>
        )}
        {!isFetching && subreddits && subreddits.length === 0 ? (
          <p>The user does not have any subreddit.</p>
        ) : (
          subreddits &&
          subreddits.map((subreddit) => (
            <SubredditCard subreddit={subreddit} key={subreddit.id} />
          ))
        )}
      </div>
      {subreddits && hasNextPage && (
        <Button
          isLoading={isFetchingNextPage}
          disabled={isFetchingNextPage}
          variant='ghost'
          className='w-full md:w-1/2 self-center'
          onClick={() => {
            if (isFetchingNextPage) return
            fetchNextPage()
          }}
        >
          Load More
        </Button>
      )}
    </section>
  )
}
