import Layout from '@/components/Layout'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import LandingInfo from '@/components/LandingInfo'
import { authOptions } from '../api/auth/[...nextauth]'
import { useMessageStore } from '@/store/messages'
import { useNewMessageMutation } from '@/hooks/messages/useMessagesMutations'
import Message from '@/components/Message'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function HomeChat() {
  const {
    clearMessages,
    temporaryChat: { messages }
  } = useMessageStore((state) => state)
  const { isCreateMessageMutationLoading } = useNewMessageMutation()
  const router = useRouter()

  useEffect(() => {
    const handleClearTemporaryChat = () => {
      clearMessages()
    }

    router.events.on('routeChangeComplete', handleClearTemporaryChat)

    return () => {
      router.events.off('routeChangeComplete', handleClearTemporaryChat)
    }
  }, [])

  return (
    <Layout>
      <main className='flex overflow-y-auto flex-1 flex-col'>
        {messages.length > 0 ? (
          messages.map((entry) => (
            <Message
              key={entry.id}
              id={entry.id}
              message={entry.message}
              answer={entry.answer}
              newMessageMutationLoading={isCreateMessageMutationLoading}
            />
          ))
        ) : (
          <LandingInfo />
        )}
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
  return {
    props: {}
  }
}
