import { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { listContacts } from '../../../lib/api'
import { useRouter } from 'expo-router'

export default function ContactsScreen() {
  const [contacts, setContacts] = useState([])
  const router = useRouter()

  useEffect(() => {
    listContacts().then(setContacts)
  }, [])

  return (
    <FlatList
      data={contacts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => router.push(`/protected/contacts/${item.id}`)}>
            
          <View style={{ padding: 16 }}>
            <Text style={{ fontWeight: 'bold' }}>
              {item.display_name?.trim() || item.email}
            </Text>
            {item.display_name?.trim() ? <Text>{item.email}</Text> : null}
          </View>
        </TouchableOpacity>
      )}
    />
  )
}
