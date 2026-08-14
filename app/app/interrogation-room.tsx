import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';

interface ClaimScenario {
  id: string;
  source: string;
  claim: string;
  options: {
    id: string;
    question: string;
    isCriticalFlaw: boolean;
  }[];
  explanation: string;
}

const SCENARIOS: ClaimScenario[] = [
  {
    id: '1',
    source: 'ANONYMOUS SOCIAL MEDIA POST',
    claim: 'A new miracle superfood cures 100% of seasonal allergies instantly with zero side effects.',
    options: [
      {
        id: 'opt1',
        question: 'Where is the peer-reviewed clinical data and sample size for this claim?',
        isCriticalFlaw: true,
      },
      {
        id: 'opt2',
        question: 'How much does this miracle superfood cost per bottle?',
        isCriticalFlaw: false,
      },
      {
        id: 'opt3',
        question: 'Which country produces this superfood plant?',
        isCriticalFlaw: false,
      },
    ],
    explanation: 'Extensive, absolute claims ("100% cures") require rigorous double-blind clinical trial verification rather than market availability or country of origin.',
  },
  {
    id: '2',
    source: 'TECH NEWS BLOG',
    claim: 'New smartphone battery tech lasts 30 days on a single charge according to internal company benchmarks.',
    options: [
      {
        id: 'opt1',
        question: 'What color options will the smartphone be released in?',
        isCriticalFlaw: false,
      },
      {
        id: 'opt2',
        question: 'Have independent third-party labs verified these battery test conditions?',
        isCriticalFlaw: true,
      },
      {
        id: 'opt3',
        question: 'Is the CEO well-known in the technology sector?',
        isCriticalFlaw: false,
      },
    ],
    explanation: 'Self-reported company benchmarks suffer from interest conflict. Independent verification is necessary to validate performance claims.',
  },
];

export default function InterrogationRoomScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timer, setTimer] = useState(20);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentScenario = SCENARIOS[currentIndex];

  useEffect(() => {
    let interval: any;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isTimerActive) {
      setIsTimerActive(false);
      setShowExplanation(true);
    }
    return () => clearInterval(interval);
  }, [timer, isTimerActive]);

  const handleSelect = (optionId: string, isCritical: boolean) => {
    if (selectedOption || !isTimerActive) return;
    setSelectedOption(optionId);
    setIsTimerActive(false);
    setShowExplanation(true);

    if (isCritical) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < SCENARIOS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setTimer(20);
      setIsTimerActive(true);
      setShowExplanation(false);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Top Navigation */}
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← BACK</Text>
          </TouchableOpacity>
          <View style={styles.timerBadge}>
            <Text style={styles.timerText}>COUNTDOWN: {timer}S</Text>
          </View>
        </View>

        {/* Source Badge */}
        <View style={styles.sourceBadge}>
          <Text style={styles.sourceText}>{currentScenario.source}</Text>
        </View>

        <Text style={styles.title}>Interrogation Room</Text>
        <Text style={styles.instruction}>
          Select the critical Socratic question that exposes the flaw in the claim before time expires.
        </Text>

        {/* Claim Display */}
        <View style={styles.claimCard}>
          <Text style={styles.claimHeader}>STATEMENT UNDER INVESTIGATION</Text>
          <Text style={styles.claimBody}>"{currentScenario.claim}"</Text>
        </View>

        {/* Interrogation Questions */}
        <Text style={styles.sectionHeader}>SELECT SOCRATIC INQUIRY</Text>
        {currentScenario.options.map((opt) => {
          const isSelected = selectedOption === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              style={[
                styles.optionCard,
                isSelected &&
                  (opt.isCriticalFlaw
                    ? styles.correctCard
                    : styles.incorrectCard),
              ]}
              onPress={() => handleSelect(opt.id, opt.isCriticalFlaw)}
              disabled={selectedOption !== null || !isTimerActive}
              activeOpacity={0.8}
            >
              <Text style={styles.optionText}>{opt.question}</Text>
            </TouchableOpacity>
          );
        })}

        {/* Analysis Modal Box */}
        {showExplanation && (
          <View style={styles.explanationBox}>
            <View
              style={[
                styles.verdictBadge,
                {
                  backgroundColor:
                    selectedOption &&
                    currentScenario.options.find((o) => o.id === selectedOption)
                      ?.isCriticalFlaw
                      ? '#10B98120'
                      : '#EF444420',
                  borderColor:
                    selectedOption &&
                    currentScenario.options.find((o) => o.id === selectedOption)
                      ?.isCriticalFlaw
                      ? '#10B981'
                      : '#EF4444',
                },
              ]}
            >
              <Text
                style={[
                  styles.verdictBadgeText,
                  {
                    color:
                      selectedOption &&
                      currentScenario.options.find((o) => o.id === selectedOption)
                        ?.isCriticalFlaw
                        ? '#10B981'
                        : '#EF4444',
                  },
                ]}
              >
                {selectedOption &&
                currentScenario.options.find((o) => o.id === selectedOption)
                  ?.isCriticalFlaw
                  ? 'CRITICAL FLAW EXPOSED'
                  : 'INQUIRY INSUFFICIENT'}
              </Text>
            </View>

            <Text style={styles.explanationTitle}>INVESTIGATION SUMMARY</Text>
            <Text style={styles.explanationBody}>{currentScenario.explanation}</Text>

            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextBtnText}>
                {currentIndex < SCENARIOS.length - 1
                  ? 'NEXT CASE FILE →'
                  : 'FINISH SESSION'}
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
  timerBadge: {
    backgroundColor: '#3B82F620',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3B82F640',
  },
  timerText: {
    color: '#3B82F6',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sourceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  sourceText: {
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
    marginBottom: 20,
  },
  claimCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#3B82F640',
  },
  claimHeader: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1,
    marginBottom: 8,
  },
  claimBody: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1,
    marginBottom: 12,
  },
  optionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
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
  optionText: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  explanationBox: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 18,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  verdictBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 10,
  },
  verdictBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  explanationTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  explanationBody: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  nextBtn: {
    backgroundColor: '#3B82F6',
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
});