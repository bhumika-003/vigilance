import { AppButton } from '@/components/app-button';
import { AppCard } from '@/components/app-card';
import { AppFonts, Palette } from '@/constants/theme';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <AppCard style={{ width: '85%', alignItems: 'center' }}>
        <Text style={styles.title}>Welcome to Vigilance</Text>
        <Text style={styles.subtitle}>Spot the fake before it spreads.</Text>
        <Link href="/personalize" asChild>
          <AppButton title="Continue" style={{ marginTop: 16, width: '100%' }} />
        </Link>
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F4FC',
  },
  title: {
    fontFamily: AppFonts.heading,
    fontSize: 22,
    color: Palette.indigo,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: AppFonts.body,
    fontSize: 14,
    color: '#555',
  },
});