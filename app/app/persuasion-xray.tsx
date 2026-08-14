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

interface ViralClaim {
  id: string;
  mediaType: string;
  headline: string;
  persuasionTechnique: string;
  options: {
    id: string;
    label: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

const CLAIMS: ViralClaim[] = [
  {
    id: '1',
    mediaType: 'VIRAL SOCIAL POST',
    headline: 'ACT NOW: Stock supplies immediately before government restrictions lock down supplies at midnight!',
    persuasionTechnique: 'MANUFACTURED URGENCY',
    options: [
      {
        id: 'opt1',
        label: 'Manufactured Urgency & Panic Induction',
        isCorrect: true,
      },
      {
        id: 'opt2',
        label: 'Bandwagon Effect & Peer Approval',
        isCorrect: false,
      },
      {
        id: 'opt3',
        label: 'False Authority Endorsement',
        isCorrect: false,
      },
    ],
    explanation: 'The headline uses artificial deadlines ("ACT NOW", "at midnight") to trigger fear-driven panic buying before critical thinking can occur.',
  },
  {
    id: '2',
    mediaType: 'SPONSORED EDITORIAL',
    headline: 'Over 90% of top tech executives secretly use this productivity framework to stay ahead.',
    persuasionTechnique: 'BANDWAGON & FOMO',
    options: [
      {
        id: 'opt1',
        label: 'Statistical Distortion',
        isCorrect: false,
      },
      {
        id: 'opt2',
        label: 'Bandwagon Effect & Fear of Missing Out (FOMO)',
        isCorrect: true,
      },
      {
        id: 'opt3',
        label: 'False Dichotomy Framing',
        isCorrect: false,
      },
    ],
    explanation: 'This claim leverages social proof and insider secrecy ("90% of top executives secretly use") to convince readers that everyone in power knows something they do not.',
  },
];

export default function PersuasionXrayScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentClaim = CLAIMS[currentIndex];

  const handleSelect = (optionId: string, isCorrect: boolean) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionId);
    setShowExplanation(true);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < CLAIMS.length - 1) {
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
        {/* Top Navigation */}
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← BACK</Text>
          </TouchableOpacity>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>SCANS: {score}/{CLAIMS.length}</Text>
          </View>
        </View>

        {/* Media Tag */}
        <View style={styles.mediaBadge}>
          <Text style={styles.mediaText}>{currentClaim.mediaType}</Text>
        </View>

        <Text style={styles.title}>Persuasion X-Ray</Text>
        <Text style={styles.instruction}>
          Scan the media headline and unmask the primary persuasion tactic being deployed.
        </Text>

        {/* Media Headline Card */}
        <View style={styles.headlineCard}>
          <Text style={styles.cardHeader}>VIRAL MEDIA SAMPLE</Text>
          <Text style={styles.headlineBody}>"{currentClaim.headline}"</Text>
        </View>

        {/* Tactic Options */}
        <Text style={styles.sectionHeader}>IDENTIFY MANIPULATION TACTIC</Text>
        {currentClaim.options.map((opt) => {
          const isSelected = selectedOption === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              style={[
                styles.optionCard,
                isSelected &&
                  (opt.isCorrect ? styles.correctCard : styles.incorrectCard),
              ]}
              onPress={() => handleSelect(opt.id, opt.isCorrect)}
              disabled={selectedOption !== null}
              activeOpacity={0.8}
            >
              <Text style={styles.optionText}>{opt.label}</Text>
            </TouchableOpacity>
          );
        })}

        {/* Analysis Modal Box */}
        {showExplanation && (
          <View style={styles.explanationBox}>
            <View style={styles.tacticTag}>
              <Text style={styles.tacticTagText}>{currentClaim.persuasionTechnique}</Text>
            </View>

            <Text style={styles.explanationTitle}>
              {selectedOption &&
              currentClaim.options.find((o) => o.id === selectedOption)?.isCorrect
                ? 'TACTIC UNMASKED'
                : 'TACTIC MISSED'}
            </Text>
            <Text style={styles.explanationBody}>{currentClaim.explanation}</Text>

            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextBtnText}>
                {currentIndex < CLAIMS.length - 1
                  ? 'SCAN NEXT MEDIA FILE →'
                  : 'FINISH MODULE'}
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
    backgroundColor: '#10B98120',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#10B98140',
  },
  scoreText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  mediaBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  mediaText: {
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
  headlineCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#10B98140',
  },
  cardHeader: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1,
    marginBottom: 8,
  },
  headlineBody: {
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
    borderColor: '#10B98140',
  },
  tacticTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#10B98120',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 10,
  },
  tacticTagText: {
    color: '#10B981',
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
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1,
  },
});