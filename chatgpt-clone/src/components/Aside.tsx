import { signOut } from 'next-auth/react'
import { PlusIcon, LogOutIcon, BurgerMenu, NavPlusIcon } from './Icons'
import ServerLoading from './ServerLoading'
import Chat from './Chat'
import useChats from '@/hooks/useChats'
import { useState } from 'react'
import ResponsiveMenu from './ResponsiveMenu'

export default function Aside() {
  const [responsiveSideBar, setResponsiveSideBar] = useState(false)
  const {
    chats,
    isLoading,
    isError,
    isFetched,
    error,
    newChatMutation,
    isLoadingMutation,
    router
  } = useChats()

  const handleNewChatClick = () => {
    if (isLoadingMutation) return
    newChatMutation()
  }

  const handleOpenResponsiveSideBarClick = () => {
    setResponsiveSideBar((prevState) => !prevState)
  }

  return (
    <>
      <aside className='bg-gptdarkgray md:max-w-[260px] w-full md:relative md:h-screen sticky hidden md:flex'>
        <nav className='flex h-full flex-1 flex-col space-y-1 p-2'>
          <a
            onClick={handleNewChatClick}
            className='flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20'
          >
            <PlusIcon />
            New chat
          </a>
          <div className='flex-col flex-1 overflow-y-auto border-b border-white/20 -mr-2'>
            <div className='flex flex-col text-gray-100 h-full text-sm pr-2 mb-5'>
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
      <nav className='md:hidden bg-gptgray sticky top-0 z-10 flex items-center border-b border-white/20 px-1 pt-1 text-gray-200'>
        <button
          onClick={handleOpenResponsiveSideBarClick}
          className='-ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:hover:text-white'
        >
          <span className='sr-only'>Open sidebar</span>
          <BurgerMenu />
        </button>
        <h1 className='flex-1 text-center text-base font-normal'>New chat</h1>
        <button className='pl-3 pr-2'>
          <NavPlusIcon />
        </button>
      </nav>
      <ResponsiveMenu
        handleNewChatClick={handleNewChatClick}
        chats={chats}
        error={error}
        isError={isError}
        isFetched={isFetched}
        isLoading={isLoading}
        responsiveSideBar={responsiveSideBar}
        setResponsiveSideBar={setResponsiveSideBar}
        router={router}
      />
    </>
  )
}
