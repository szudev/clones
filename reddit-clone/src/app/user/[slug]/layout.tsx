import UserAvatar from '@/components/UserAvatar'
import { db } from '@/lib/db'
import { formatTimeToCreatedAt } from '@/lib/utils'
import { Cake } from 'lucide-react'
import { notFound } from 'next/navigation'

interface Props {
  children: React.ReactNode
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = params
  const user = await db.user.findUnique({
    where: {
      username: slug
    }
  })
  if (!user) return notFound()

  return {
    title: `${user.username} (u/${user.username}) - Pirateddit`,
    description: `${user.username} profile page.`
  }
}

export default async function Layout({ children, params }: Props) {
  const { slug } = params
  const user = await db.user.findUnique({
    where: {
      username: slug
    }
  })

  if (!user) return notFound()

  const postsCount = await db.post.count({
    where: {
      authorId: user.id
    }
  })

  const subredditCount = await db.subreddit.count({
    where: {
      creatorId: user.id
    }
  })

  const subscriptionCount = await db.subscription.count({
    where: {
      userId: user.id
    }
  })

  return (
    <div className='flex flex-col w-full max-w-4xl mx-auto items-center py-4'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6 w-full'>
        {children}
        <div className='overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last'>
          <div className='bg-[#1071C4] px-6 py-4 relative h-16 mb-8'>
            <div className='flex items-center absolute bottom-0 left-0 translate-y-1/2 px-6'>
              <UserAvatar user={user} className='w-16 h-16' />
            </div>
          </div>
          <div className='-my-3 px-6 py-4 text-sm leading-6'>
            <strong className='text-[#1071C4]'>u/{user.username}</strong>
            <div className='flex flex-col py-3 gap-2'>
              <div className='flex justify-between items-center'>
                <div className='flex gap-1'>
                  <Cake className='text-[#1071C4] h-6 w-6' />
                  <p className='text-zinc-500'>Cake day</p>
                </div>
                <p>{formatTimeToCreatedAt(user.createdAt)}</p>
              </div>
              <div className='flex justify-between items-center'>
                <p className='text-zinc-500'>Created subreddits</p>
                <p className='place-self-end text-zinc-500'>{subredditCount}</p>
              </div>
              <div className='flex justify-between items-center'>
                <p className='text-zinc-500'>Created posts</p>
                <p className='text-zinc-500 place-self-end'>{postsCount}</p>
              </div>
              <div className='flex justify-between items-center'>
                <p className='text-zinc-500'>Subscriptions</p>
                <p className='text-zinc-500 place-self-end'>
                  {subscriptionCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
