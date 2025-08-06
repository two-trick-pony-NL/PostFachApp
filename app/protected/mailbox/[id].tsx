import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { SafeAreaView, FlatList, Text } from 'react-native'
import { getThreadById } from '../../../lib/api'
import EmailCard from '../../../components/threads/emailCard'

export default function ThreadDetailScreen() {
  const { id } = useLocalSearchParams()
  const [thread, setThread] = useState<any>(null)

  useEffect(() => {
    if (id) getThreadById(id as string).then(setThread)
  }, [id])

  if (!thread) return <Text style={{ padding: 16 }}>Loading...</Text>

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={thread.emails}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EmailCard email={item} />}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  )
}
