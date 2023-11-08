import { create } from 'zustand'

interface UserProfileNavState {
  active: {
    subreddits: boolean
    posts: boolean
  }
  setSubredditsActive: () => void
  setPostsActive: () => void
}

export const useProfileNavStore = create<UserProfileNavState>((set) => ({
  active: {
    posts: true,
    subreddits: false
  },
  setSubredditsActive: () =>
    set((state) => ({
      active: {
        ...state.active,
        subreddits: state.active.subreddits ? false : true,
        posts: false,
        subscriptions: false
      }
    })),
  setPostsActive: () =>
    set((state) => ({
      active: {
        ...state.active,
        posts: state.active.posts ? false : true,
        subreddits: false,
        subscriptions: false
      }
    }))
}))
