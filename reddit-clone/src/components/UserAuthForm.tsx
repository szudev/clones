'use client'

import { cn } from '@/lib/utils'
import { Button } from './ui/Button'
import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Icons } from './Icons'
import { useToast } from '@/hooks/use-toast'

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export default function UserAuthForm({ className, ...props }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()

  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      await signIn('google')
    } catch (error) {
      toast({
        title: 'An error occurred',
        description: 'There was an error login with Google',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex justify-center', className)} {...props}>
      <Button
        size='sm'
        className='w-full'
        onClick={loginWithGoogle}
        isLoading={isLoading}
      >
        {isLoading ? null : <Icons.google className='h-4 w-4 mr-2' />} Google
      </Button>
    </div>
  )
}
