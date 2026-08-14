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

interface CaseStudy {
  id: string;
  topic: string;
  headlineA: string;
  headlineB: string;
  biasType: string;
  explanation: string;
  correctAnswer: 'A' | 'B';
}

const CASES: CaseStudy[] = [
  {
    id: '1',
    topic: 'TECHNOLOGY & AUTOMATION',
    headlineA: 'AI Breakthrough Promises Massive Boost to Global Economic Productivity',
    headlineB: 'Disruptive AI Automation Threatens Millions of Traditional Jobs Worldwide',
    biasType: 'SENSATIONALISM VS OPTIMISM',
    explanation: 'Headline B framing focuses heavily on economic anxiety and fear triggers, while Headline A emphasizes growth metrics.',
    correctAnswer: 'B',
  },
  {
    id: '2',
    topic: 'PUBLIC HEALTH DATA',
    headlineA: 'New Dietary Guidelines Recommended by Leading National Researchers',
    headlineB: 'Experts Warn Popular Diet Could Secretly Increase Long-Term Health Risks',
    biasType: 'FEAR-BASED FRAMING',
    explanation: 'Headline B uses alarmist language ("Secretly Increase Risks") designed to provoke immediate user panic.',
    correctAnswer: 'B',
  },
];

export default function BiasMirrorScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentCase = CASES[currentIndex];

  const handleSelect = (option: 'A' | 'B') => {
    if (selectedOption) return; // Prevent re-selection
    setSelectedOption(option);
    setShowExplanation(true);
    if (option === currentCase.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < CASES.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← BACK</Text>
          </TouchableOpacity>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>SCORE: {score}/{CASES.length}</Text>
          </View>
        </View>

        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{currentCase.topic}</Text>
        </View>

        <Text style={styles.title}>Bias Mirror</Text>
        <Text style={styles.instruction}>
          Identify which headline uses manipulative framing to trigger emotional confirmation bias.
        </Text>

        {/* Headline A */}
        <TouchableOpacity
          style={[
            styles.optionCard,
            selectedOption === 'A' &&
              (currentCase.correctAnswer === 'A'
                ? styles.correctCard
                : styles.incorrectCard),
          ]}
          onPress={() => handleSelect('A')}
          disabled={selectedOption !== null}
          activeOpacity={0.8}
        >
          <Text style={styles.optionLabel}>OPTION A</Text>
          <Text style={styles.headlineText}>"{currentCase.headlineA}"</Text>
        </TouchableOpacity>

        {/* Headline B */}
        <TouchableOpacity
          style={[
            styles.optionCard,
            selectedOption === 'B' &&
              (currentCase.correctAnswer === 'B'
                ? styles.correctCard
                : styles.incorrectCard),
          ]}
          onPress={() => handleSelect('B')}
          disabled={selectedOption !== null}
          activeOpacity={0.8}
        >
          <Text style={styles.optionLabel}>OPTION B</Text>
          <Text style={styles.headlineText}>"{currentCase.headlineB}"</Text>
        </TouchableOpacity>

        {/* Explanation Card */}
        {showExplanation && (
          <View style={styles.explanationBox}>
            <View style={styles.biasTag}>
              <Text style={styles.biasTagText}>{currentCase.biasType}</Text>
            </View>
            <Text style={styles.explanationTitle}>
              {selectedOption === currentCase.correctAnswer
                ? 'VERDICT CORRECT'
                : 'ANALYSIS MISSED'}
            </Text>
            <Text style={styles.explanationBody}>{currentCase.explanation}</Text>

            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextBtnText}>
                {currentIndex < CASES.length - 1 ? 'NEXT SCENARIO →' : 'FINISH MODULE'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#1E293B',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  backBtnText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scoreBadge: {
    backgroundColor: '#8B5CF620',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#8B5CF640',
  },
  scoreText: {
    color: '#8B5CF6',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  categoryText: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  instruction: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 24,
  },
  optionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  correctCard: {
    borderColor: '#10B981',
    backgroundColor: '#10B98110',
  },
  incorrectCard: {
    borderColor: '#EF4444',
    backgroundColor: '#EF444410',
  },
  optionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1,
    marginBottom: 8,
  },
  headlineText: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  explanationBox: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 18,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#8B5CF640',
  },
  biasTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#8B5CF620',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 10,
  },
  biasTagText: {
    color: '#8B5CF6',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  explanationTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  explanationBody: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  nextBtn: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1,
  },
})