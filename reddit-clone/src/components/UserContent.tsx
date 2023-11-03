'use client'

import { useProfileNavStore } from '@/store/user-profile-nav'
import { ExtendedPost } from '@/types/db'
import { Session } from 'next-auth'
import UserPosts from './UserPosts'

interface Props {
  posts: ExtendedPost[]
  session: Session | null
  username: string
}

export default function UserContent({ posts, session, username }: Props) {
  const {
    posts: postsState,
    subreddits: subredditsState,
    subscriptions: subscriptionsState
  } = useProfileNavStore((state) => state.active)
  return (
    <section className='flex flex-col w-full gap-1'>
      {postsState && (
        <UserPosts initialPosts={posts} session={session} username={username} />
      )}
      {subredditsState && <p>subreddits True</p>}
      {subscriptionsState && <p>Subscriptions True</p>}
    </section>
  )
}
