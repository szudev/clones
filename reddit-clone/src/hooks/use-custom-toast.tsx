import Link from 'next/link'
import { toast } from './use-toast'
import { buttonVariants } from '@/components/ui/Button'

interface GenericToastProps {
  resource?: string | null
  action?: 'Register' | 'Delete' | 'Update' | null
}

interface SuccessOperationToastProps {
  resource?: string
  action?: 'registered' | 'deleted' | 'updated'
}

export default function useCustomToast() {
  const genericErrorToast = ({ resource, action }: GenericToastProps) =>
    toast({
      title: 'There was an error',
      description:
        resource && action
          ? `Could not ${action} ${resource}.`
          : 'Could not finished the operation, please try again.',
      variant: 'destructive'
    })

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

  const resourceAlreadyExistToast = ({ resource }: { resource: string }) =>
    toast({
      title: `${resource} already exist`,
      description: `Please choose a different ${resource.toLowerCase()}.`,
      variant: 'destructive'
    })

  const successOperationToast = ({
    action,
    resource
  }: SuccessOperationToastProps) =>
    toast({
      title: 'Success',
      description:
        action && resource
          ? `The ${resource} was succesfully ${action}.`
          : 'The operation was successfully executed.'
    })

  return {
    genericErrorToast,
    loginRequiredToast,
    resourceAlreadyExistToast,
    successOperationToast
  }
}
