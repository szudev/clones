'use client'

import { User } from 'next-auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/DropdownMenu'
import UserAvatar from './UserAvatar'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

interface Props {
  user: User & {
    id: string
    username?: string | null | undefined
  }
}

export default function UserProfileNav({ user }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          className='h-8 w-8'
          user={{ name: user.name || null, image: user.image || null }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-white' align='end'>
        <div className='flex items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-1 leading-none'>
            {user.name && <p className='font-medium'>{user.name}</p>}
            {user.email && (
              <p className='w-[200px] truncate text-sm text-zinc-700'>
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer' asChild>
          <Link href={`/user/${user.username}`}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer' asChild>
          <Link href='/'>Feed</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer' asChild>
          <Link href='/r/create'>Create Community</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer' asChild>
          <Link href='/settings'>Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='cursor-pointer'
          onSelect={(event) => {
            event.preventDefault()
            signOut({ callbackUrl: `${window.location.origin}/sign-in` })
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
