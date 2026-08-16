import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';

type GameStage = 'LANDING' | 'CASE_PRESENTATION' | 'ANALYSIS' | 'VERDICT';

interface CaseOption {
  id: string;
  label: string;
  isCorrect: boolean;
  explanation: string;
}

interface CaseData {
  headline: string;
  premise: string;
  options: CaseOption[];
  verdictSummary: string;
}

const MOCK_CASE: CaseData = {
  headline: '"Students who sleep more get better grades!" says the study.',
  premise: 'Whoa — so more sleep causes better grades? Or maybe students who manage their time well both sleep more and study smarter — the headline never says which.',
  options: [
    {
      id: '1',
      label: 'Direct Causation: Sleeping directly boosts brain power.',
      isCorrect: false,
      explanation: 'Over-simplifies the relation without controlling for confounding variables.',
    },
    {
      id: '2',
      label: 'Confounding Variable: Good time management drives both sleep and grades.',
      isCorrect: true,
      explanation: 'Correct! Time management acts as a third factor influencing both outcomes.',
    },
    {
      id: '3',
      label: 'Reverse Causality: Better grades make students feel relaxed enough to sleep.',
      isCorrect: false,
      explanation: 'Possible, but confounding behavior is the primary analytical flaw highlighted here.',
    },
  ],
  verdictSummary: 'Correlation does not imply causation. Third variables like time management often explain parallel positive outcomes.',
};

export default function CausalCourtScreen() {
  const [stage, setStage] = useState<GameStage>('LANDING');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (id: string) => {
    setSelectedOption(id);
  };

  const resetGame = () => {
    setStage('LANDING');
    setSelectedOption(null);
  };

  // -------------------------------------------------------------
  // STAGE 0: LANDING
  // -------------------------------------------------------------
  if (stage === 'LANDING') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Top Bar Navigation */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.topBtn}>
              <Text style={styles.topBtnText}>← BACK</Text>
            </TouchableOpacity>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>MODULE 05</Text>
            </View>
          </View>

          {/* Title Banner */}
          <View style={styles.titleBanner}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>🙂</Text>
            </View>
            <Text style={styles.titleText}>CAUSAL COURT</Text>
            <Text style={styles.subtitleText}>CORRELATION VS. CAUSATION DETECTOR</Text>
          </View>

          {/* System Prompt Card */}
          <View style={styles.creamCard}>
            <Text style={styles.quoteText}>
              "{MOCK_CASE.headline}"
            </Text>
            <Text style={styles.bodyText}>
              🧐 {MOCK_CASE.premise}
            </Text>
            <Text style={styles.bodyHighlight}>
              Let's engage critically. Flex your causation skills. 🧠⚖️
            </Text>
          </View>

          {/* Landing Footer / Action Header */}
          <View style={styles.centerPrompt}>
            <Text style={styles.promptTitle}>Ready to take the bench?</Text>
            <Text style={styles.promptSub}>Here's your first case.</Text>
          </View>

          {/* Primary Action Button */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => setStage('CASE_PRESENTATION')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryBtnText}>ENTER THE COURT ⚖️</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    );
  }

  // -------------------------------------------------------------
  // STAGE 1: CASE PRESENTATION
  // -------------------------------------------------------------
  if (stage === 'CASE_PRESENTATION') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => setStage('LANDING')} style={styles.topBtn}>
              <Text style={styles.topBtnText}>← BACK</Text>
            </TouchableOpacity>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>CASE #101</Text>
            </View>
          </View>

          <View style={styles.titleBanner}>
            <Text style={styles.titleText}>THE EVIDENCE</Text>
            <Text style={styles.subtitleText}>EXAMINE THE CLAIM</Text>
          </View>

          <View style={styles.creamCard}>
            <Text style={styles.cardHeaderLabel}>► EXHIBIT A: HEADLINE</Text>
            <Text style={styles.quoteText}>{MOCK_CASE.headline}</Text>
          </View>

          <View style={styles.missionCard}>
            <Text style={styles.missionTitle}>[ COURT MANDATE ]</Text>
            <Text style={styles.missionItem}>■ Separate logical jump from underlying data</Text>
            <Text style={styles.missionItem}>■ Identify potential confounding factors</Text>
            <Text style={styles.missionItem}>■ Deliver an evidence-backed ruling</Text>
          </View>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => setStage('ANALYSIS')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryBtnText}>DELIBERATE CASE 🔍</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    );
  }

  // -------------------------------------------------------------
  // STAGE 2: ANALYSIS
  // -------------------------------------------------------------
  if (stage === 'ANALYSIS') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => setStage('CASE_PRESENTATION')} style={styles.topBtn}>
              <Text style={styles.topBtnText}>← EVIDENCE</Text>
            </TouchableOpacity>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>DELIBERATION</Text>
            </View>
          </View>

          <View style={styles.titleBanner}>
            <Text style={styles.titleText}>CHOOSE RULING</Text>
            <Text style={styles.subtitleText}>WHAT BEST EXPLAINS THIS CORRELATION?</Text>
          </View>

          <View style={styles.optionsContainer}>
            {MOCK_CASE.options.map((option) => {
              const isSelected = selectedOption === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                  onPress={() => handleOptionSelect(option.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, !selectedOption && styles.btnDisabled]}
            disabled={!selectedOption}
            onPress={() => setStage('VERDICT')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryBtnText}>
              {selectedOption ? 'SUBMIT VERDICT 🔨' : 'SELECT AN ARGUMENT'}
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    );
  }

  // -------------------------------------------------------------
  // STAGE 3: VERDICT
  // -------------------------------------------------------------
  const chosenOption = MOCK_CASE.options.find((opt) => opt.id === selectedOption);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setStage('ANALYSIS')} style={styles.topBtn}>
            <Text style={styles.topBtnText}>← OPTIONS</Text>
          </TouchableOpacity>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>RULING</Text>
          </View>
        </View>

        <View style={styles.titleBanner}>
          <Text style={styles.titleText}>COURT VERDICT</Text>
          <Text style={styles.subtitleText}>ANALYSIS OVERVIEW</Text>
        </View>

        <View style={styles.creamCard}>
          <Text style={styles.cardHeaderLabel}>
            {chosenOption?.isCorrect ? '► RULING SUSTAINED' : '► RULING OVERRULED'}
          </Text>
          <Text style={styles.quoteText}>{chosenOption?.label}</Text>
          <Text style={[styles.bodyText, { marginTop: 12 }]}>
            {chosenOption?.explanation}
          </Text>
        </View>

        <View style={styles.missionCard}>
          <Text style={styles.missionTitle}>[ BENCH SUMMARY ]</Text>
          <Text style={styles.missionItem}>■ {MOCK_CASE.verdictSummary}</Text>
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={resetGame}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryBtnText}>NEXT CASE 🔄</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3A29', // Dark Olive Green match
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  topBtn: {
    backgroundColor: '#122217',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#2D4B37',
    borderRadius: 20,
  },
  topBtnText: {
    color: '#EFE3C3',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  badge: {
    backgroundColor: '#D0A361',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  badgeText: {
    color: '#1E3A29',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  titleBanner: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFE3C3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: '#3C4E42',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#EFE3C3',
    letterSpacing: 1,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8A9E90',
    letterSpacing: 1,
    marginTop: 2,
    textAlign: 'center',
  },

  /* --- CREAM CARD --- */
  creamCard: {
    backgroundColor: '#F3EDDA',
    padding: 20,
    marginBottom: 16,
    borderRadius: 20,
  },
  cardHeaderLabel: {
    color: '#8B5B28',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
  },
  quoteText: {
    color: '#1E3A29',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 26,
    marginBottom: 12,
  },
  bodyHighlight: {
    color: '#1E3A29',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
    marginTop: 6,
  },
  bodyText: {
    color: '#3C4E42',
    fontSize: 13.5,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 8,
  },

  /* --- MISSION CARD --- */
  missionCard: {
    backgroundColor: '#122217',
    borderWidth: 1.5,
    borderColor: '#2D4B37',
    padding: 20,
    marginBottom: 20,
    borderRadius: 20,
  },
  missionTitle: {
    color: '#D0A361',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 10,
  },
  missionItem: {
    color: '#8A9E90',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 22,
  },

  /* --- FOOTER PROMPT --- */
  centerPrompt: {
    alignItems: 'center',
    marginVertical: 10,
  },
  promptTitle: {
    color: '#EFE3C3',
    fontSize: 16,
    fontWeight: '900',
  },
  promptSub: {
    color: '#8A9E90',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },

  /* --- OPTIONS STYLING --- */
  optionsContainer: {
    marginBottom: 16,
  },
  optionCard: {
    backgroundColor: '#F3EDDA',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    backgroundColor: '#D0A361',
    borderColor: '#8B5B28',
  },
  optionText: {
    color: '#1E3A29',
    fontSize: 13.5,
    fontWeight: '700',
    lineHeight: 20,
  },
  optionTextSelected: {
    color: '#1E3A29',
    fontWeight: '900',
  },

  /* --- PRIMARY BUTTON --- */
  primaryBtn: {
    backgroundColor: '#D0A361',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    marginTop: 4,
  },
  btnDisabled: {
    backgroundColor: '#3C4E42',
    opacity: 0.6,
  },
  primaryBtnText: {
    color: '#1E3A29',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});