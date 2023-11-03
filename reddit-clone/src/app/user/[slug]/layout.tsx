import ProfilePageNav from '@/components/ProfilePageNav'
import UserAvatar from '@/components/UserAvatar'
import { db } from '@/lib/db'
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

  return (
    <article className='rounded-md bg-white flex flex-col w-full max-w-4xl mx-auto items-center py-4 gap-2'>
      <header className='flex flex-col gap-2 items-center'>
        <UserAvatar user={user} />
        <h1>u/{user.username}</h1>
        <ProfilePageNav />
      </header>
      {children}
    </article>
  )
}
