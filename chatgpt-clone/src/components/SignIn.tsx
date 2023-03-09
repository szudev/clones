import { ChatGPTLogoLogin } from './Icons'
import { signIn } from 'next-auth/react'

export default function SignIn() {
  return (
    <section className='flex min-h-screen bg-gptgray justify-center items-center'>
      <div className='flex flex-col p-4 text-white gap-3'>
        <figure className='flex justify-center items-center pb-2'>
          <ChatGPTLogoLogin />
        </figure>
        <div className='text-center'>Welcome to ChatGPT</div>
        <div className='text-center'>
          Log in with your OpenAI account to continue
        </div>
        <div className='flex justify-center'>
          <button className='btn relative btn-primary' onClick={() => signIn()}>
            <div className='flex w-full items-center justify-center gap-2'>
              Log in
            </div>
          </button>
        </div>
      </div>
    </section>
  )
}
