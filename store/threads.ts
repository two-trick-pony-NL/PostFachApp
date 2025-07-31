// store/threads.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getThreads, getThreadById } from '../lib/api'

type Thread = {
  id: number
  subject: string
  // Add other fields as needed
}

type ThreadState = {
  threads: Record<number, Thread>
  loading: boolean
  fetchThreads: () => Promise<void>
  fetchThreadById: (id: number) => Promise<Thread | undefined>
  clearThreads: () => void
}

const asyncStorage = {
  getItem: async (key: string) => {
    const value = await AsyncStorage.getItem(key)
    return value ? JSON.parse(value) : null
  },
  setItem: async (key: string, value: any) => {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  },
  removeItem: async (key: string) => {
    await AsyncStorage.removeItem(key)
  },
}

export const useThreadStore = create<ThreadState>()(
  persist(
    (set, get) => ({
      threads: {},
      loading: false,

    fetchThreads: async () => {
    set({ loading: true })
    try {
        console.log('Fetching threads from API')
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

    console.log(`Thread ${id} fetching from API`)
    const thread = await getThreadById(id)
    set((state) => ({
        threads: { ...state.threads, [id]: thread },
    }))
    return thread
    },


      clearThreads: () => set({ threads: {} }),
    }),
    {
      name: 'threads-storage',
      storage: asyncStorage,
    }
  )
)
