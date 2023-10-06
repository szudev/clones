import { Loader2 } from 'lucide-react'
import { Button } from './ui/Button'
import { Textarea } from './ui/Textarea'
import { Label } from './ui/Label'

export default function CommentSectionLoader() {
  return (
    <section className='flex flex-col gap-y-4 mt-4 border-t border-t-gray-500'>
      <div className='pt-4 grid w-full gap-1.5'>
        <Label>Your Comment</Label>
        <div className='mt-2'>
          <Textarea id='comment' placeholder='Add a comment here' rows={1} />
          <div className='mt-2 flex justify-end'>
            <Button disabled>Post</Button>
          </div>
        </div>
      </div>
      <div className='flex w-full h-full items-center justify-center'>
        <Loader2 className='h-6 w-6 animate-spin text-zinc-500' />
      </div>
    </section>
  )
}
