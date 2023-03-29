import LandingInfo from '@/components/LandingInfo'
import Layout from '@/components/Layout'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'

export default function Home() {
  return (
    <Layout>
      <LandingInfo />
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
  if (session) {
    return {
      redirect: {
        destination: '/chat'
      }
    }
  }

  return { props: {} }
}
