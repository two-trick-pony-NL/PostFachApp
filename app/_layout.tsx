import { useEffect } from 'react'
import { Slot, useRouter } from 'expo-router'
import { useAuthStore } from '../store/auth'
import Login from './login'

export default function Layout() {
  const { session, initSession } = useAuthStore()

  useEffect(() => {
    initSession()
  }, [])

  if (!session) return <Login />

  return <Slot />
}
