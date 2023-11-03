import { create } from 'zustand'

interface UserProfileNavState {
  active: {
    subreddits: boolean
    posts: boolean
    subscriptions: boolean
  }
  setSubredditsActive: () => void
  setPostsActive: () => void
  setSubscriptionsActive: () => void
}

export const useProfileNavStore = create<UserProfileNavState>((set) => ({
  active: {
    posts: true,
    subreddits: false,
    subscriptions: false
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
    })),
  setSubscriptionsActive: () =>
    set((state) => ({
      active: {
        ...state.active,
        subscriptions: state.active.subscriptions ? false : true,
        posts: false,
        subreddits: false
      }
    }))
}))
