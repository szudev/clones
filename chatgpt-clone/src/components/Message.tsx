import { ChatGPTLogo, RegenerateIcon } from './Icons'
import UserAvatar from './UserAvatar'
import { Avatar } from './Avatar'
import { Answer } from '@prisma/client'
import CodeSnippet from './Codesnippet'
import { useRegenerateAnswerMutation } from '@/hooks/messages/useMessagesMutations'
import ServerLoading from './ServerLoading'
import { useOpenAiKeyStore } from '@/store/openAIKey'

interface IMessageProps {
  id: string
  message: string
  answer: Omit<Answer, 'messageId'> | null
  newMessageMutationLoading: boolean
}

interface IHandleRegenerateAnswerButtonProps {
  messageId: string
  prompt: string
}

export default function Message({
  id,
  message,
  answer,
  newMessageMutationLoading
}: IMessageProps) {
  const { regenerateAnswerMutate, isRegenerateAnswerMutationLoading } =
    useRegenerateAnswerMutation()
  const { openAiKey } = useOpenAiKeyStore((state) => state)

  const handleRegeneteAnswerButton = ({
    messageId,
    prompt
  }: IHandleRegenerateAnswerButtonProps) => {
    if (isRegenerateAnswerMutationLoading) return
    regenerateAnswerMutate({ messageId, prompt, openAiKey })
  }

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
              {newMessageMutationLoading && (
                <div className='flex items-center gap-2'>
                  <ServerLoading />{' '}
                  <span className='animate-pulse text-gray-100'>Loading</span>
                </div>
              )}
              {answer && !newMessageMutationLoading && (
                <CodeSnippet prompt={answer.answer} />
              )}
              {answer === null && !newMessageMutationLoading && (
                <div className='border gap-2 bg-[#554652] p-4 rounded-md items-center justify-center border-red-600 flex flex-col'>
                  <p>There was an error on generating a response</p>
                  <button
                    className='btn relative btn-primary w-32'
                    onClick={() =>
                      handleRegeneteAnswerButton({
                        messageId: id,
                        prompt: message
                      })
                    }
                    disabled={isRegenerateAnswerMutationLoading}
                  >
                    <div className='flex w-full items-center font-bold justify-center gap-2'>
                      <RegenerateIcon
                        loading={isRegenerateAnswerMutationLoading}
                      />
                      {isRegenerateAnswerMutationLoading
                        ? 'Generating'
                        : 'Regenerate'}
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
