import { ChatGPTLogo } from './Icons'
import UserAvatar from './UserAvatar'
import TypingEffect from './TypingEffect'
import { Avatar } from './Avatar'
import { IMessageApiResponse } from '@/types/props.type'

interface ChatMessage {
  id: number
  ia: boolean
  message: string
}

export default function Message({ message, answer }: IMessageApiResponse) {
  const avatar = answer?.answer ? <ChatGPTLogo /> : <UserAvatar />
  const textElement = answer?.answer ? (
    <TypingEffect text={answer.answer} />
  ) : (
    message
  )
  return (
    <div>
      <div className='text-gray-100 border-b border-black/10 bg-gptgray'>
        <article className='flex gap-4 m-auto max-w-3xl p-6'>
          <Avatar>
            <UserAvatar />
          </Avatar>
          <div className='min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap flex-1'>
            <div className='prose-invert w-full break-words light leading-7 text-justify'>
              {message}
            </div>
          </div>
        </article>
      </div>
      <div className='text-gray-100 border-b border-black/10 bg-gptlightgray'>
        <article className='flex gap-4 m-auto max-w-3xl p-6'>
          <Avatar>
            <ChatGPTLogo />
          </Avatar>
          <div className='min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap flex-1'>
            <div className='prose-invert w-full break-words light leading-7 text-justify'>
              {answer ? (
                <TypingEffect text={answer.answer} />
              ) : (
                <p>Unexpected error.</p>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
