import CommentSectionLoader from '@/components/CommentSectionLoader'
import CommentsSection from '@/components/CommentsSection'
import EditorOutput from '@/components/EditorOutput'
import SuspensePostVoteServer from '@/components/SuspensePostVoteServer'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { formatTimeToNow } from '@/lib/utils'
import { CachedPost } from '@/types/redis'
import { Post, User, Vote } from '@prisma/client'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

interface Props {
  params: {
    postId: string
  }
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function Page({ params }: Props) {
  const { postId } = params
  const cachedPost = (await redis.hgetall(`post:${postId}`)) as CachedPost

  let post: (Post & { votes: Vote[]; author: User }) | null = null

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: postId
      },
      include: {
        votes: true,
        author: true
      }
    })
  }

  if (!post && !cachedPost) return notFound()

  return (
    <section className='bg-white rounded-md grid grid-rows-[repeat(5,minmax(0,auto))] md:grid-rows-[repeat(4,minmax(0,auto))] grid-cols-1 md:grid-cols-[min-content_auto] w-full flex-1 p-4'>
      <div className='flex items-start w-full h-full row-start-4 md:row-start-1 md:row-end-4'>
        <SuspensePostVoteServer
          cachedPost={cachedPost}
          postId={postId}
          post={post}
        />
      </div>
      <p className='max-h-40 mt-1 truncate text-xs text-gray-500 row-start-1 md:col-start-2'>
        Posted by u/{post?.author.username ?? cachedPost.authorUsername}{' '}
        {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
      </p>
      <h1 className='text-xl font-semibold py-2 leading-6 text-gray-900 row-start-2 md:col-start-2'>
        {post?.title ?? cachedPost.title}
      </h1>
      <article className='w-full h-full md:row-start-3 md:col-start-2'>
        <EditorOutput content={post?.content ?? cachedPost.content} />
      </article>
      <div className='w-full h-full md:row-start-4 md:col-span-2'>
        <Suspense fallback={<CommentSectionLoader />}>
          {/* @ts-expect-error */}
          <CommentsSection postId={post?.id ?? cachedPost.id} />
        </Suspense>
      </div>
    </section>
  )
}
