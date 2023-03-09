import Layout from '@/components/Layout'
import Chat from '@/components/Chat'
import { GetServerSidePropsContext } from 'next'
import { getSession } from 'next-auth/react'

export default function Home() {
  return (
    <>
      <Layout>
        <Chat />
      </Layout>
    </>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx)
  if (!session)
    return {
      redirect: {
        destination: '/auth/login'
      }
    }
  return { props: { session } }
}
