// store/contacts.ts
import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { listContacts } from '../lib/api'

export interface Contact {
  id: string
  email: string
  display_name: string
  notification_preference: string
  is_marked_as_spam: boolean
}

interface ContactsState {
  contacts: Contact[]
  loading: boolean
  error: string | null
  fetchContacts: () => Promise<void>
  markAsSpam: (id: string) => Promise<void>
  loadContactsFromStorage: () => Promise<void>
}

const STORAGE_KEY = 'contacts'

export const useContactsStore = create<ContactsState>((set, get) => ({
  contacts: [],
  loading: false,
  error: null,

  loadContactsFromStorage: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY)
      if (stored) {
        set({ contacts: JSON.parse(stored) })
      }
    } catch (err) {
      console.error('Failed to load contacts from storage', err)
    }
  },

  fetchContacts: async () => {
    set({ loading: true, error: null })
    try {
      const data = await listContacts()
      const results = data.results || []
      set({ contacts: results, loading: false })
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(results))
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch contacts', loading: false })
    }
  },

  markAsSpam: async (id: string) => {
    const updated = get().contacts.map(contact =>
      contact.id === id ? { ...contact, is_marked_as_spam: true } : contact
    )
    set({ contacts: updated })
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  },
}))
