import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import { getThreadById } from '../../../lib/api'

export default function ThreadDetailScreen() {
  const { id } = useLocalSearchParams()
  const [thread, setThread] = useState(null)
  const [expandedEmailId, setExpandedEmailId] = useState(null)

  useEffect(() => {
    if (id) {
      getThreadById(id as string).then(setThread)
    }
  }, [id])

  if (!thread) return <Text style={{ padding: 16 }}>Loading...</Text>

  const toggleEmail = (emailId) => {
    setExpandedEmailId(expandedEmailId === emailId ? null : emailId)
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 20, padding: 16 }}>{thread.subject}</Text>

      <FlatList
        data={thread.emails}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
              backgroundColor: item.is_read ? 'white' : '#eef6ff',
            }}
          >
            <TouchableOpacity onPress={() => toggleEmail(item.id)}>
              <Text style={{ fontWeight: 'bold' }}>{item.from_email}</Text>
              <Text style={{ marginVertical: 4 }}>{item.subject}</Text>
              <Text style={{ color: '#666' }}>
                {new Date(item.received_at).toLocaleString()}
              </Text>
            </TouchableOpacity>

            {expandedEmailId === item.id && (
              <ScrollView style={{ marginTop: 12, maxHeight: 200 }}>
                <Text>{item.body}</Text>
              </ScrollView>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  )
}
