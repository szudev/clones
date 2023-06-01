import Message from '@/components/Message'
import { getServerSession } from 'next-auth'
import { GetServerSidePropsContext } from 'next'
import Layout from '@/components/Layout'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { Chat as ChatType } from '@prisma/client'
import useMessagesQuery from '@/hooks/messages/useMessagesQueries'
import ServerLoading from '@/components/ServerLoading'
import { useSendPromptWithChatIdMutation } from '@/hooks/messages/useMessagesMutations'
import ChatFormDynamic from '@/components/ChatFormDynamic'

export default function Chat() {
  const { messages, isMessagesLoading } = useMessagesQuery()
  const { sendPromptWithChatIdLoading } = useSendPromptWithChatIdMutation()

  return (
    <Layout>
      <main className='flex overflow-y-auto flex-1 flex-col'>
        {isMessagesLoading && (
          <div className='flex justify-center items-center flex-1'>
            <ServerLoading />
          </div>
        )}
        {!isMessagesLoading && messages
          ? messages.map((entry, index, array) => (
              <Message
                key={entry.id}
                id={entry.id}
                message={entry.message}
                answer={entry.answer}
                newMessageMutationLoading={
                  index === array.length - 1
                    ? sendPromptWithChatIdLoading
                    : false
                }
              />
            ))
          : null}
      </main>
      <ChatFormDynamic />
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
    return { props: {} }
  } catch (error) {
    return {
      props: {},
      notFound: false,
      redirect: {
        destination: '/500',
        permanent: false
      }
    }
  }
}
