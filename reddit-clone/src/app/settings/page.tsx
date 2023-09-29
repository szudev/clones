import UserNameForm from '@/components/UserNameForm'
import { Button } from '@/components/ui/Button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/Card'
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
    <section className='max-w-4xl mx-auto py-12'>
      <div className='grid items-start gap-8'>
        <h1 className='font-bold text-3xl md:text-4xl'>Settings</h1>
      </div>
      <div className='grid gap-10'>
        <UserNameForm
          user={{ id: session.user.id, username: session.user.username || '' }}
        />
        <Card className='border border-red-600'>
          <CardHeader className='border-b border-b-red-600'>
            <CardTitle>Delete Account</CardTitle>
            <CardDescription>
              Permanently remove your Account and all of its contents from the
              website. This action is not reversible.
            </CardDescription>
          </CardHeader>
          <CardFooter className='flex justify-end items-center bg-[#FEF0F0] bg-blend-multiply rounded-b-lg py-2'>
            <Button className='font-semibold bg-red-600 hover:bg-red-600 hover:brightness-75 focus:outline-red-600'>
              Delete Account
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
