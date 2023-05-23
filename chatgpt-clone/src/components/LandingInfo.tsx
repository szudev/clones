import Head from 'next/head'
import { SunIcon, ThunderIcon, LimitationIcon } from './Icons'

export default function LandingInfo() {
  return (
    <>
      <Head>
        <title>New Chat</title>
      </Head>
      <div className='flex flex-col items-center text-sm bg-gptgray w-full overflow-y-auto'>
        <div className='text-gray-800 w-full md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col px-6 dark:text-gray-100'>
          <h1 className='text-4xl font-semibold text-center mt-6 sm:mt-[20vh] ml-auto mr-auto mb-10 sm:mb-16 flex gap-2 items-center justify-center'>
            ChatGPT
          </h1>
          <div className='md:flex items-start text-center gap-3.5'>
            <div className='flex flex-col mb-8 md:mb-auto gap-3.5 flex-1'>
              <h2 className='flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2'>
                <SunIcon />
                Examples
              </h2>
              <ul className='flex flex-col gap-3.5 w-full sm:max-w-md m-auto'>
                <button className='w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900'>
                  "Explain quantum computing in simple terms" →
                </button>
                <button className='w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900'>
                  "Got any creative ideas for a 10 year old’s birthday?" →
                </button>
                <button className='w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900'>
                  "How do I make an HTTP request in Javascript?" →
                </button>
              </ul>
            </div>
            <div className='flex flex-col mb-8 md:mb-auto gap-3.5 flex-1'>
              <h2 className='flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2'>
                <ThunderIcon />
                Capabilities
              </h2>
              <ul className='flex flex-col gap-3.5 w-full sm:max-w-md m-auto'>
                <li className='w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md'>
                  Remembers what user said earlier in the conversation
                </li>
                <li className='w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md'>
                  Allows user to provide follow-up corrections
                </li>
                <li className='w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md'>
                  Trained to decline inappropriate requests
                </li>
              </ul>
            </div>
            <div className='flex flex-col mb-8 md:mb-auto gap-3.5 flex-1'>
              <h2 className='flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2'>
                <LimitationIcon />
                Limitations
              </h2>
              <ul className='flex flex-col gap-3.5 w-full sm:max-w-md m-auto'>
                <li className='w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md'>
                  May occasionally generate incorrect information
                </li>
                <li className='w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md'>
                  May occasionally produce harmful instructions or biased
                  content
                </li>
                <li className='w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md'>
                  Limited knowledge of world and events after 2021
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
