import DeleteAccountCard from '@/components/DeleteAccountCard'
import UserNameForm from '@/components/UserNameForm'
import { authOptions, getAuthSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Pirateddit Settings',
  description: 'Account management and website settings.'
}

export default async function Page() {
  const session = await getAuthSession()
  if (!session?.user) return redirect(authOptions.pages?.signIn || 'sign-in')
  return (
    <section className='flex flex-col max-w-4xl mx-auto md:py-12 pb-6 gap-4'>
      <h1 className='font-bold text-3xl md:text-4xl'>Settings</h1>
      <div className='flex flex-col gap-4'>
        <UserNameForm
          user={{ id: session.user.id, username: session.user.username || '' }}
        />
        <DeleteAccountCard user={{ id: session.user.id }} />
      </div>
    </section>
  )
}
