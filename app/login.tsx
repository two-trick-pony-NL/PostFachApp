import { View, Text, TextInput, Button, Alert } from 'react-native'
import { useAuthStore } from '../store/auth'
import { supabase } from '../lib/supabase'

export default function Login() {
  const email = useAuthStore((s) => s.email)
  const setEmail = useAuthStore((s) => s.setEmail)

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) Alert.alert('Error', error.message)
    else Alert.alert('Check your email for the login link.')
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput
        placeholder="email@example.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <Button title="Sign in with magic link" onPress={signIn} />
    </View>
  )
}
