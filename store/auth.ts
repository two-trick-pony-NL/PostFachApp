import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

type AuthStore = {
  session: any | null
  isLoggedIn: boolean
  hydrated: boolean
  setHydrated: (value: boolean) => void
  login: (email: string, password: string) => Promise<{ error: string | null }>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
  setSession: (session: any | null) => void
}

let authListener: { unsubscribe: () => void } | null = null

const asyncStorageWrapper = {
  getItem: async (key: string) => AsyncStorage.getItem(key),
  setItem: async (key: string, value: string) => {
    if (typeof value !== 'string') value = JSON.stringify(value)
    await AsyncStorage.setItem(key, value)
  },
  removeItem: async (key: string) => AsyncStorage.removeItem(key),
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      session: null,
      isLoggedIn: false,
      hydrated: false,
      setHydrated: (value: boolean) => set({ hydrated: value }),

      setSession: (session) => {
        console.log('Setting session:', session ? 'Session exists' : 'Session null')
        set({ session, isLoggedIn: !!session })
      },

      login: async (email, password) => {
        console.log('Logging in user:', email)
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (!error && data.session) {
          console.log('Login successful, session created')
          set({ session: data.session, isLoggedIn: true })
          return { error: null }
        }
        console.log('Login failed:', error?.message || 'Unknown error')
        return { error: error?.message || 'Login failed' }
      },

      logout: async () => {
        console.log('Logging out user')
        await supabase.auth.signOut()
        set({ session: null, isLoggedIn: false })
      },

      checkSession: async () => {
        console.log('Checking existing session...')
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          //console.log('Session restored from supabase:', data.session)
          console
        } else {
          console.log('No existing session found, user needs to log in')
        }
        set({ session: data.session, isLoggedIn: !!data.session })

        if (!authListener) {
          authListener = supabase.auth.onAuthStateChange((_event, session) => {
            console.log('Auth state changed:', session ? 'Session active' : 'No session')
            set({ session, isLoggedIn: !!session })
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: asyncStorageWrapper,
      partialize: (state) => ({ session: state.session, isLoggedIn: state.isLoggedIn }),
      onRehydrateStorage: () => (state) => {
        console.log('Auth store rehydrated')
        state?.setHydrated(true)
      },
    }
  )
)

export const hasHydrated = () => useAuthStore.getState().hydrated
