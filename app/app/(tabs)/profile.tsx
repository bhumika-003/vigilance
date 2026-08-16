import { AppButton } from '@/components/app-button';
import { AppCard } from '@/components/app-card';
import { AppFonts, Palette } from '@/constants/theme';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitial}>D</Text>
        </View>
        <Text style={styles.name}>Your Name</Text>
        <Text style={styles.level}>Level 1</Text>
      </View>

      <AppCard style={{ marginTop: 20 }}>
        <Text style={styles.cardLabel}>Your stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBlock}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Caught</Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>
        </View>
      </AppCard>

      <AppCard style={{ marginTop: 14 }}>
        <Text style={styles.cardLabel}>Badges</Text>
        <Text style={styles.helperText}>No badges yet — keep playing and scanning to earn some.</Text>
      </AppCard>

      <AppButton title="Settings" variant="secondary" style={{ marginTop: 20 }} onPress={() => {}} />
      <AppButton title="Log out" variant="secondary" style={{ marginTop: 10 }} onPress={() => {}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#F5F4FC' },
  avatarWrap: { alignItems: 'center' },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: Palette.indigo, justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { fontFamily: AppFonts.heading, fontSize: 28, color: '#fff' },
  name: { fontFamily: AppFonts.heading, fontSize: 18, color: Palette.indigo, marginTop: 10 },
  level: { fontFamily: AppFonts.body, fontSize: 13, color: '#888' },
  cardLabel: { fontFamily: AppFonts.headingMedium, fontSize: 14, color: '#666', marginBottom: 10 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statBlock: { alignItems: 'center' },
  statNumber: { fontFamily: AppFonts.heading, fontSize: 20, color: Palette.green },
  statLabel: { fontFamily: AppFonts.body, fontSize: 12, color: '#888', marginTop: 2 },
  helperText: { fontFamily: AppFonts.body, fontSize: 13, color: '#888' },
});