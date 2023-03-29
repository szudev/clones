import { useChatStore } from '@/store/chats'
import { signOut } from 'next-auth/react'
import { PlusIcon, LogOutIcon } from './Icons'
import ServerLoading from './ServerLoading'
import Chat from './Chat'
import { useUserStore } from '@/store/user'
import { useRouter } from 'next/navigation'

export default function Aside() {
  const router = useRouter()
  const { email } = useUserStore((state) => state)
  const { chats, createNewChat, errorServer, serverLoading } = useChatStore(
    (state) => state
  )
  const handleNewChatClick = async () => {
    if (email) {
      const id = await createNewChat({ email })
      router.push(`/chat/${id}`)
    }
  }

  return (
    <aside className='bg-gptdarkgray md:max-w-[260px] w-full fixed md:relative h-screen'>
      <nav className='flex h-full flex-1 flex-col space-y-1 p-2'>
        <a
          onClick={handleNewChatClick}
          className='flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20'
        >
          <PlusIcon />
          New chat
        </a>
        <div className='flex-col flex-1 overflow-y-auto border-b border-white/20 -mr-2'>
          <div className='flex flex-col gap-2 text-gray-100 h-full text-sm pr-2'>
            {serverLoading ? (
              <ServerLoading />
            ) : errorServer ? (
              <p className='text-white'>{errorServer}</p>
            ) : (
              chats.map((chat) => <Chat key={chat.id} chatTitle={chat.title} />)
            )}
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
