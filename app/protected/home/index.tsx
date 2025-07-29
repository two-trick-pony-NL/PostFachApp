import { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native'
import { getThreads } from '../../../lib/api'
import { useRouter } from 'expo-router'

export default function ThreadListScreen() {
  const [threads, setThreads] = useState([])
  const router = useRouter()

  useEffect(() => {
    getThreads().then(setThreads)
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={threads}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/protected/home/${item.id}`)}>
            <View style={{ padding: 16 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.subject}</Text>
              <Text numberOfLines={1} style={{ color: '#666' }}>{item.snippet}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  )
}
