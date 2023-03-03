import { useMessageStore } from '@/store/messages'
import { useRef } from 'react'
import { MutableRefObject } from 'react'
import { SendIcon } from './Icons'

export default function ChatForm() {
  const sendPrompt = useMessageStore((state) => state.sendPrompt)
  const textAreaRef = useRef() as MutableRefObject<HTMLTextAreaElement>

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    const { value } = textAreaRef.current
    sendPrompt({ prompt: value })
    textAreaRef.current.value = ''
  }

  const handleChange = () => {
    const element = textAreaRef.current
    element.style.height = '0px'
    const scrollHeight = element.scrollHeight
    element.style.height = scrollHeight + 'px'
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
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
            ref={textAreaRef}
            onChange={handleChange}
            rows={1}
            tabIndex={0}
            autoFocus
            defaultValue=''
            className='flex w-full h-6 resize-none bg-transparent m-0 border-0 outline-none'
          />
          <button className='absolute p-1 rounded-md bottom-2.5 right-2.5'>
            <SendIcon />
          </button>
        </div>
      </form>
    </section>
  )
}
