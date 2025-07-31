import { Tabs } from 'expo-router'

export default function ProtectedLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="contacts" options={{ title: 'Contacts' }} />
    </Tabs>
  )
}
