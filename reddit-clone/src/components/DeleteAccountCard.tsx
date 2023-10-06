'use client'

import { Button } from './ui/Button'
import { User } from '@prisma/client'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from './ui/Card'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import useCustomToast from '@/hooks/use-custom-toast'
import { toast } from '@/hooks/use-toast'
import { signOut } from 'next-auth/react'

interface Props {
  user: Pick<User, 'id'>
}

export default function DeleteAccountCard({ user }: Props) {
  const { genericErrorToast } = useCustomToast()
  const { mutate: deleteAccount, isLoading: isDeleteAccountLoading } =
    useMutation({
      mutationFn: async () => {
        const { data } = await axios.delete(`/api/user/account/${user.id}`)
        return data
      },
      onError: () => {
        return genericErrorToast({ action: 'Delete', resource: 'account' })
      },
      onSuccess: () => {
        signOut({ callbackUrl: `${window.location.origin}/sign-in` })
        return toast({
          title: 'Success',
          description: 'Your account was successfully deleted.'
        })
      }
    })
  return (
    <Card className='border border-red-600'>
      <CardHeader className='border-b border-b-red-600'>
        <CardTitle>Delete Account</CardTitle>
        <CardDescription>
          Permanently remove your Account and all of its contents from the
          website. This action is not reversible.
        </CardDescription>
      </CardHeader>
      <CardFooter className='flex justify-end items-center bg-[#FEF0F0] bg-blend-multiply rounded-b-lg py-2'>
        <Button
          onClick={() => deleteAccount()}
          isLoading={isDeleteAccountLoading}
          disabled={isDeleteAccountLoading}
          className='font-semibold bg-red-600 hover:bg-red-600 hover:brightness-75 focus:outline-red-600'
        >
          Delete Account
        </Button>
      </CardFooter>
    </Card>
  )
}
