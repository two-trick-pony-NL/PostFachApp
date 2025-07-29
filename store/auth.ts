import { create } from 'zustand'
import { supabase } from '../lib/supabase'

type AuthStore = {
  session: any | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<{ error: string | null }>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
  setSession: (session: any | null) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  isLoggedIn: false,

  setSession: (session) => set({ session, isLoggedIn: !!session }),

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error && data.session) {
      set({ session: data.session, isLoggedIn: true })
      return { error: null }
    }
    return { error: error?.message || 'Login failed' }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ session: null, isLoggedIn: false })
  },

  checkSession: async () => {
    const { data } = await supabase.auth.getSession()
    set({ session: data.session, isLoggedIn: !!data.session })
  },
}))
