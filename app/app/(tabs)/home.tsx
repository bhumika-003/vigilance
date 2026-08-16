import { AppCard } from '@/components/app-card';
import { AppHearts } from '@/components/app-hearts';
import { AppFonts, Palette } from '@/constants/theme';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.greeting}>Welcome back 👋</Text>

      <AppCard style={{ marginTop: 16 }}>
        <Text style={styles.cardLabel}>Today's hearts</Text>
        <AppHearts total={5} filled={5} />
      </AppCard>

      <AppCard style={{ marginTop: 14 }}>
        <Text style={styles.cardLabel}>Streak</Text>
        <Text style={styles.streakText}>🔥 0 days</Text>
        <Text style={styles.helperText}>Play a round today to start your streak.</Text>
      </AppCard>

      <AppCard style={{ marginTop: 14 }}>
        <Text style={styles.cardLabel}>Caught in the wild</Text>
        <Text style={styles.statNumber}>0</Text>
        <Text style={styles.helperText}>Scan something real to start your count.</Text>
      </AppCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#F5F4FC' },
  greeting: { fontFamily: AppFonts.heading, fontSize: 24, color: Palette.indigo },
  cardLabel: { fontFamily: AppFonts.headingMedium, fontSize: 14, color: '#666', marginBottom: 8 },
  streakText: { fontFamily: AppFonts.heading, fontSize: 22, color: Palette.gold },
  statNumber: { fontFamily: AppFonts.heading, fontSize: 28, color: Palette.green },
  helperText: { fontFamily: AppFonts.body, fontSize: 12, color: '#888', marginTop: 4 },
});
