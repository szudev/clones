import { useMessageStore } from '@/store/messages'
import Message from '@/components/Message'
import { getServerSession } from 'next-auth'
import { GetServerSidePropsContext } from 'next'
import Layout from '@/components/Layout'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { ChatsType } from '@/store/chats'
import useStateSetter from '@/hooks/useStateSetter'
import { Chat as ChatType } from '@prisma/client'

type HomeChatProps = {
  email: string
  retrievedChats: ChatsType[]
  errorMessage: string | null
}

export default function Chat({
  email,
  retrievedChats,
  errorMessage
}: HomeChatProps) {
  const messages = useMessageStore((state) => state.messages)
  useStateSetter({ email, retrievedChats, errorMessage })

  return (
    <Layout>
      <main className='flex flex-col overflow-y-auto'>
        {messages.map((entry) => (
          <Message key={entry.id} {...entry} />
        ))}
      </main>
    </Layout>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login'
      }
    }
  }
  const email = session?.user?.email!
  const { id } = ctx.query
  if (!id) return { notFound: true }
  try {
    const response = await fetch(
      `${process.env.API_ENDPOINT}/api/chats?email=${email}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    const { chats } = (await response.json()) as { chats: ChatType[] }
    if (!chats.some((chat) => chat.id === id)) return { notFound: true }
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
