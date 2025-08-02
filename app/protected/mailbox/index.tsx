import { useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useThreadStore } from '../../../store/threads'
import { BellOff } from 'lucide-react-native'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

// Helper component to render stacked avatars
function ThreadAvatars({ emails }: { emails?: { from_email: string }[] }) {
  if (!emails || emails.length === 0) return null

  const maxAvatars = 3
  const uniqueEmails = Array.from(
    new Set(emails.map((email) => email.from_email))
  ).slice(0, maxAvatars)

  return (
    <View style={styles.avatarStack}>
      {uniqueEmails.map((email, i) => {
        const initials = email
          .replace(/[^a-zA-Z0-9]/g, '')
          .slice(0, 2)
          .toUpperCase()
        return (
          <View
            key={email}
            style={[
              styles.avatar,
              { left: i * 20, zIndex: maxAvatars - i, position: 'absolute' },
            ]}
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )
      })}
    </View>
  )
}

function formatReceivedDate(dateString: string) {
  const date = dayjs(dateString)
  const now = dayjs()
  if (now.diff(date, 'day') < 2) {
    return date.fromNow()
  }
  return date.format('MMM D, HH:mm')
}

export default function ThreadListScreen() {
  const { threads, fetchThreads, loading } = useThreadStore()
  const router = useRouter()

  useEffect(() => {
    fetchThreads()
  }, [fetchThreads])

  const threadList = Object.values(threads)

  return (
    <View style={{ flex: 1 }}>
      {loading && threadList.length === 0 && (
        <Text style={{ padding: 16 }}>Loading...</Text>
      )}
      <FlatList
        data={threadList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const lastEmail = item.emails?.[item.emails.length - 1]
          const isUnread = lastEmail ? !lastEmail.is_read : false

          return (
            <TouchableOpacity
              onPress={() => router.push(`/protected/mailbox/${item.id}`)}
              style={styles.threadContainer}
            >
              <ThreadAvatars emails={item.emails} />

              <View style={{ flex: 1, marginLeft: 60 }}>
                <View style={styles.subjectRow}>
                  <Text
                    style={[styles.subject, isUnread && styles.unreadSubject]}
                    numberOfLines={1}
                  >
                    {item.subject}
                  </Text>
                  {item.muted && (
                    <View style={styles.mutedContainer}>
                      <BellOff size={16} color="gray" />
                      <Text style={styles.mutedText}>Muted</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.snippet} numberOfLines={2}>
                  {lastEmail?.body || ''}
                </Text>
              </View>

              {lastEmail?.received_at && (
                <Text style={styles.receivedAt}>
                  {formatReceivedDate(lastEmail.received_at)}
                </Text>
              )}
            </TouchableOpacity>
          )
        }}
        refreshing={loading}
        onRefresh={fetchThreads}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  threadContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarStack: {
    width: 60,
    height: 48,
    position: 'relative',
  },
  avatar: {
    backgroundColor: '#007aff20',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontWeight: 'bold',
    color: '#007aff',
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subject: {
    fontWeight: '600',
    fontSize: 16,
    flex: 1,
  },
  unreadSubject: {
    fontWeight: '700',
    color: '#007aff',
  },
  mutedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mutedText: {
    color: 'gray',
    fontSize: 12,
  },
  snippet: {
    color: '#666',
    fontSize: 13,
    marginTop: 4,
  },
  receivedAt: {
    fontSize: 11,
    color: '#999',
    marginLeft: 8,
    marginTop: 4,
    alignSelf: 'flex-start',
    width: 70,
    textAlign: 'right',
  },
})
