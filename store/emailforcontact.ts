// store/emails.ts
import { create } from 'zustand'
import { persist, StorageValue } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getEmailsForContact } from '../lib/api'

export interface Email {
  id: string
  subject: string
  body: string
  // other fields if needed
}

interface EmailState {
  emailsByContact: Record<string, Email[]>
  loading: boolean
  fetchEmailsForContact: (contactId: string) => Promise<void>
  clearEmails: () => void
}

const asyncStorage = {
  getItem: async (key: string): Promise<StorageValue<EmailState> | null> => {
    try {
      const value = await AsyncStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch (e) {
      console.warn(`[AsyncStorage] Failed to get ${key}`, e)
      return null
    }
  },
  setItem: async (key: string, value: StorageValue<EmailState>) => {
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

export const useEmailStore = create<EmailState>()(
  persist(
    (set, get) => ({
      emailsByContact: {},
      loading: false,

      fetchEmailsForContact: async (contactId) => {
        if (!get().emailsByContact[contactId]) {
          set({ loading: true })
        }
        try {
          const emails = await getEmailsForContact(contactId)
          set((state) => ({
            emailsByContact: {
              ...state.emailsByContact,
              [contactId]: emails,
            },
          }))
        } finally {
          set({ loading: false })
        }
      },

      clearEmails: () => set({ emailsByContact: {} }),
    }),
    {
      name: 'emails-storage',
      storage: asyncStorage,
      skipHydration: true,
    }
  )
)
