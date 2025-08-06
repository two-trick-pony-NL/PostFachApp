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
import { useContactsStore, Contact } from '../../../store/contacts'
import { Bell, BellOff, ShieldOff } from 'lucide-react-native'

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function ContactsScreen() {
  const { contacts, fetchContacts, loadContactsFromStorage, loading } = useContactsStore()
  const router = useRouter()
  const sectionListRef = useRef<SectionList>(null)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      await loadContactsFromStorage()
      await fetchContacts()
      setInitialLoading(false)
    }
    init()
  }, [])

  const sections = useMemo(() => {
    const grouped: Record<string, Contact[]> = {}

    contacts.forEach((contact) => {
      const key = (contact.display_name || contact.email)[0]?.toUpperCase() || '#'
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(contact)
    })

    return Object.keys(grouped)
      .sort()
      .map((letter) => ({
        title: letter,
        data: grouped[letter].sort((a, b) =>
          (a.display_name || a.email).localeCompare(b.display_name || b.email)
        ),
      }))
  }, [contacts])

  const scrollToSection = (letter: string) => {
    const index = sections.findIndex((section) => section.title === letter)
    if (index !== -1 && sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
        sectionIndex: index,
        itemIndex: 0,
        viewOffset: 0,
      })
    }
  }

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={{ marginTop: 8 }}>Loading contacts...</Text>
      </View>
    )
  }

  if (!loading && contacts.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No contacts found.</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <SectionList
        ref={sectionListRef}
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/protected/contacts/${item.id}`)}
            style={styles.itemContainer}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(item.display_name || item.email)
                  .replace(/[^a-zA-Z0-9]/g, '')
                  .slice(0, 2)
                  .toUpperCase()}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.display_name || item.email}</Text>
              {item.display_name && <Text style={styles.email}>{item.email}</Text>}
            </View>

            <View style={styles.icons}>
              {item.is_marked_as_spam && <ShieldOff color="red" size={20} />}
              {item.notification_preference === 'always_notify' && <Bell color="green" size={20} />}
              {item.notification_preference === 'muted' && <BellOff color="gray" size={20} />}
            </View>
          </TouchableOpacity>
        )}
        refreshing={loading}
        onRefresh={fetchContacts}
        stickySectionHeadersEnabled
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      {/* Alphabet scroll bar */}
      <View style={styles.alphabetContainer}>
        {alphabet.map((letter) => (
          <TouchableOpacity key={letter} onPress={() => scrollToSection(letter)}>
            <Text style={styles.alphabetLetter}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
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
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
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
  name: {
    fontWeight: '600',
    fontSize: 16,
  },
  email: {
    color: '#666',
    fontSize: 13,
  },
  icons: {
    flexDirection: 'row',
    gap: 8,
  },
  alphabetContainer: {
    paddingVertical: 10,
    paddingRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alphabetLetter: {
    fontSize: 12,
    paddingVertical: 2,
    color: '#888',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
