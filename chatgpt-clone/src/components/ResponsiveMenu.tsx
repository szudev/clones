import { Chat as TChat } from '@prisma/client'
import { PlusIcon, LogOutIcon, CloseSideBarIcon } from './Icons'
import ServerLoading from './ServerLoading'
import Chat from './Chat'
import { signOut } from 'next-auth/react'
import { Dispatch, SetStateAction } from 'react'

interface Props {
  handleNewChatClick: () => void
  isLoading: boolean
  isError: boolean
  error: Error | null
  isFetched: boolean
  chats: TChat[] | undefined
  responsiveSideBar: boolean
  setResponsiveSideBar: Dispatch<SetStateAction<boolean>>
}

export default function ResponsiveMenu({
  handleNewChatClick,
  isLoading,
  isError,
  error,
  isFetched,
  chats,
  responsiveSideBar,
  setResponsiveSideBar
}: Props) {
  const handleCloseResponsiveSideBarClick = () => {
    setResponsiveSideBar((prevState) => !prevState)
  }
  return (
    <aside
      className={`bg-gptdarkgray z-[9999] transition-all duration-300 min-w-full w-full absolute h-full block top-0 md:hidden ${
        responsiveSideBar ? 'left-0 opacity-100' : '-left-full opacity-0'
      }`}
    >
      <nav className='flex h-full flex-1 flex-col space-y-1 p-2'>
        <a
          onClick={handleNewChatClick}
          className='flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20'
        >
          <PlusIcon />
          New chat
        </a>
        <div className='flex-col flex-1 overflow-y-auto border-b border-white/20 -mr-2'>
          <div className='flex flex-col text-gray-100 h-full text-sm pr-2 text-start'>
            {isLoading && <ServerLoading />}
            {!isLoading && isError && (
              <p className='text-white'>{error?.message}</p>
            )}
            {!isLoading &&
              isFetched &&
              !isError &&
              chats &&
              chats.map((chat) => (
                <Chat key={chat.id} chatId={chat.id} chatTitle={chat.title} />
              ))}
          </div>
        </div>
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
