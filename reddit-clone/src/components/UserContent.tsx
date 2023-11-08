'use client'

import { useProfileNavStore } from '@/store/user-profile-nav'
import { ExtendedPost } from '@/types/db'
import { Session } from 'next-auth'
import UserPosts from './UserPosts'
import ProfilePageNav from './ProfilePageNav'
import UserSubreddits from './UserSubreddits'

interface Props {
  posts: ExtendedPost[]
  session: Session | null
  username: string
}

export default function UserContent({ posts, session, username }: Props) {
  const { posts: postsState, subreddits: subredditsState } = useProfileNavStore(
    (state) => state.active
  )
  return (
    <section className='flex flex-col w-full col-span-2 gap-4'>
      <div className='flex flex-col gap-2 self-center md:self-start'>
        <ProfilePageNav />
      </div>
      {postsState && (
        <UserPosts initialPosts={posts} session={session} username={username} />
      )}
      {subredditsState && <UserSubreddits username={username} />}
    </section>
  )
}
