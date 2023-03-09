import { getSession } from 'next-auth/react'
import { GetServerSidePropsContext } from 'next'
import SignIn from '@/components/SignIn'

export default function Login() {
  return <SignIn />
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx)
  if (session)
    return {
      redirect: {
        destination: '/'
      }
    }

  return { props: {} }
}
