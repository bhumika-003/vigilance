import { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AppButton } from '@/components/app-button';
import { AppCard } from '@/components/app-card';
import { AppFonts, Palette } from '@/constants/theme';

type GameState = 'intro' | 'loading' | 'round' | 'revealed';

// TEMP mock data — swap for the real Cloud Function call once wired to Firebase.
const MOCK_ROUND = {
  versionA: 'Market Report Highlights Distinct Strengths and Pricing Strategies of Brand A and Brand B',
  versionB: 'Leading Experts Agree: Brand A Delivers Unmatched Quality While Brand B Struggles to Keep Up',
  engineeredVersion: 'B' as 'A' | 'B',
};

export default function BiasMirrorScreen() {
  const router = useRouter();
  const [state, setState] = useState<GameState>('intro');
  const [round, setRound] = useState<typeof MOCK_ROUND | null>(null);
  const [chosen, setChosen] = useState<'A' | 'B' | null>(null);

  const startRound = () => {
    setState('loading');
    // TODO: replace with real call to generateBiasMirrorRound Cloud Function,
    // passing one of the player's stated opinions from onboarding.
    setTimeout(() => {
      setRound(MOCK_ROUND);
      setState('round');
    }, 1200);
  };

  const pickVersion = (version: 'A' | 'B') => {
    setChosen(version);
    setState('revealed');
  };

  const playAgain = () => {
    setChosen(null);
    setRound(null);
    startRound();
  };

  const isCorrect = round && chosen === round.engineeredVersion;

  if (state === 'intro') {
    return (
      <View style={styles.centered}>
        <AppCard style={{ width: '88%' }}>
          <Text style={styles.gameTitle}>🪞 Bias Mirror</Text>
          <Text style={styles.hookText}>
            We'll show you two versions of a headline about something you like.{'\n\n'}
            One's playing you. Spot it.
          </Text>
          <AppButton title="Start" style={{ marginTop: 16 }} onPress={startRound} />
        </AppCard>
      </View>
    );
  }

  if (state === 'loading') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Palette.indigo} />
        <Text style={styles.loadingText}>Writing your headlines...</Text>
      </View>
    );
  }

  if (state === 'round' && round) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.prompt}>Which version was engineered to make you agree with it?</Text>

        <AppCard style={{ marginTop: 16 }} onTouchEnd={() => pickVersion('A')}>
          <Text style={styles.versionLabel}>Version A</Text>
          <Text style={styles.versionText}>{round.versionA}</Text>
        </AppCard>

        <AppCard style={{ marginTop: 14 }} onTouchEnd={() => pickVersion('B')}>
          <Text style={styles.versionLabel}>Version B</Text>
          <Text style={styles.versionText}>{round.versionB}</Text>
        </AppCard>
      </ScrollView>
    );
  }

  if (state === 'revealed' && round) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <AppCard style={{ marginTop: 20 }}>
          <Text style={[styles.verdictBadge, { color: isCorrect ? Palette.green : Palette.coral }]}>
            {isCorrect ? '✅ Caught it' : '❌ It got you'}
          </Text>
          <Text style={styles.explanationText}>
            Version {round.engineeredVersion} was engineered to confirm the bias. Words like "experts agree" and
            "unmatched quality" create certainty and social pressure without giving you real evidence to weigh.
          </Text>
          <AppButton title="Play another round" style={{ marginTop: 16 }} onPress={playAgain} />
          <AppButton
            title="Back to Games"
            variant="secondary"
            style={{ marginTop: 10 }}
            onPress={() => router.back()}
          />
        </AppCard>
      </ScrollView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#F5F4FC' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F4FC' },
  gameTitle: { fontFamily: AppFonts.heading, fontSize: 22, color: Palette.indigo, marginBottom: 10, textAlign: 'center' },
  hookText: { fontFamily: AppFonts.body, fontSize: 14, color: '#444', lineHeight: 21, textAlign: 'center' },
  loadingText: { fontFamily: AppFonts.body, fontSize: 15, color: Palette.indigo, marginTop: 12 },
  prompt: { fontFamily: AppFonts.headingMedium, fontSize: 17, color: Palette.indigo },
  versionLabel: { fontFamily: AppFonts.headingMedium, fontSize: 13, color: '#888', marginBottom: 6 },
  versionText: { fontFamily: AppFonts.body, fontSize: 15, color: '#222', lineHeight: 21 },
  verdictBadge: { fontFamily: AppFonts.heading, fontSize: 18, marginBottom: 10 },
  explanationText: { fontFamily: AppFonts.body, fontSize: 14, color: '#555', lineHeight: 20 },
});