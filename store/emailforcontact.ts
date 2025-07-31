// store/emails.ts
import { create } from 'zustand'
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

export const useEmailStore = create<EmailState>((set, get) => ({
  emailsByContact: {},
  loading: false,

  fetchEmailsForContact: async (contactId) => {
    set({ loading: true })
    try {
      const emails = await getEmailsForContact(contactId)
      set((state) => ({
        emailsByContact: { ...state.emailsByContact, [contactId]: emails }
      }))
    } finally {
      set({ loading: false })
    }
  },

  clearEmails: () => set({ emailsByContact: {} }),
}))
