import { useEffect, useMemo, useRef } from 'react'
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useContactsStore } from '../../../store/contacts'
import { Star, VolumeX, ShieldCheck } from 'lucide-react-native'

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const ITEM_HEIGHT = 60

export default function ContactsScreen() {
  const { contacts, fetchContacts, loading } = useContactsStore()
  const router = useRouter()
  const sectionListRef = useRef<SectionList>(null)

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  const sections = useMemo(() => {
    const grouped: Record<string, any[]> = {}

    Object.values(contacts).forEach((contact) => {
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
              .replace(/[^a-zA-Z0-9]/g, '') // remove special chars
              .slice(0, 2)
              .toUpperCase()}
          </Text>
        </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.display_name || item.email}</Text>
            {item.display_name && <Text style={styles.email}>{item.email}</Text>}
          </View>

          <View style={styles.icons}>
            {item.important && <Star color="gold" size={20} />}
            {item.muted && <VolumeX color="gray" size={20} />}
            {item.whitelist && <ShieldCheck color="green" size={20} />}
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
})
