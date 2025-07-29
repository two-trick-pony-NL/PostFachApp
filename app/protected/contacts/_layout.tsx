import { Stack } from 'expo-router'

export default function ContactsLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: true }}
    >
      <Stack.Screen name="index" options={{ title: 'Contacts' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detail' }} />
    </Stack>
  )
}
