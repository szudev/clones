import { ChatIcon } from './Icons'
import Link from 'next/link'

type ChatProps = {
  chatId: string
  chatTitle: string
}

export default function Chat({ chatId, chatTitle }: ChatProps) {
  return (
    <Link
      href={`/chat/${chatId}`}
      className='flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all group'
    >
      <ChatIcon />
      <div className='flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative'>
        {chatTitle}
        <div className='absolute inset-y-0 right-0 w-8 z-10 group-hover:from-[#2A2B32]'></div>
      </div>
    </Link>
  )
}
