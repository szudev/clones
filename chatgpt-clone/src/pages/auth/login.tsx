import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]'
import { GetServerSidePropsContext } from 'next'
import SignIn from '@/components/SignIn'
import Head from 'next/head'

export default function Login() {
  return (
    <>
      <Head>
        <title>ChatGPT Clone</title>
        <link rel='icon' href='/chatgpt-icon.ico' />
      </Head>
      <SignIn />
    </>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (session)
    return {
      redirect: {
        destination: '/'
      }
    }

  return { props: {} }
}
