import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text, FlatList } from 'react-native'
import { getEmailsForContact } from '../../../lib/api'

export default function ContactDetailScreen() {
  const { id } = useLocalSearchParams()
  const [emails, setEmails] = useState([])

  useEffect(() => {
    getEmailsForContact(id as string).then(setEmails)
  }, [id])

  return (
    <FlatList
      data={emails}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 16 }}>
          <Text style={{ fontWeight: 'bold' }}>{item.subject}</Text>
          <Text>{item.body}</Text>
        </View>
      )}
    />
  )
}
