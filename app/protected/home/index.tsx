import { useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native'
import { useRouter } from 'expo-router'
import { useThreadStore } from '../../../store/threads'

export default function ThreadListScreen() {
  const { threads, fetchThreads, loading } = useThreadStore()
  const router = useRouter()

  useEffect(() => {
    fetchThreads()
  }, [fetchThreads])

  const threadList = Object.values(threads)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading && <Text style={{ padding: 16 }}>Loading...</Text>}
      <FlatList
        data={threadList}
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
