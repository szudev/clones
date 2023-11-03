'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import PostContentLoader from './PostContentLoader'

const Output = dynamic(
  async () => (await import('editorjs-react-renderer')).default,
  {
    ssr: false,
    loading: () => <PostContentLoader />
  }
)

interface Props {
  content: any
}

const style = {
  paragraph: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem'
  }
}

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer
}

export default function EditorOutput({ content }: Props) {
  return (
    <Output
      data={content}
      style={style}
      className='text-sm'
      renderers={renderers}
    />
  )
}

function CustomImageRenderer({ data }: any) {
  const src = data.file.url

  return (
    <div className='relative w-full min-h-[15rem]'>
      <Image alt='post image' className='object-contain' fill src={src} />
    </div>
  )
}

function CustomCodeRenderer({ data }: any) {
  return (
    <pre className='bg-gray-800 rounded-md p-4 overflow-x-auto'>
      <code className='text-gray-100 text-sm'>{data.code}</code>
    </pre>
  )
}
