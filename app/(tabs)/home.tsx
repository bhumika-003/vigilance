import { AppCard } from '@/components/app-card';
import { AppHearts } from '@/components/app-hearts';
import { AppFonts, Palette } from '@/constants/theme';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.greeting}>Welcome back 👋</Text>
      <Text style={styles.subheading}>
        Keep learning. Keep questioning.
      </Text>

      {/* Hearts */}
      <AppCard style={styles.card}>
        <Text style={styles.cardLabel}>Today's hearts</Text>
        <AppHearts total={5} filled={5} />
      </AppCard>

      {/* Streak */}
      <AppCard style={styles.card}>
        <Text style={styles.cardLabel}>Streak</Text>
        <Text style={styles.streakText}>🔥 0 days</Text>
        <Text style={styles.helperText}>
          Play a round today to start your streak.
        </Text>
      </AppCard>

      {/* Daily Progress */}
      <AppCard style={styles.card}>
        <Text style={styles.cardLabel}>Today's progress</Text>

        <View style={styles.progressHeader}>
          <Text style={styles.progressNumber}>3 / 5</Text>
          <Text style={styles.progressPercent}>60%</Text>
        </View>

        <View style={styles.progressBackground}>
          <View style={styles.progressFill} />
        </View>

        <Text style={styles.helperText}>
          You're almost there. Keep going!
        </Text>
      </AppCard>

      {/* Caught in the wild */}
      <AppCard style={styles.card}>
        <Text style={styles.cardLabel}>Caught in the wild</Text>
        <Text style={styles.statNumber}>0</Text>
        <Text style={styles.helperText}>
          Scan something real to start your count.
        </Text>
      </AppCard>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick actions</Text>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/scan')}
        >
          <Text style={styles.actionEmoji}>🔍</Text>
          <Text style={styles.actionTitle}>Scan a claim</Text>
          <Text style={styles.actionText}>Check something you're unsure about</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/games')}
        >
          <Text style={styles.actionEmoji}>🎮</Text>
          <Text style={styles.actionTitle}>Play a game</Text>
          <Text style={styles.actionText}>Practice your media skills</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F4FC',
  },

  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  greeting: {
    fontFamily: AppFonts.heading,
    fontSize: 24,
    color: Palette.indigo,
  },

  subheading: {
    fontFamily: AppFonts.body,
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },

  card: {
    marginTop: 14,
  },

  cardLabel: {
    fontFamily: AppFonts.headingMedium,
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },

  streakText: {
    fontFamily: AppFonts.heading,
    fontSize: 22,
    color: Palette.gold,
  },

  helperText: {
    fontFamily: AppFonts.body,
    fontSize: 12,
    color: '#888',
    marginTop: 6,
  },

  statNumber: {
    fontFamily: AppFonts.heading,
    fontSize: 28,
    color: Palette.green,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  progressNumber: {
    fontFamily: AppFonts.heading,
    fontSize: 22,
    color: Palette.indigo,
  },

  progressPercent: {
    fontFamily: AppFonts.headingMedium,
    fontSize: 14,
    color: Palette.green,
  },

  progressBackground: {
    height: 10,
    backgroundColor: '#E2E0EC',
    borderRadius: 10,
    marginTop: 10,
    overflow: 'hidden',
  },

  progressFill: {
    width: '60%',
    height: '100%',
    backgroundColor: Palette.indigo,
    borderRadius: 10,
  },

  sectionTitle: {
    fontFamily: AppFonts.headingMedium,
    fontSize: 18,
    color: Palette.indigo,
    marginTop: 24,
    marginBottom: 10,
  },

  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    minHeight: 150,
    elevation: 2,
  },

  actionEmoji: {
    fontSize: 28,
    marginBottom: 10,
  },

  actionTitle: {
    fontFamily: AppFonts.headingMedium,
    fontSize: 15,
    color: Palette.indigo,
  },

  actionText: {
    fontFamily: AppFonts.body,
    fontSize: 11,
    color: '#777',
    marginTop: 5,
    lineHeight: 16,
  },
});
