import { signOut } from 'next-auth/react'
import { PlusIcon, LogOutIcon } from './Icons'

export default function Aside() {
  return (
    <aside className='bg-gptdarkgray md:max-w-[260px] w-full p-2 fixed md:relative'>
      <nav className='flex flex-col flex-1 h-full space-y-1 justify-between'>
        <a className='flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20'>
          <PlusIcon />
          New chat
        </a>
        <div className='flex flex-col'>
          <a
            onClick={() => signOut()}
            className='flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm'
          >
            <LogOutIcon />
            Log out
          </a>
        </div>
      </nav>
    </aside>
  )
}
