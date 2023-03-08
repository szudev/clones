import { ChatGPTLogoLogin } from '@/components/Icons'
import { useSession, signIn, signOut } from 'next-auth/react'

function SignedOut() {
  return (
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
  )
}

function SignedIn({ email }: { email: string | null | undefined }) {
  return (
    <div className='flex flex-col p-4 gap-3 text-white'>
      <p>Welcome back, {email}</p>
      <button className='btn relative btn-primary' onClick={() => signOut()}>
        <div className='flex w-full items-center justify-center gap-2'>
          Logout
        </div>
      </button>
    </div>
  )
}

export default function Login() {
  const { data: session } = useSession()

  return (
    <section className='flex min-h-screen bg-gptgray justify-center items-center'>
      {session ? <SignedIn email={session.user?.email} /> : <SignedOut />}
    </section>
  )
}
