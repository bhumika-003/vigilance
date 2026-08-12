import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function PersonalizeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Personalize Screen</Text>
      <Link href="/home" style={{ marginTop: 20, fontSize: 18, color: 'blue' }}>
        Finish
      </Link>
    </View>
  );
}