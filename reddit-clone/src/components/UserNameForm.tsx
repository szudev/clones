'use client'

import { useForm } from 'react-hook-form'
import { UserNameValidator, UserNameRequest } from '@/lib/validators/username'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from './ui/Card'
import { Label } from './ui/Label'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import useCustomToast from '@/hooks/use-custom-toast'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface Props {
  user: Pick<User, 'id' | 'username'>
}

export default function UserNameForm({ user }: Props) {
  const router = useRouter()
  const {
    loginRequiredToast,
    resourceAlreadyExistToast,
    genericErrorToast,
    successOperationToast
  } = useCustomToast()
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<UserNameRequest>({
    resolver: zodResolver(UserNameValidator),
    defaultValues: {
      username: user.username || ''
    }
  })

  const { mutate: changeUsername, isLoading: isChangeUsernameLoading } =
    useMutation({
      mutationFn: async ({ username }: UserNameRequest) => {
        const payload: UserNameRequest = {
          username
        }

        const { data } = await axios.patch('/api/user/username', payload)
        return data
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          if (err.response?.status === 401) {
            return loginRequiredToast()
          }
          if (err.response?.status === 409) {
            return resourceAlreadyExistToast({ resource: 'Username' })
          }
          if (err.response?.status === 422) {
            return toast({
              title: 'Invalid username',
              description:
                'Please choose an username without special characters.'
            })
          }
          return genericErrorToast({ action: 'Update', resource: 'username' })
        }

        return toast({
          title: '',
          description: '',
          variant: 'destructive'
        })
      },
      onSuccess: () => {
        successOperationToast({
          action: 'updated',
          resource: 'username'
        })
        router.refresh()
      }
    })

  return (
    <form onSubmit={handleSubmit((e) => changeUsername(e))}>
      <Card>
        <CardHeader>
          <CardTitle>Your username</CardTitle>
          <CardDescription>
            This will be used in your activities inside this website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='relative grid gap-1'>
            <div className='absolute top-0 left-0 w-8 h-10 grid place-items-center'>
              <span className='text-sm text-zinc-400'>u/</span>
            </div>
            <Label htmlFor='username' className='sr-only'>
              Username
            </Label>
            <Input
              id='username'
              className='w-[400px] pl-6'
              size={32}
              {...register('username')}
            />
            {errors?.username && (
              <p className='px-1 text-xs text-red-600'>
                {errors.username.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            isLoading={isChangeUsernameLoading}
            disabled={isChangeUsernameLoading}
          >
            Save
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
