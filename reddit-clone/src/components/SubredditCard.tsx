import { formatTimeToCreatedAt } from '@/lib/utils'
import { ExtendedSubreddit } from '@/types/db'
import { MessageSquare, Users } from 'lucide-react'
import Link from 'next/link'

interface Props {
  subreddit: ExtendedSubreddit
}

export default function SubredditCard({ subreddit }: Props) {
  return (
    <Link
      key={subreddit.id}
      className='flex gap-2 flex-col p-2 rounded-md bg-white shadow hover:outline-1 hover:outline hover:outline-black hover:cursor-pointer'
      href={`/r/${subreddit.name}`}
    >
      <strong>r/{subreddit.name}</strong>
      {subreddit.creator?.name && (
        <p>Created by {subreddit.creator.username}</p>
      )}
      <p>Created at {formatTimeToCreatedAt(new Date(subreddit.createdAt))}</p>
      <div className='flex gap-2 items-center'>
        <div className='flex gap-1 items-center'>
          <MessageSquare className='h-5 w-5' />
          {subreddit._count.posts}
        </div>
        <div className='flex gap-1 items-center'>
          <Users className='h-5 w-5' />
          {subreddit._count.subscribers}
        </div>
      </div>
    </Link>
  )
}
