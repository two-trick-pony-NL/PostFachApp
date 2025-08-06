import { useState } from 'react'
import { View, Text, Dimensions, ScrollView, Linking, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'

const DEVICE_WIDTH = Dimensions.get('window').width - 32

interface EmailCardProps {
  email: any
  compact?: boolean
}

export default function EmailCard({ email, compact = false }: EmailCardProps) {
  const [webViewHeight, setWebViewHeight] = useState(0)

  const renderRecipients = (label: string, contacts: any[]) => {
    if (!contacts?.length || compact) return null
    return (
      <Text style={styles.recipients}>
        {label}: {contacts.map(c => c.display_name || c.email).join(', ')}
      </Text>
    )
  }

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <Text style={styles.sender}>
          {email.from_contact?.display_name || email.from_email}
        </Text>

        {renderRecipients('To', email.to_contacts)}
        {renderRecipients('CC', email.cc_contacts)}

        <Text style={styles.subject}>{email.subject}</Text>

        {!compact && (
          <Text style={styles.date}>
            {new Date(email.received_at).toLocaleString()}
          </Text>
        )}

        <View style={{ marginTop: 12 }}>
          {email.sanitized_html_body ? (
            <WebView
              originWhitelist={['*']}
              source={{
                html: `
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    body { font-family: -apple-system, Roboto, sans-serif; color: #333; margin:0; padding:0; }
                    img { max-width: 100%; height: auto; }
                    a { color: #007aff; text-decoration: none; }
                  </style>
                  ${email.sanitized_html_body}
                `,
              }}
              style={{ height: webViewHeight, width: DEVICE_WIDTH }}
              scrollEnabled={false}
              onMessage={(event) => setWebViewHeight(Number(event.nativeEvent.data))}
              injectedJavaScript={`
                const height = document.body.scrollHeight;
                window.ReactNativeWebView.postMessage(height);
                true;
              `}
              onShouldStartLoadWithRequest={(request) => {
                if (request.url !== 'about:blank') {
                  Linking.openURL(request.url)
                  return false
                }
                return true
              }}
            />
          ) : (
            <ScrollView>
              <Text style={styles.body}>{email.body}</Text>
            </ScrollView>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    // subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  sender: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4,
  },
  recipients: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  subject: {
    fontSize: 15,
    fontWeight: '600',
    marginVertical: 6,
    color: '#222',
  },
  date: {
    color: '#888',
    fontSize: 12,
  },
  body: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
})
