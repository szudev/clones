import { useRouter } from 'next/navigation'
import { ChatGPTLogoLogin } from '@/components/Icons'

export default function Custom500() {
  const router = useRouter()
  const handleOnClick = () => {
    router.push('/chat')
  }
  return (
    <div className='text-center gap-6 flex flex-col items-center justify-center min-h-screen bg-gptgray text-white p-4'>
      <h1 className='font-bold text-2xl'>500 - Server-side error occurred</h1>
      <button
        onClick={handleOnClick}
        className='rounded-full cursor-pointer bg-gptlogo p-4 text-gray-300 hover:scale-125 transition ease-in hover:text-white hover:font-extrabold'
      >
        <ChatGPTLogoLogin />
      </button>
    </div>
  )
}
