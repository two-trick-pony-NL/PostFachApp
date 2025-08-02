import { Tabs } from 'expo-router'
import {
  Home,
  Users,
  Paperclip,
  Mailbox,
} from 'lucide-react-native'

export default function ProtectedLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'dodgerblue',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tabs.Screen
        name="mailbox"
        options={{
          title: 'Mailbox',
          tabBarIcon: ({ color, size }) => (
            <Mailbox color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Contacts',
          tabBarIcon: ({ color, size }) => (
            <Users color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="attachments"
        options={{
          title: 'Attachments',
          tabBarIcon: ({ color, size }) => (
            <Paperclip color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  )
}
