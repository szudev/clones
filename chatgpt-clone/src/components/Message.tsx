import { ChatGPTLogo } from './Icons'
import UserAvatar from './UserAvatar'
import TypingEffect from './TypingEffect'
import { Avatar } from './Avatar'

interface ChatMessage {
  id: number
  ia: boolean
  message: string
}

export default function Message({ ia, message }: ChatMessage) {
  const avatar = ia ? <ChatGPTLogo /> : <UserAvatar />
  const textElement = ia ? <TypingEffect text={message} /> : message
  return (
    <div
      className={`text-gray-100 border-b border-black/10 ${
        ia ? 'bg-gptlightgray' : 'bg-gptgray'
      }`}
    >
      <article className='flex gap-4 m-auto max-w-3xl p-6'>
        <Avatar>{avatar}</Avatar>
        <div className='min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap flex-1'>
          <div className='prose-invert w-full break-words light leading-7 text-justify'>
            {textElement}
          </div>
        </div>
      </article>
    </div>
  )
}
