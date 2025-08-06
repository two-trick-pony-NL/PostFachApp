import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { useEmailStore } from '../../../store/emailforcontact'
import EmailCard from '../../../components/threads/emailCard'
import { getContact } from '../../../lib/api' // your function

export default function ContactDetailScreen() {
  const { id } = useLocalSearchParams()
  const { emailsByContact, fetchEmailsForContact, loading } = useEmailStore()
  const [contact, setContact] = useState<any>(null)

  const emails = id ? emailsByContact[id as string] || [] : []

  useEffect(() => {
    if (id) {
      fetchEmailsForContact(id as string)
      getContact(id as string).then(setContact)
    }
  }, [id])

  return (
    <View style={{ flex: 1 }}>
      {/* Contact header */}
      <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
          {contact?.display_name || contact?.email || 'Contact'}
        </Text>
        <Text style={{ color: '#666', marginTop: 4 }}>
          {emails.length} email{emails.length !== 1 ? 's' : ''} exchanged
        </Text>
        {emails.length > 0 && (
          <Text style={{ color: '#666', fontSize: 12, marginTop: 2 }}>
            Last contact: {new Date(emails[emails.length - 1].received_at).toLocaleString()}
          </Text>
        )}
        <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
          <TouchableOpacity style={{ padding: 8, backgroundColor: '#007aff', borderRadius: 6 }}>
            <Text style={{ color: 'white' }}>Compose</Text>
          </TouchableOpacity>
          {contact?.phone && (
            <TouchableOpacity style={{ padding: 8, backgroundColor: '#eee', borderRadius: 6 }}>
              <Text>Call</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Emails */}
      {loading && emails.length === 0 && (
        <Text style={{ padding: 16 }}>Loading emails...</Text>
      )}
      <FlatList
        data={emails}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EmailCard email={item} compact />}
      />
    </View>
  )
}
