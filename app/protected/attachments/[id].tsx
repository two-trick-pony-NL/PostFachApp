import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { useAttachmentStore, Attachment } from '../../../store/attachments'

export default function AttachmentDetailScreen() {
  const { id } = useLocalSearchParams()
  const { fetchAttachmentById, loading, attachments } = useAttachmentStore()
  const [attachment, setAttachment] = useState<Attachment | undefined>(undefined)

  useEffect(() => {
    if (!id) return
    const cached = attachments.find((a) => a.id === id)
    if (cached) {
      setAttachment(cached)
    } else {
      fetchAttachmentById(id).then(setAttachment)
    }
  }, [id, attachments])

  if (loading && !attachment) {
    return <ActivityIndicator style={{ marginTop: 32 }} />
  }

  if (!attachment) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Attachment not found</Text>
      </View>
    )
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{attachment.filename}</Text>
      <Text style={{ marginBottom: 8 }}>{attachment.mime_type}</Text>
      <Text style={{ marginBottom: 16 }}>{attachment.size} bytes</Text>
    </View>
  )
}
