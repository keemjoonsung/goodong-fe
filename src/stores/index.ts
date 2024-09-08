// store with zustand
import create from 'zustand'
import { User } from '../types/user'

interface MainStore {
  user: User | null
  setUser: (user: User) => void
}

const useMainStore = create<MainStore>(set => ({
  user: null,
  setUser: (user: User) => set({ user }),
}))

export default useMainStore
