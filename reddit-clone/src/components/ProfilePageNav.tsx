'use client'

import { Suspense } from 'react'
import { useProfileNavStore } from '@/store/user-profile-nav'

export default function ProfilePageNav() {
  const {
    active,
    setPostsActive,
    setSubredditsActive,
    setSubscriptionsActive
  } = useProfileNavStore((state) => state)
  return (
    <Suspense fallback={<Skeleton />}>
      <nav className='flex items-center'>
        <button
          disabled={active.posts}
          className={`${
            active.posts
              ? 'text-[#1071C4] rounded-none hover:bg-transparent cursor-default after:w-full after:bg-[#1071C4]'
              : 'text-black hover:bg-zinc-100 cursor-pointer rounded-md after:w-0'
          } md:p-4 p-2 relative after:transition-[width_2s] after:origin-center after:ease-in-out after:absolute after:bottom-0 after:left-0 after:h-2`}
          onClick={setPostsActive}
        >
          Posts
        </button>
        <button
          disabled={active.subreddits}
          className={`${
            active.subreddits
              ? 'text-[#1071C4] rounded-none hover:bg-transparent cursor-default after:w-full after:bg-[#1071C4]'
              : 'text-black hover:bg-zinc-100 cursor-pointer rounded-md after:w-0'
          } md:p-4 p-2 relative after:transition-[width_2s] after:ease-in-out after:absolute after:bottom-0 after:left-0 after:h-2`}
          onClick={setSubredditsActive}
        >
          Subreddits
        </button>
        <button
          disabled={active.subscriptions}
          className={`${
            active.subscriptions
              ? 'text-[#1071C4] rounded-none hover:bg-transparent cursor-default after:w-full after:bg-[#1071C4]'
              : 'text-black hover:bg-zinc-100 cursor-pointer rounded-md after:w-0'
          } md:p-4 p-2 relative after:transition-[width_2s] after:ease-in-out after:absolute after:bottom-0 after:left-0 after:h-2`}
          onClick={setSubscriptionsActive}
        >
          Subscriptions
        </button>
      </nav>
    </Suspense>
  )
}

function Skeleton() {
  return (
    <nav className='flex items-center text-transparent'>
      <p className='active:text-[#1071C4] active:cursor-default cursor-pointer md:p-4 p-2 rounded-md hover:bg-zinc-100 active:hover:bg-transparent'>
        Subreddits
      </p>
      <p className='active:text-[#1071C4] active:cursor-default cursor-pointer md:p-4 p-2 rounded-md hover:bg-zinc-100 active:hover:bg-transparent'>
        Posts
      </p>
      <p className='active:text-[#1071C4] active:cursor-default cursor-pointer md:p-4 p-2 rounded-md hover:bg-zinc-100 active:hover:bg-transparent'>
        Subscriptions
      </p>
    </nav>
  )
}
