import { useSession } from 'next-auth/react'

export default function UserAvatar() {
  const { data: session } = useSession()
  return (
    <img
      src={session?.user?.image as string}
      alt='imagen de usuario'
      className='rounded-sm'
      referrerPolicy='no-referrer'
    />
  )
}
