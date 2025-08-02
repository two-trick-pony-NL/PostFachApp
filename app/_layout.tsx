import { useEffect, useState } from 'react'
import { useRouter, usePathname, Slot } from 'expo-router'
import { useAuthStore } from '../store/auth'

export default function RootLayout() {
  const router = useRouter()
  const pathname = usePathname()
  const { isLoggedIn, checkSession } = useAuthStore()

  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    checkSession().then(() => setIsReady(true))
  }, [])

  useEffect(() => {
    if (!isReady) return
    if (!isLoggedIn && pathname !== '/login') {
      router.replace('/login')
    } else if (isLoggedIn && pathname === '/login') {
      router.replace('/protected/mailbox')
    }
  }, [isLoggedIn, pathname, isReady])

  return <Slot />
}
