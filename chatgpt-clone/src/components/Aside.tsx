import { signOut } from 'next-auth/react'
import { PlusIcon, LogOutIcon } from './Icons'

function TestComponent() {
  return (
    <a className='flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all hover:pr-4 group'>
      <svg
        stroke='currentColor'
        fill='none'
        strokeWidth='2'
        viewBox='0 0 24 24'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='h-4 w-4'
        height='1em'
        width='1em'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'></path>
      </svg>
      <div className='flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative'>
        Developing for Enerlink.
        <div className='absolute inset-y-0 right-0 w-8 z-10 group-hover:from-[#2A2B32]'></div>
      </div>
    </a>
  )
}

export default function Aside() {
  return (
    <aside className='bg-gptdarkgray md:max-w-[260px] w-full fixed md:relative h-screen'>
      <nav className='flex h-full flex-1 flex-col space-y-1 p-2'>
        <a className='flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20'>
          <PlusIcon />
          New chat
        </a>
        <div className='flex-col flex-1 overflow-y-auto border-b border-white/20 -mr-2'>
          <div className='flex flex-col gap-2 text-gray-100 text-sm'>
            <TestComponent />
          </div>
        </div>
        <div className='flex flex-col'>
          <a
            onClick={() => signOut()}
            className='flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm'
          >
            <LogOutIcon />
            Whatever
          </a>
          <a
            onClick={() => signOut()}
            className='flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm'
          >
            <LogOutIcon />
            Whatever x2
          </a>
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
