// app/index.tsx
import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useAuthStore, hasHydrated } from '../store/auth'

export default function IndexRedirect() {
  const router = useRouter()
  const hydrated = hasHydrated()
  const { isLoggedIn, checkSession } = useAuthStore()

  useEffect(() => {
    if (!hydrated) return

    checkSession().then(() => {
      if (useAuthStore.getState().isLoggedIn) {
        router.replace('/protected/home')
      } else {
        router.replace('/login')
      }
    })
  }, [hydrated])

  return null // or a loading spinner
}
