import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const MINI_GAMES = [
  {
    id: 'bias-mirror',
    tag: 'COGNITIVE BIAS',
    title: 'Bias Mirror',
    subtitle: 'Confirmation Bias',
    description: 'Analyze how viral headlines are engineered to validate pre-existing beliefs and echo chambers.',
    color: '#8B5CF6',
  },
  {
    id: 'interrogation-room',
    tag: 'SOCRATIC INQUIRY',
    title: 'Interrogation Room',
    subtitle: 'Socratic Inquiry',
    description: 'Cross-examine arguments against a strict countdown timer to expose structural fallacies.',
    color: '#3B82F6',
  },
  {
    id: 'persuasion-xray',
    tag: 'NARRATIVE ANALYSIS',
    title: 'Persuasion X-Ray',
    subtitle: 'Manipulative Media',
    description: 'Deconstruct manufactured urgency, emotional triggers, and persuasion tactics in viral media.',
    color: '#10B981',
  },
  {
    id: 'causal-court',
    tag: 'STATISTICAL VERDICT',
    title: 'Causal Court',
    subtitle: 'Correlation vs Causation',
    description: 'Review empirical evidence dossiers to judge whether data proves direct causation or false correlation.',
    color: '#F59E0B',
  },
];

export default function GamesHubScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>MINI GAMES</Text>
          <Text style={styles.subtitle}>
            Interactive Media & Information Literacy Modules
          </Text>
        </View>

        {MINI_GAMES.map((game) => (
          <TouchableOpacity
            key={game.id}
            style={[styles.card, { borderColor: game.color + '33' }]}
            onPress={() => router.push(`/${game.id}` as any)}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.badge, { backgroundColor: game.color + '1F' }]}>
                <Text style={[styles.badgeText, { color: game.color }]}>
                  {game.tag}
                </Text>
              </View>
              <Text style={styles.cardTitle}>{game.title}</Text>
              <Text style={[styles.cardSubtitle, { color: game.color }]}>
                {game.subtitle.toUpperCase()}
              </Text>
            </View>

            <Text style={styles.cardDescription}>{game.description}</Text>

            <View style={[styles.playBtn, { backgroundColor: game.color }]}>
              <Text style={styles.playBtnText}>PLAY GAME →</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 1.2,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardHeader: {
    marginBottom: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.3,
  },
  cardSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 3,
  },
  cardDescription: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 18,
  },
  playBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1,
  },
});