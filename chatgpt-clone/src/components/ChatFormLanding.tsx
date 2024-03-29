import { useSendPromptWithoutChatIdMutation } from '@/hooks/messages/useMessagesMutations'
import { useRef, MutableRefObject, useState } from 'react'
import { SendIcon } from './Icons'

export default function ChatFormLanding() {
  const textAreaRef = useRef() as MutableRefObject<HTMLTextAreaElement>
  const [isTextAreaEmpty, setTextAreaEmpty] = useState(true)
  const { sendPromptWithoutChatIdMutate, sendPromptWithOutChatIdLoading } =
    useSendPromptWithoutChatIdMutation()

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    const { value } = textAreaRef.current
    if (value === '') return
    sendPromptWithoutChatIdMutate({
      prompt: value.trim()
    })
    textAreaRef.current.value = ''
    textAreaRef.current.style.height = ''
    setTextAreaEmpty(textAreaRef.current.value.trim() === '')
  }

  const handleChange = () => {
    const textareaValue = textAreaRef.current.value
    setTextAreaEmpty(textareaValue.trim() === '')
    const element = textAreaRef.current
    element.style.height = '0px'
    const scrollHeight = element.scrollHeight
    element.style.height = scrollHeight + 'px'
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !isTextAreaEmpty &&
      !sendPromptWithOutChatIdLoading
    ) {
      event.preventDefault()
      handleSubmit()
    }
  }

  return (
    <section className='flex justify-center items-center'>
      <form
        className='flex flex-row max-w-3xl pt-6 w-full mb-6 px-2 md:px-6'
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
      >
        <div className='relative flex flex-col flex-grow w-full px-4 py-3 text-white border rounded-md shadow-lg bg-gptlightgray border-gray-900/50'>
          <textarea
            autoFocus
            ref={textAreaRef}
            onChange={handleChange}
            rows={1}
            name='landingTextarea'
            tabIndex={0}
            defaultValue=''
            placeholder='Send a message...'
            className='flex w-full h-6 resize-none bg-transparent m-0 border-0 outline-none'
          />
          <button
            disabled={isTextAreaEmpty || sendPromptWithOutChatIdLoading}
            className='disabled:opacity-40 enabled:hover:bg-gray-900 enabled:hover:text-gray-400 disabled:hover:bg-transparent text-white absolute p-1 rounded-md bottom-2.5 right-2.5'
          >
            <SendIcon />
          </button>
        </div>
      </form>
    </section>
  )
}
