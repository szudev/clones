import { ChatGPTLogo } from './Icons'
import UserAvatar from './UserAvatar'
import TypingEffect from './TypingEffect'
import { Avatar } from './Avatar'
import { Answer } from '@prisma/client'
import CodeSnippet from './Codesnippet'

interface IMessageProps {
  id: string
  message: string
  answer: Omit<Answer, 'messageId'> | null
  newMessageMutationLoading: boolean | undefined
}

export default function Message({
  id,
  message,
  answer,
  newMessageMutationLoading
}: IMessageProps) {
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
        <article className='flex gap-4 m-auto max-w-3xl p-6 overflow-x-hidden'>
          <Avatar>
            <ChatGPTLogo />
          </Avatar>
          <div className='min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap overflow-y-auto flex-1'>
            <div className='prose-invert w-full break-words light leading-7 text-justify'>
              {!answer && newMessageMutationLoading && <TypingEffect text='' />}
              {answer ? (
                //<TypingEffect text={answer.answer} />
                <CodeSnippet prompt={answer.answer} />
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
