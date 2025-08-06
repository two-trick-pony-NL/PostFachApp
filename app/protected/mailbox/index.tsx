import { useEffect, useMemo, useRef, useState } from 'react'
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useThreadStore } from '../../../store/threads'
import { BellOff } from 'lucide-react-native'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const dateLabels = ['Today', 'Yesterday', 'This Week', 'Last Week', 'This Month', 'Older']

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function getAvatarLabel(name: string) {
  if (!name) return ''
  const words = name.split(' ').filter(Boolean)

  let letters: string[]
  if (words.length > 1) {
    letters = words.map(w => w[0].toUpperCase())
  } else {
    letters = name.slice(0, 2).toUpperCase().split('')
  }

  // filter to first two valid alphabet letters
  const validLetters = letters.filter(l => ALPHABET.includes(l)).slice(0, 2)

  // if none valid, fallback to first alphabet letter in name
  if (validLetters.length === 0) {
    for (const char of name.toUpperCase()) {
      if (ALPHABET.includes(char)) {
        validLetters.push(char)
        break
      }
    }
  }

  return validLetters.join('')
}


function ThreadAvatars({ emails }: { emails?: { from_contact?: { display_name?: string, email: string } }[] }) {
  if (!emails || emails.length === 0) return null

  const maxAvatars = 3
  const uniqueContacts = Array.from(
    new Map(
      emails.map(email => {
        const key = email.from_contact?.display_name || email.from_contact?.email || email.from_email
        return [key, email]
      })
    ).values()
  ).slice(0, maxAvatars)

  return (
    <View style={styles.avatarStack}>
      {uniqueContacts.map((email, i) => {
        const label = getAvatarLabel(email.from_contact?.display_name || email.from_contact?.email || email.from_email)
        return (
          <View
            key={label}
            style={[
              styles.avatar,
              { left: i * 20, zIndex: maxAvatars - i, position: 'absolute' },
            ]}
          >
            <Text style={styles.avatarText}>{label}</Text>
          </View>
        )
      })}
    </View>
  )
}



function formatReceivedDate(dateString: string) {
  const date = dayjs(dateString)
  const now = dayjs()
  if (now.diff(date, 'day') < 2) return date.fromNow()
  return date.format('MMM D, HH:mm')
}

function groupThreadsByDate(threads: any[]) {
  const grouped: Record<string, any[]> = {}

  threads.forEach((thread) => {
    const lastEmail = thread.emails?.[thread.emails.length - 1]
    if (!lastEmail) return

    const received = dayjs(lastEmail.received_at)
    const now = dayjs()
    let label = 'Older'

    if (received.isSame(now, 'day')) label = 'Today'
    else if (received.isSame(now.subtract(1, 'day'), 'day')) label = 'Yesterday'
    else if (received.isAfter(now.subtract(1, 'week'))) label = 'This Week'
    else if (received.isAfter(now.subtract(2, 'week'))) label = 'Last Week'
    else if (received.isAfter(now.startOf('month'))) label = 'This Month'

    if (!grouped[label]) grouped[label] = []
    grouped[label].push(thread)
  })

  return Object.keys(grouped)
    .sort((a, b) => dateLabels.indexOf(a) - dateLabels.indexOf(b))
    .map((title) => ({
      title,
      data: grouped[title].sort(
        (a, b) =>
          dayjs(b.emails[b.emails.length - 1]?.received_at).unix() -
          dayjs(a.emails[a.emails.length - 1]?.received_at).unix()
      ),
    }))
}

export default function ThreadListScreen() {
  const { threads, fetchThreads, loading } = useThreadStore()
  const router = useRouter()
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      await fetchThreads()
      setInitialLoading(false)
    }
    init()
  }, [fetchThreads])

  const sections = useMemo(() => groupThreadsByDate(Object.values(threads)), [threads])

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={{ marginTop: 8 }}>Loading threads...</Text>
      </View>
    )
  }

  if (!loading && Object.keys(threads).length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No threads found.</Text>
      </View>
    )
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderSectionHeader={({ section }) => (
        <Text style={styles.sectionHeader}>{section.title}</Text>
      )}
      renderItem={({ item }) => {
        const lastEmail = item.emails?.[item.emails.length - 1]
        const isUnread = lastEmail ? !lastEmail.is_read : false

        return (
          <TouchableOpacity
            onPress={() => router.push(`/protected/mailbox/${item.id}`)}
            style={styles.threadContainer}
          >
            <ThreadAvatars emails={item.emails} />
            <View style={{ flex: 1 }}>
              <View style={styles.subjectRow}>
                <Text style={[styles.subject, isUnread && styles.unreadSubject]} numberOfLines={1}>
                  {item.thread_starter_contact.display_name || item.thread_starter_contact.email}
                </Text>
                {item.muted && (
                  <View style={styles.mutedContainer}>
                    <BellOff size={16} color="gray" />
                    <Text style={styles.mutedText}>Muted</Text>
                  </View>
                )}
              </View>
              <Text>{item.subject}</Text>
              <Text style={styles.snippet} numberOfLines={3}>
                {lastEmail?.body || lastEmail?.sanitized_html_body}
              </Text>
            </View>
            {lastEmail?.received_at && (
              <Text style={styles.receivedAt}>{formatReceivedDate(lastEmail.received_at)}</Text>
            )}
          </TouchableOpacity>
        )
      }}
      refreshing={loading}
      onRefresh={fetchThreads}
      stickySectionHeadersEnabled
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false} // removed scrollbar
    />
  )
}

const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 6,
    fontWeight: 'bold',
    fontSize: 14,
  },
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
