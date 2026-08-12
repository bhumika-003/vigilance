import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function LoginScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Login Screen</Text>
      <Link href="/personalize" style={{ marginTop: 20, fontSize: 18, color: 'blue' }}>
        Continue
      </Link>
    </View>
  );
}