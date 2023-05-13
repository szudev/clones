import { ChatGPTLogoLogin } from '@/components/Icons'
import { useRouter } from 'next/navigation'

export default function Custom404() {
  const router = useRouter()
  const handleOnClick = () => {
    router.push('/chat')
  }
  return (
    <div className='text-center flex flex-col items-center justify-center min-h-screen bg-gptgray text-white p-4'>
      <h1 className='font-bold text-2xl'>404 - Page Not Found</h1>
      <p className='text-xl pb-4'>
        The page you are looking for does not exist.
      </p>
      <button
        onClick={handleOnClick}
        className='rounded-full cursor-pointer bg-gptlogo p-4 text-gray-300 hover:scale-125 transition ease-in hover:text-white hover:font-extrabold'
      >
        <ChatGPTLogoLogin />
      </button>
    </div>
  )
}
