import { create } from 'zustand'
import { User } from 'next-auth'

interface UserState extends Omit<User, 'id' | 'image' | 'name'> {
  setUserEmail: ({ email }: Omit<User, 'id' | 'image' | 'name'>) => void
}

export const useUserStore = create<UserState>()((set, get) => ({
  email: null,
  setUserEmail: ({ email }) => {
    set({ email })
  }
}))
