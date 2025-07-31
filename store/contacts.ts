import { create } from 'zustand'
import { persist, StorageValue } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { listContacts } from '../lib/api'

export interface Contact {
  id: string
  email: string
  display_name: string
  always_notify: boolean
  muted: boolean
  marked_as_spam: boolean
  important: boolean
  whitelist: boolean
}

interface ContactsStore {
  contacts: Contact[]
  loading: boolean
  fetchContacts: () => Promise<void>
  setContacts: (contacts: Contact[]) => void
  addContact: (contact: Contact) => void
  updateContact: (id: string, data: Partial<Contact>) => void
  removeContact: (id: string) => void
  clearContacts: () => void
}

const asyncStorage = {
  getItem: async (key: string): Promise<StorageValue<ContactsStore> | null> => {
    try {
      const value = await AsyncStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch (e) {
      console.warn(`[AsyncStorage] Failed to get ${key}`, e)
      return null
    }
  },
  setItem: async (key: string, value: StorageValue<ContactsStore>) => {
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

export const useContactsStore = create<ContactsStore>()(
  persist(
    (set, get) => ({
      contacts: [],
      loading: false,

      fetchContacts: async () => {
        const contacts = get().contacts
        if (contacts.length === 0) {
          set({ loading: true }) // only show loading if store is empty
        }
        try {
          const freshContacts = await listContacts()
          set({ contacts: freshContacts })
        } finally {
          set({ loading: false })
        }
      },

      setContacts: (contacts) => set({ contacts }),

      addContact: (contact) =>
        set((state) => ({
          contacts: [...state.contacts, contact],
        })),

      updateContact: (id, data) =>
        set((state) => ({
          contacts: state.contacts.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        })),

      removeContact: (id) =>
        set((state) => ({
          contacts: state.contacts.filter((c) => c.id !== id),
        })),

      clearContacts: () => set({ contacts: [] }),
    }),
    {
      name: 'contacts-storage',
      storage: asyncStorage,
    }
  )
)
