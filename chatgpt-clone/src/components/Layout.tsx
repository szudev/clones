import Head from 'next/head'
import Aside from './Aside'
import { LayoutProps } from '@/types/props.type'
import ChatForm from './ChatForm'

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>ChatGPT Clone</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='flex flex-1 flex-col h-[100svh] md:flex-row'>
        <Aside />
        <div className='bg-gptgray w-full overflow-hidden flex-1 justify-between flex flex-col'>
          {children}
          <ChatForm />
        </div>
      </div>
    </>
  )
}
