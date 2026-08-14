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

interface CausalCase {
  id: string;
  dossierNumber: string;
  claim: string;
  correlationData: string;
  confoundingVariable: string;
  isTrueCausation: boolean;
  verdictAnalysis: string;
}

const CASES: CausalCase[] = [
  {
    id: '1',
    dossierNumber: 'CASE FILE 0104-A',
    claim: 'Ice cream consumption directly causes higher rates of sunburns during summer months.',
    correlationData: 'Data shows a strong +0.89 correlation between weekly ice cream sales and hospital cases of sunburn.',
    confoundingVariable: 'CONFOUNDING FACTOR: Sunlight Exposure & Temperature',
    isTrueCausation: false,
    verdictAnalysis: 'FALSE CAUSATION. Both variables increase due to warmer summer weather and longer sun exposure, not because ice cream causes sunburns.',
  },
  {
    id: '2',
    dossierNumber: 'CASE FILE 0104-B',
    claim: 'Targeted antibiotic treatment eradicates bacterial infection in clinical trials.',
    correlationData: 'Patients receiving targeted antibiotics showed a 94% reduction in bacterial load within 48 hours compared to placebos.',
    confoundingVariable: 'CONTROLLED VARIABLE: Controlled Clinical Environment',
    isTrueCausation: true,
    verdictAnalysis: 'TRUE CAUSATION. Controlled double-blind trials directly isolated the biochemical mechanism behind bacterial suppression.',
  },
];

export default function CausalCourtScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userVerdict, setUserVerdict] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const currentCase = CASES[currentIndex];

  const handleVerdict = (verdict: boolean) => {
    if (userVerdict !== null) return;
    setUserVerdict(verdict);
    setShowAnalysis(true);
    if (verdict === currentCase.isTrueCausation) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < CASES.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setUserVerdict(null);
      setShowAnalysis(false);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Top Nav */}
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← BACK</Text>
          </TouchableOpacity>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>VERDICTS: {score}/{CASES.length}</Text>
          </View>
        </View>

        {/* Dossier Tag */}
        <View style={styles.dossierBadge}>
          <Text style={styles.dossierText}>{currentCase.dossierNumber}</Text>
        </View>

        <Text style={styles.title}>Causal Court</Text>
        <Text style={styles.instruction}>
          Examine the evidence dossier and judge if the claim proves direct causation or false correlation.
        </Text>

        {/* Dossier Card */}
        <View style={styles.dossierCard}>
          <Text style={styles.sectionLabel}>CLAIMED RELATIONSHIP</Text>
          <Text style={styles.claimText}>"{currentCase.claim}"</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>CORRELATION DATA</Text>
          <Text style={styles.dataText}>{currentCase.correlationData}</Text>

          <View style={styles.confoundingTag}>
            <Text style={styles.confoundingText}>{currentCase.confoundingVariable}</Text>
          </View>
        </View>

        {/* Decision Actions */}
        {userVerdict === null && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.verdictBtn, styles.correlationBtn]}
              onPress={() => handleVerdict(false)}
            >
              <Text style={styles.verdictBtnText}>FALSE CORRELATION</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.verdictBtn, styles.causationBtn]}
              onPress={() => handleVerdict(true)}
            >
              <Text style={styles.verdictBtnText}>PROVEN CAUSATION</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Court Analysis Modal Box */}
        {showAnalysis && (
          <View style={styles.analysisBox}>
            <View
              style={[
                styles.verdictBadge,
                {
                  backgroundColor:
                    userVerdict === currentCase.isTrueCausation
                      ? '#10B98120'
                      : '#EF444420',
                  borderColor:
                    userVerdict === currentCase.isTrueCausation
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
                      userVerdict === currentCase.isTrueCausation
                        ? '#10B981'
                        : '#EF4444',
                  },
                ]}
              >
                {userVerdict === currentCase.isTrueCausation
                  ? 'JUDGMENT ACCURATE'
                  : 'JUDGMENT OVERRULED'}
              </Text>
            </View>

            <Text style={styles.analysisTitle}>JUDICIAL ANALYSIS</Text>
            <Text style={styles.analysisBody}>{currentCase.verdictAnalysis}</Text>

            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextBtnText}>
                {currentIndex < CASES.length - 1 ? 'NEXT CASE DOSSIER →' : 'CLOSE COURT SESSION'}
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
    backgroundColor: '#F59E0B20',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F59E0B40',
  },
  scoreText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dossierBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  dossierText: {
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
  dossierCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F59E0B40',
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1,
    marginBottom: 6,
  },
  claimText: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 14,
  },
  dataText: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  confoundingTag: {
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  confoundingText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  verdictBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  correlationBtn: {
    backgroundColor: '#EF4444',
  },
  causationBtn: {
    backgroundColor: '#10B981',
  },
  verdictBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  analysisBox: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
  },
  verdictBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 12,
  },
  verdictBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  analysisTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  analysisBody: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  nextBtn: {
    backgroundColor: '#F59E0B',
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