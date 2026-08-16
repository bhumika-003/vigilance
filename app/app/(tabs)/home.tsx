import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AppCard } from '@/components/app-card';
import { AppHearts } from '@/components/app-hearts';
import { AppButton } from '@/components/app-button';
import { AppProgressBar } from '@/components/app-progress-bar';
import { AppFonts, Palette } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.greeting}>Welcome back 👋</Text>

      <AppCard style={{ marginTop: 14 }}>
        <Text style={styles.cardLabel}>Today's hearts</Text>
        <AppHearts total={5} filled={5} />
      </AppCard>

      <AppCard style={{ marginTop: 12 }}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardLabel}>Daily progress</Text>
          <Text style={styles.progressPercent}>0%</Text>
        </View>
        <AppProgressBar progress={0} color={Palette.indigo} />
        <Text style={styles.helperText}>0 of 5 rounds played today</Text>
      </AppCard>

      <View style={styles.twoCol}>
        <AppCard style={styles.halfCard}>
          <Text style={styles.cardLabel}>Streak</Text>
          <Text style={styles.streakText}>🔥 0</Text>
          <Text style={styles.helperTextSmall}>days</Text>
        </AppCard>

        <AppCard style={styles.halfCard}>
          <Text style={styles.cardLabel}>Caught</Text>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.helperTextSmall}>in the wild</Text>
        </AppCard>
      </View>

      <Text style={styles.sectionLabel}>Quick actions</Text>
      <View style={styles.quickRow}>
        <AppButton title="Scan something" color={Palette.green} style={{ flex: 1, marginRight: 8 }} onPress={() => router.push('/scan')} />
        <AppButton title="Play a game" color={Palette.gold} style={{ flex: 1, marginLeft: 8 }} onPress={() => router.push('/games')} />
      </View>

      <AppButton title="TEST: Bias Mirror" variant="secondary" style={{ marginTop: 12 }} onPress={() => router.push('/bias-mirror')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#F5F4FC' },
  greeting: { fontFamily: AppFonts.heading, fontSize: 24, color: Palette.indigo, marginBottom: 4 },
  cardLabel: { fontFamily: AppFonts.headingMedium, fontSize: 13, color: '#666' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  progressPercent: { fontFamily: AppFonts.headingMedium, fontSize: 13, color: Palette.indigo },
  streakText: { fontFamily: AppFonts.heading, fontSize: 24, color: Palette.gold, marginTop: 4 },
  statNumber: { fontFamily: AppFonts.heading, fontSize: 24, color: Palette.green, marginTop: 4 },
  helperText: { fontFamily: AppFonts.body, fontSize: 12, color: '#888', marginTop: 6 },
  helperTextSmall: { fontFamily: AppFonts.body, fontSize: 11, color: '#999', marginTop: 2 },
  twoCol: { flexDirection: 'row', marginTop: 12, gap: 12 },
  halfCard: { flex: 1 },
  sectionLabel: { fontFamily: AppFonts.headingMedium, fontSize: 14, color: '#666', marginTop: 22, marginBottom: 8 },
  quickRow: { flexDirection: 'row' },
});