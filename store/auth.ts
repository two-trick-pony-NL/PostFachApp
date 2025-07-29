import { create } from 'zustand'
import { supabase } from '../lib/supabase'

type AuthStore = {
  session: any
  email: string
  setEmail: (email: string) => void
  setSession: (session: any) => void
  initSession: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  email: '',
  setEmail: (email) => set({ email }),
  setSession: (session) => set({ session }),
  initSession: async () => {
    const { data } = await supabase.auth.getSession()
    set({ session: data.session })

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session })
    })
  }
}))
