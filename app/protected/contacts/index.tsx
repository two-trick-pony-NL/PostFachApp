import { useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useContactsStore } from '../../../store/contacts'

export default function ContactsScreen() {
  const { contacts, fetchContacts, loading } = useContactsStore()
  const router = useRouter()

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  const contactList = Object.values(contacts)

  return (
    <>
      {loading && <Text style={{ padding: 16 }}>Loading...</Text>}
      <FlatList
        data={contactList}
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
    </>
  )
}
