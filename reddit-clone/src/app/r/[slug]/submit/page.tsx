import PostEditor from '@/components/PostEditor'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

interface Props {
  params: {
    slug: string
  }
}

export default async function Page({ params }: Props) {
  const { slug: subredditName } = params
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: subredditName
    }
  })

  if (!subreddit) return notFound()

  return (
    <div className='flex flex-col items-start gap-6'>
      <div className='border-b border-gray-200 pb-5'>
        <div className='-ml-2 -mt-2 flex flex-wrap items-baseline'>
          <h3 className='ml-2 mt-2 text-base font-semibold leading-6 text-gray-900'>
            Create Post
          </h3>
          <p className='ml-2 mt-1 truncate text-sm text-gray-500'>
            in r/{subredditName}
          </p>
        </div>
      </div>
      {/* form */}
      <PostEditor subredditId={subreddit.id} />
    </div>
  )
}
