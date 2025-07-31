import { create } from 'zustand'
import { listAttachments, getAttachmentById } from '../lib/api' // Add getAttachmentById

export interface Attachment {
  id: string
  filename: string
  mime_type: string
  size: number
  download_count: number
  share_url_expiry: string
  created_at: string
  updated_at: string
  share_url: string
  private_file_url: string
}

interface AttachmentStore {
  attachments: Attachment[]
  loading: boolean
  fetchAttachments: () => Promise<void>
  fetchAttachmentById: (id: string) => Promise<Attachment | undefined>
  setAttachments: (attachments: Attachment[]) => void
  addAttachment: (attachment: Attachment) => void
  updateAttachment: (id: string, data: Partial<Attachment>) => void
  removeAttachment: (id: string) => void
  clearAttachments: () => void
}

export const useAttachmentStore = create<AttachmentStore>((set, get) => ({
  attachments: [],
  loading: false,

  fetchAttachments: async () => {
    set({ loading: true })
    try {
      const data = await listAttachments()
      set({ attachments: data })
    } catch (e) {
      console.error('Failed to fetch attachments', e)
    } finally {
      set({ loading: false })
    }
  },

  fetchAttachmentById: async (id: string) => {
    const existing = get().attachments.find((a) => a.id === id)
    if (existing) return existing

    try {
      const attachment = await getAttachmentById(id)
      set((state) => ({
        attachments: [...state.attachments, attachment],
      }))
      return attachment
    } catch (error) {
      console.error('Failed to fetch attachment by id', error)
      return undefined
    }
  },

  setAttachments: (attachments) => set({ attachments }),
  addAttachment: (attachment) =>
    set((state) => ({ attachments: [...state.attachments, attachment] })),
  updateAttachment: (id, data) =>
    set((state) => ({
      attachments: state.attachments.map((a) =>
        a.id === id ? { ...a, ...data } : a
      ),
    })),
  removeAttachment: (id) =>
    set((state) => ({
      attachments: state.attachments.filter((a) => a.id !== id),
    })),
  clearAttachments: () => set({ attachments: [] }),
}))
