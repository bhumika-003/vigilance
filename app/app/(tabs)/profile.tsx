import { StyleSheet, Text, View } from 'react-native';
import { Palette } from '@/constants/theme';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Tab</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', backgroundColor: Palette.olive, flex: 1, justifyContent: 'center' },
  title: { color: Palette.cream, fontSize: 24, fontWeight: '800' },
});
