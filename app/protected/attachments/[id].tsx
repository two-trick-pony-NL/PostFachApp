import { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useAttachmentStore, Attachment } from '../../../store/attachments'

export default function AttachmentDetailScreen() {
  const { id } = useLocalSearchParams() as { id: string }
  const { fetchAttachmentById, attachments, loading } = useAttachmentStore()
  const [attachment, setAttachment] = useState<Attachment | undefined>()

  useEffect(() => {
    if (!id) return

    // Lookup directly from store (attachments is a record)
    const cached = attachments[id]
    if (cached) {
      setAttachment(cached)
    } else {
      fetchAttachmentById(id).then(setAttachment)
    }
  }, [id, attachments, fetchAttachmentById])

  if (loading && !attachment) return <Text>Loading...</Text>
  if (!attachment) return <Text>Attachment not found</Text>

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: '700', fontSize: 18 }}>{attachment.filename}</Text>
      <Text>{attachment.content_type}</Text>
      <Text>{attachment.size} bytes</Text>
      {/* Render more details */}
    </View>
  )
}
