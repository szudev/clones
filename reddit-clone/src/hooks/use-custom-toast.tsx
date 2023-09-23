import Link from 'next/link'
import { toast } from './use-toast'
import { buttonVariants } from '@/components/ui/Button'

export default function useCustomToast() {
  const loginRequiredToast = () => {
    const { dismiss } = toast({
      title: 'Login required.',
      description: 'You have to login in order to do that.',
      variant: 'destructive',
      action: (
        <Link
          href='/sign-in'
          onClick={() => dismiss()}
          className={buttonVariants({ variant: 'outline' })}
        >
          Login
        </Link>
      )
    })
  }

  return { loginRequiredToast }
}
