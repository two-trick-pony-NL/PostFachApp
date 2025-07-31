import create from 'zustand'

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

export interface Email {
  id: string
  from_email: string
  subject: string
  body: string
  sanitized_html_body: string
  is_read: boolean
  is_starred: boolean
  received_at: string
}

export interface Thread {
  id: string
  subject: string
  created_at: string
  emails: Email[]
}

export interface EmailMessage {
  id: string
  status: string
  thread: Thread
  direction: string
  owner: string
  from_email: string
  from_contact: any | null
  to_contacts: Contact[]
  message_id: string
  in_reply_to: string | null
  subject: string
  body: string
  sanitized_html_body: string
  is_read: boolean
  is_starred: boolean
  is_archived: boolean
  is_snoozed: boolean
  snoozed_until: string | null
  is_pinned: boolean
  received_at: string
  created_at: string
  updated_at: string
  attachments: any[]
}

interface EmailStore {
  email: EmailMessage | null
  setEmail: (email: EmailMessage) => void
  markRead: (read: boolean) => void
  toggleStar: () => void
  clearEmail: () => void
}

export const useEmailStore = create<EmailStore>((set) => ({
  email: null,
  setEmail: (email) => set({ email }),
  markRead: (read) =>
    set((state) => state.email ? { email: { ...state.email, is_read: read } } : {}),
  toggleStar: () =>
    set((state) =>
      state.email
        ? { email: { ...state.email, is_starred: !state.email.is_starred } }
        : {}
    ),
  clearEmail: () => set({ email: null }),
}))
