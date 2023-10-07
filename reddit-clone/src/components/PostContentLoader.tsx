import { Skeleton } from '@/components/ui/Skeleton'

export default function PostContentLoader() {
  return (
    <article className='flex flex-col w-full gap-1'>
      <div className='grid grid-cols-[repeat(auto-fit,minmax(32px, 1fr))] gap-1'>
        <Skeleton className='h-6 w-full' />
        <Skeleton className='h-6 w-full' />
        <Skeleton className='h-6 w-full' />
      </div>
      <Skeleton className='h-32 w-1/2 mx-auto' />
      <div className='grid grid-cols-[repeat(auto-fit,minmax(32px, 1fr))] gap-1'>
        <Skeleton className='h-6 w-full' />
        <Skeleton className='h-6 w-full' />
        <Skeleton className='h-6 w-full' />
      </div>
    </article>
  )
}
