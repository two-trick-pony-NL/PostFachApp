import { Tabs } from 'expo-router'

export default function ProtectedLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home/index" options={{ title: 'Home' }} />
      <Tabs.Screen name="contacts/index" options={{ title: 'Contacts' }} />
    </Tabs>
  )
}
