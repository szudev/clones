import { Chat as TChat } from '@prisma/client'
import { PlusIcon, LogOutIcon, CloseSideBarIcon } from './Icons'
import ServerLoading from './ServerLoading'
import Chat from './Chat'
import { signOut } from 'next-auth/react'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { NextRouter } from 'next/router'

interface Props {
  handleNewChatClick: () => void
  isCreateNewChatMutationLoading: boolean
  isLoading: boolean
  isError: boolean
  error: Error | null
  isFetched: boolean
  chats: TChat[] | undefined
  responsiveSideBar: boolean
  setResponsiveSideBar: Dispatch<SetStateAction<boolean>>
  router: NextRouter
}

export default function ResponsiveMenu({
  handleNewChatClick,
  isCreateNewChatMutationLoading,
  isLoading,
  isError,
  error,
  isFetched,
  chats,
  responsiveSideBar,
  setResponsiveSideBar,
  router
}: Props) {
  const handleCloseResponsiveSideBarClick = () => {
    setResponsiveSideBar((prevState) => !prevState)
  }
  const handleNewChatMutationResponsive = () => {
    handleNewChatClick()
  }

  useEffect(() => {
    router.events.on('routeChangeComplete', () => setResponsiveSideBar(false))
  }, [router])

  return (
    <aside
      className={`bg-gptdarkgray z-[9999] transition-all h-full duration-300 min-w-full w-full absolute block top-0 md:hidden ${
        responsiveSideBar ? 'left-0 opacity-100' : '-left-full opacity-0'
      }`}
    >
      <nav className='flex h-full flex-1 flex-col space-y-1 p-2'>
        <div className='flex justify-end'>
          <button
            type='button'
            className='ml-1 flex h-10 w-10 items-center justify-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
            tabIndex={0}
            onClick={handleCloseResponsiveSideBarClick}
          >
            <span className='sr-only'>Close sidebar</span>
            <CloseSideBarIcon />
          </button>
        </div>
        <button
          onClick={handleNewChatMutationResponsive}
          className='flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20'
        >
          {isCreateNewChatMutationLoading ? (
            <>
              <ServerLoading /> Loading
            </>
          ) : (
            <>
              <PlusIcon />
              New chat
            </>
          )}
        </button>
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
                <Chat
                  key={chat.id}
                  chatId={chat.id}
                  chatTitle={chat.title}
                  dynamicPath={router.query.id}
                />
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
