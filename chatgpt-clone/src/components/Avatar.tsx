import { ReactNode } from 'react'

type AvatarProps = {
  children: ReactNode
}

export function Avatar({ children }: AvatarProps) {
  return (
    <figure className='w-[30px] h-[30px] flex items-center justify-center rounded-sm bg-gptlogo'>
      {children}
    </figure>
  )
}
