import { create } from 'zustand'
import { listContacts } from '../lib/api' // your API call

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

export const useContactsStore = create<ContactsStore>((set, get) => ({
  contacts: [],
  loading: false,

  fetchContacts: async () => {
    set({ loading: true })
    try {
      const contacts = await listContacts()
      set({ contacts })
    } finally {
      set({ loading: false })
    }
  },

  setContacts: (contacts) => set({ contacts }),

  addContact: (contact) =>
    set((state) => ({ contacts: [...state.contacts, contact] })),

  updateContact: (id, data) =>
    set((state) => ({
      contacts: state.contacts.map((c) => (c.id === id ? { ...c, ...data } : c)),
    })),

  removeContact: (id) =>
    set((state) => ({
      contacts: state.contacts.filter((c) => c.id !== id),
    })),

  clearContacts: () => set({ contacts: [] }),
}))
