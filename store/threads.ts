// store/threads.ts
import { create } from 'zustand'
import { persist, StorageValue } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getThreads, getThreadById } from '../lib/api'

type Thread = {
  id: number
  subject: string
  // Extend as needed
}

type ThreadState = {
  threads: Record<number, Thread>
  loading: boolean
  fetchThreads: () => Promise<void>
  fetchThreadById: (id: number) => Promise<Thread | undefined>
  clearThreads: () => void
}

// AsyncStorage wrapper
const asyncStorage = {
  getItem: async (key: string): Promise<StorageValue<ThreadState> | null> => {
    try {
      const value = await AsyncStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch (e) {
      console.warn(`[AsyncStorage] Failed to get ${key}`, e)
      return null
    }
  },
  setItem: async (key: string, value: StorageValue<ThreadState>) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.warn(`[AsyncStorage] Failed to set ${key}`, e)
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key)
    } catch (e) {
      console.warn(`[AsyncStorage] Failed to remove ${key}`, e)
    }
  },
}

export const useThreadStore = create<ThreadState>()(
  persist(
    (set, get) => ({
      threads: {},
      loading: false,

      fetchThreads: async () => {
        if (Object.keys(get().threads).length === 0) {
          set({ loading: true })
        }
        try {
          const data = await getThreads()
          const threadMap = Object.fromEntries(data.map((t: Thread) => [t.id, t]))
          set({ threads: threadMap })
        } finally {
          set({ loading: false })
        }
      },

      fetchThreadById: async (id: number) => {
        const cached = get().threads[id]
        if (cached) {
          console.log(`Thread ${id} served from cache`)
          return cached
        }
        set({ loading: true })
        try {
          const thread = await getThreadById(id)
          set((state) => ({
            threads: { ...state.threads, [id]: thread },
          }))
          return thread
        } finally {
          set({ loading: false })
        }
      },

      clearThreads: () => set({ threads: {} }),
    }),
    {
      name: 'threads-storage',
      storage: asyncStorage,
      skipHydration: true,
    }
  )
)
