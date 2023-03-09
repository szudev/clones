import Layout from '@/components/Layout'
import Chat from '@/components/Chat'
import { GetServerSidePropsContext } from 'next'
import { getSession } from 'next-auth/react'
import LandingInfo from '@/components/LandingInfo'

export default function HomeChat() {
  return (
    <Layout>
      <LandingInfo />
    </Layout>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx)
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login'
      }
    }
  }

  return { props: { session } }
}
