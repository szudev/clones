import { signOut } from 'next-auth/react'
import { PlusIcon, LogOutIcon, BurgerMenu, NavPlusIcon } from './Icons'
import ServerLoading from './ServerLoading'
import Chat from './Chat'
import { useState } from 'react'
import ResponsiveMenu from './ResponsiveMenu'
import useChatsqueries from '@/hooks/chats/useChatsQueries'
import { useNewChatMutation } from '@/hooks/chats/useChatsMutations'
import OpenaiApiKeyInput from './OpenaiApiKeyInput'

export default function Aside() {
  const [responsiveSideBar, setResponsiveSideBar] = useState(false)
  const { chats, isChatsLoading, isChatsError, isChatsFetched, chatsError } =
    useChatsqueries()
  const { newChatMutation, isCreateNewChatMutationLoading, router } =
    useNewChatMutation()

  const handleNewChatClick = () => {
    if (isCreateNewChatMutationLoading) return
    newChatMutation()
  }

  const handleOpenResponsiveSideBarClick = () => {
    setResponsiveSideBar((prevState) => !prevState)
  }

  return (
    <>
      <aside className='bg-gptdarkgray md:max-w-[260px] w-full md:relative md:h-[100svh] sticky hidden md:flex'>
        <nav className='flex h-full flex-1 flex-col space-y-1 p-2'>
          <button
            onClick={handleNewChatClick}
            disabled={isCreateNewChatMutationLoading}
            className='flex py-3 px-3 items-center disabled:cursor-not-allowed gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20'
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
            <div className='flex flex-col text-gray-100 h-full text-sm pr-2'>
              {isChatsLoading && <ServerLoading />}
              {!isChatsLoading && isChatsError && (
                <p className='text-white'>{chatsError?.message}</p>
              )}
              {!isChatsLoading &&
                isChatsFetched &&
                !isChatsError &&
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
            <OpenaiApiKeyInput />
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
        <button
          onClick={handleNewChatClick}
          className='pl-3 pr-2 w-11 h-6'
          disabled={isCreateNewChatMutationLoading}
        >
          {isCreateNewChatMutationLoading ? <ServerLoading /> : <NavPlusIcon />}
        </button>
      </nav>
      <ResponsiveMenu
        handleNewChatClick={handleNewChatClick}
        isCreateNewChatMutationLoading={isCreateNewChatMutationLoading}
        chats={chats}
        error={chatsError}
        isError={isChatsError}
        isFetched={isChatsFetched}
        isLoading={isChatsLoading}
        responsiveSideBar={responsiveSideBar}
        setResponsiveSideBar={setResponsiveSideBar}
        router={router}
      />
    </>
  )
}
