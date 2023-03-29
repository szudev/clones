import Layout from '@/components/Layout'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import LandingInfo from '@/components/LandingInfo'
import { authOptions } from '../api/auth/[...nextauth]'
import { ChatsType } from '@/store/chats'
import useStateSetter from '@/hooks/useStateSetter'
import { getChats } from '@/lib/prisma/chat'

type HomeChatProps = {
  email: string
  retrievedChats: ChatsType[]
  errorMessage: string | null
}

export default function HomeChat({
  email,
  retrievedChats,
  errorMessage
}: HomeChatProps) {
  useStateSetter({ email, retrievedChats, errorMessage })

  return (
    <Layout>
      <LandingInfo />
    </Layout>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  ctx.res.setHeader(
    'Cache-control',
    'public, smaxage=10, stale-while-revalidate=59'
  )
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login'
      }
    }
  }
  const email = session?.user?.email!
  try {
    const { chats } = await getChats({ email })
    return { props: { email, retrievedChats: chats, errorMessage: null } }
  } catch (error) {
    return {
      props: {
        email,
        retrievedChats: [],
        errorMessage:
          'History is temporarily unavailable. We are working to restore this feature as soon as possible.'
      }
    }
  }
}
