import { create } from 'zustand'
import { persist, StorageValue } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getThreads, getThreadById } from '../lib/api'

// Types
export interface Contact {
  id: string
  email: string
  display_name: string
  notification_preference: 'default' | string
  is_marked_as_spam: boolean
}

export interface Email {
  id: string
  from_email: string
  from_contact: Contact
  // Extend as needed
}

export interface Thread {
  id: string
  subject: string
  created_at: string
  muted: boolean
  is_snoozed: boolean
  snoozed_until: string | null
  is_archived: boolean
  is_trashed: boolean
  thread_starter_contact: Contact
  number_of_emails: number
  number_of_contacts: number
  emails: Email[]
}

interface ThreadResponse {
  count: number
  next: string | null
  previous: string | null
  results: Thread[]
}

type ThreadState = {
  threads: Record<string, Thread>
  loading: boolean
  fetchThreads: () => Promise<void>
  fetchThreadById: (id: string) => Promise<Thread | undefined>
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

// Store
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
          const response: ThreadResponse = await getThreads()
          const threadMap: Record<string, Thread> = Object.fromEntries(
            response.results.map((t) => [t.id, t])
          )
          set({ threads: threadMap })
        } finally {
          set({ loading: false })
        }
      },

      fetchThreadById: async (id: string) => {
        const cached = get().threads[id]
        if (cached) {
          console.log(`Thread ${id} served from cache`)
          return cached
        }
        set({ loading: true })
        try {
          const thread: Thread = await getThreadById(id)
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
