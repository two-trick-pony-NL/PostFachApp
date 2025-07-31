import { useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useAttachmentStore } from '../../../store/attachments'

export default function AttachmentsScreen() {
  const { attachments, loading, fetchAttachments } = useAttachmentStore()
  const router = useRouter()

  useEffect(() => {
    fetchAttachments()
  }, [fetchAttachments])

  const attachmentList = Object.values(attachments)

  return (
    <View style={{ flex: 1 }}>
      {loading && attachmentList.length === 0 && (
        <Text style={{ padding: 16 }}>Loading attachments...</Text>
      )}
      <FlatList
        data={attachmentList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
        <TouchableOpacity onPress={() => router.push(`/protected/attachments/${item.id}`)}>    
            <View style={{ padding: 16 }}>
              <Text style={{ fontWeight: 'bold' }}>{item.filename}</Text>
              <Text>{item.mime_type}</Text>
              <Text>{item.size} bytes</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}
