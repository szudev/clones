'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import useCreateCommunity from '@/hooks/use-create-community'

export default function Page() {
  const { input, setInput, createCommunity, createCommunityLoading, router } =
    useCreateCommunity()

  return (
    <div className='container flex items-center h-full max-w-3xl mx-auto'>
      <div className='relative bg-white w-full h-fit p-4 rounded-lg space-y-6'>
        <div className='flex justify-between items-center border-b border-zinc-300 pb-4'>
          <h1 className='text-xl font-semibold'>Create a community</h1>
        </div>
        <div>
          <p className='text-lg font-medium'>Name</p>
          <p className='text-xs pb-2'>
            Community names including capitalization cannot be changed.
          </p>
          <div className='relative'>
            <p className='absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400'>
              r/
            </p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className='pl-6'
            />
          </div>
        </div>
        <div className='flex justify-end gap-4'>
          <Button variant='subtle' onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            isLoading={createCommunityLoading}
            disabled={input.length <= 2 || createCommunityLoading}
            onClick={() => createCommunity()}
          >
            Create community
          </Button>
        </div>
      </div>
    </div>
  )
}
