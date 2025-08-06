import { create } from 'zustand'
import { persist, StorageValue } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { listAttachments, getAttachmentById } from '../lib/api'

// Types
export interface Attachment {
  id: string
  filename: string
  content_type: string
  size: number
  created_at: string
  private_file_url?: string
  // add more fields if needed
}

interface AttachmentState {
  attachments: Record<string, Attachment>
  loading: boolean
  fetchAttachments: () => Promise<void>
  fetchAttachmentById: (id: string) => Promise<Attachment | undefined>
  clearAttachments: () => void
}

// AsyncStorage wrapper
const asyncStorage = {
  getItem: async (key: string): Promise<StorageValue<AttachmentState> | null> => {
    try {
      const value = await AsyncStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch (e) {
      console.warn(`[AsyncStorage] Failed to get ${key}`, e)
      return null
    }
  },
  setItem: async (key: string, value: StorageValue<AttachmentState>) => {
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
export const useAttachmentStore = create<AttachmentState>()(
  persist(
    (set, get) => ({
      attachments: {},
      loading: false,

      fetchAttachments: async () => {
        if (Object.keys(get().attachments).length === 0) {
          set({ loading: true })
        }
        try {
          const data = await listAttachments()
          const map: Record<string, Attachment> = Object.fromEntries(
            data.map((att) => [att.id, att])
          )
          set({ attachments: map })
        } finally {
          set({ loading: false })
        }
      },

      fetchAttachmentById: async (id: string) => {
        const cached = get().attachments[id]
        if (cached) return cached

        set({ loading: true })
        try {
          const att = await getAttachmentById(id)
          set((state) => ({
            attachments: { ...state.attachments, [id]: att },
          }))
          return att
        } finally {
          set({ loading: false })
        }
      },

      clearAttachments: () => set({ attachments: {} }),
    }),
    {
      name: 'attachments-storage',
      storage: asyncStorage,
      skipHydration: true,
    }
  )
)
