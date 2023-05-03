import Layout from '@/components/Layout'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import LandingInfo from '@/components/LandingInfo'
import { authOptions } from '../api/auth/[...nextauth]'

type HomeChatProps = {
  email: string
}

export default function HomeChat({ email }: HomeChatProps) {
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
  const email = session?.user?.email!
  return {
    props: {
      email
    }
  }
}
