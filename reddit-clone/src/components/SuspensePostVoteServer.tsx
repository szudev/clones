import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react'
import { Suspense } from 'react'
import { buttonVariants } from './ui/Button'
import PostVoteServer from './post-vote/PostVoteServer'
import { Post, User, Vote } from '@prisma/client'
import { CachedPost } from '@/types/redis'
import { db } from '@/lib/db'

interface Props {
  post:
    | (Post & {
        votes: Vote[]
        author: User
      })
    | null
  cachedPost: CachedPost
  postId: string
}

export default function SuspensePostVoteServer({
  cachedPost,
  postId,
  post
}: Props) {
  return (
    <Suspense fallback={<PostVoteSkeleton />}>
      {/* @ts-expect-error */}
      <PostVoteServer
        postId={post?.id ?? cachedPost.id}
        getData={async () => {
          return await db.post.findUnique({
            where: {
              id: postId
            },
            include: {
              votes: true
            }
          })
        }}
      />
    </Suspense>
  )
}

function PostVoteSkeleton() {
  return (
    <div className='flex items-center flex-row md:flex-col pr-6 w-20'>
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigUp className='h-5 w-5 text-zinc-600' />
      </div>
      <div className='text-center py-2 font-medium text-sm text-zinc-900'>
        <Loader2 className='h-3 w-3 animate-spin' />
      </div>
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigDown className='h-5 w-5 text-zinc-600' />
      </div>
    </div>
  )
}
