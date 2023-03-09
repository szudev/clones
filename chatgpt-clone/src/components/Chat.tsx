import { useMessageStore } from '@/store/messages'
import Message from './Message'
import ChatForm from './ChatForm'

export default function Chat() {
  const messages = useMessageStore((state) => state.messages)
  return (
    <div className='bg-gptgray w-full h-screen justify-between flex flex-col pt-[70px] md:pt-0'>
      <main className='flex flex-col overflow-y-auto'>
        {messages.map((entry) => (
          <Message key={entry.id} {...entry} />
        ))}
      </main>
      <ChatForm />
    </div>
  )
}
