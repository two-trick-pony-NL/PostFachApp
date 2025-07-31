import { useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import { View, Text, FlatList } from 'react-native'
import { useEmailStore } from '../../../store/emailforcontact'

export default function ContactDetailScreen() {
  const { id } = useLocalSearchParams()
  const { emailsByContact, fetchEmailsForContact, loading } = useEmailStore()

  const emails = id ? emailsByContact[id as string] || [] : []

  useEffect(() => {
    if (id) {
      fetchEmailsForContact(id as string)
    }
  }, [id])

  return (
  <View style={{ flex: 1 }}>
    {loading && emails.length === 0 && (
      <Text style={{ padding: 16 }}>Loading emails...</Text>
    )}
    <FlatList
      data={emails}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ padding: 16 }}>
          <Text style={{ fontWeight: 'bold' }}>{item.subject}</Text>
          <Text>{item.body}</Text>
        </View>
      )}
    />
  </View>

  )
}
