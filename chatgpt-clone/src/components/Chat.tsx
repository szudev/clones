import { useDeleteChatMutation } from '@/hooks/chats/useChatsMutations'
import { TrashIcon } from './Icons'
import { ChatIcon } from './Icons'
import Link from 'next/link'
import ServerLoading from './ServerLoading'

type ChatProps = {
  chatId: string
  chatTitle: string
  dynamicPath: string | string[] | undefined
}

export default function Chat({ chatId, chatTitle, dynamicPath }: ChatProps) {
  const { removeChatMutation, isDeleteChatMutationLoading } =
    useDeleteChatMutation()

  const handleRemoveChatClick = () => {
    if (isDeleteChatMutationLoading) return
    removeChatMutation(chatId)
  }

  return (
    <Link
      href={`/chat/${chatId}`}
      className={`${
        dynamicPath === chatId ? 'bg-gptgray pr-9' : 'hover:bg-[#2A2B32]'
      } flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all group`}
    >
      <ChatIcon />
      <div className='flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative'>
        {chatTitle}
        <div
          className={`absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l ${
            dynamicPath === chatId
              ? 'from-[#343541]'
              : 'from-[#202123] group-hover:from-[#2A2B32]'
          }`}
        ></div>
      </div>
      <div
        className={`${
          dynamicPath === chatId ? 'visible' : 'invisible'
        } absolute flex right-1 z-10 text-gray-300`}
      >
        <button
          className='p-1 hover:text-white'
          onClick={handleRemoveChatClick}
          disabled={isDeleteChatMutationLoading}
        >
          {isDeleteChatMutationLoading ? <ServerLoading /> : <TrashIcon />}
        </button>
      </div>
    </Link>
  )
}
