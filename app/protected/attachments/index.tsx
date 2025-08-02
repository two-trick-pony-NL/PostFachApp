import { useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useAttachmentStore } from '../../../store/attachments'
import {
  FileText,
  FileImage,
  FileAudio,
  FileVideo,
  FileArchive,
  FileCode,
  FileSpreadsheet,
  FileSignature,
  File,
} from 'lucide-react-native'

const screenWidth = Dimensions.get('window').width
const numColumns = 2
const spacing = 12
const itemSize = (screenWidth - spacing * (numColumns + 1)) / numColumns

export default function AttachmentsScreen() {
  const { attachments, loading, fetchAttachments } = useAttachmentStore()
  const router = useRouter()

  useEffect(() => {
    fetchAttachments()
  }, [fetchAttachments])

  const attachmentList = Object.values(attachments)

  console.log('Attachments count:', attachmentList.length)

  function renderPreview(item: typeof attachmentList[0]) {
    if (item.mime_type.startsWith('image/') && item.private_file_url) {
      return (
        <Image
          source={{ uri: item.private_file_url }}
          style={styles.imagePreview}
          resizeMode="cover"
        />
      )
    }
    // fallback icon
    const Icon = getFileIcon(item.mime_type)
    return <Icon color="#007aff" size={48} />
  }

  return (
    <View style={{ flex: 1 }}>
      {loading && attachmentList.length === 0 && (
        <Text style={{ padding: 16 }}>Loading attachments...</Text>
      )}
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing }}
        key={numColumns}
        data={attachmentList}
        numColumns={numColumns}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: spacing }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/protected/attachments/${item.id}`)}
            style={[styles.tile, { width: itemSize }]}
          >
            <View style={styles.previewContainer}>{renderPreview(item)}</View>
            <Text style={styles.filename} numberOfLines={2}>
              {item.filename}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              {item.mime_type}
            </Text>
            <Text style={styles.meta}>{formatBytes(item.size)}</Text>
          </TouchableOpacity>
        )}
        refreshing={loading}
        onRefresh={fetchAttachments}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

function getFileIcon(mime: string) {
  if (mime.startsWith('image/')) return FileImage
  if (mime.startsWith('audio/')) return FileAudio
  if (mime.startsWith('video/')) return FileVideo
  if (mime.includes('pdf')) return FileText
  if (mime.includes('zip') || mime.includes('compressed')) return FileArchive
  if (
    mime.includes('csv') ||
    mime.includes('spreadsheet') ||
    mime.includes('excel') ||
    mime.includes('sheet')
  )
    return FileSpreadsheet
  if (
    mime.includes('json') ||
    mime.includes('xml') ||
    mime.includes('javascript') ||
    mime.includes('plain')
  )
    return FileCode
  if (mime.includes('msword') || mime.includes('wordprocessingml')) return FileSignature

  return File
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(1)} MB`
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    justifyContent: 'flex-start',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 10,
  },
  previewContainer: {
    marginBottom: 12,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f4f8',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  filename: {
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
    color: '#222',
  },
  meta: {
    color: '#777',
    fontSize: 13,
    textAlign: 'center',
  },
})
