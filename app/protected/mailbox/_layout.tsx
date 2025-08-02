import { Stack } from 'expo-router'

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: true }}
    >
      <Stack.Screen name="index" options={{ title: 'Mailbox' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detail' }} />
    </Stack>
  )
}
