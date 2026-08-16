import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  causalCourtCases,
  type Verdict,
} from '@/data/causalCourtCases';

const COLORS = {
  forest: '#294C35',
  forestDark: '#1E3526',

  ink: '#171B18',

  parchment: '#E8DCC2',
  parchmentLight: '#EEEADF',
  parchmentShadow: '#8D8A82',

  walnut: '#704A35',
  oak: '#A8754F',

  gold: '#C6A65B',

  trueGreen: '#9FB99A',
  falseRed: '#C58F82',
  unsureBlue: '#A8B7C4',

  white: '#F4EBDD',
};

const VERDICT_OPTIONS: {
  value: Verdict;
  label: string;
  description: string;
}[] = [
  {
    value: 'true',
    label: 'TRUE',
    description: 'The evidence supports the causal claim.',
  },
  {
    value: 'false',
    label: 'FALSE',
    description: 'The evidence gives us good reason to reject the claim.',
  },
  {
    value: 'not-enough',
    label: 'NOT ENOUGH EVIDENCE',
    description: 'The evidence does not establish causation either way.',
  },
];

export default function CausalCourtVerdictScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const caseIndex = Number(params.caseIndex ?? 0);

  const caseData =
    causalCourtCases[caseIndex] ?? causalCourtCases[0];

  const [selectedVerdict, setSelectedVerdict] =
    useState<Verdict | null>(null);

  const [submitted, setSubmitted] = useState(false);

  const isCorrect =
    selectedVerdict === caseData.correctVerdict;

  const nextCaseIndex = caseIndex + 1;

  const submitVerdict = () => {
    if (!selectedVerdict) {
      return;
    }

    setSubmitted(true);
  };

  const goToNextCase = () => {
    if (nextCaseIndex < causalCourtCases.length) {
      router.replace({
        pathname: '/games/causal-court-verdict',
        params: {
          caseIndex: String(nextCaseIndex),
        },
      });
    } else {
      router.replace('/games');
    }
  };

  return (
    <View style={styles.container}>
      {/* ==========================================
          BACKGROUND COURTROOM
      ========================================== */}

      <View style={styles.backgroundScene}>
        <View style={styles.wall} />

        <View style={styles.wallPanelLeft} />
        <View style={styles.wallPanelRight} />

        <View style={styles.window}>
          <View style={styles.windowVertical} />
          <View style={styles.windowHorizontal} />
        </View>

        <View style={styles.bench}>
          <View style={styles.benchTop} />
          <View style={styles.benchBody} />
        </View>

        <View style={styles.floor} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ==========================================
            HEADER
        ========================================== */}

        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              CAUSAL COURT
            </Text>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      ((caseIndex + 1) /
                        causalCourtCases.length) *
                      100
                    }%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.progressText}>
              CASE {String(caseIndex + 1).padStart(2, '0')} OF{' '}
              {String(causalCourtCases.length).padStart(2, '0')}
            </Text>
          </View>

          <View style={styles.xpPill}>
            <Text style={styles.xpText}>
              +{caseData.xp} XP
            </Text>
          </View>
        </View>

        {/* ==========================================
            VERDICT HEADER
        ========================================== */}

        <View style={styles.verdictHeader}>
          <Text style={styles.gavel}>⚖</Text>

          <Text style={styles.verdictTitle}>
            YOUR VERDICT
          </Text>

          <Text style={styles.verdictSubtitle}>
            The court is ready for your judgment.
          </Text>
        </View>

        {/* ==========================================
            CLAIM
        ========================================== */}

        <View style={styles.claimCard}>
          <Text style={styles.sectionLabel}>
            THE CLAIM
          </Text>

          <Text style={styles.claimText}>
            “{caseData.claim}”
          </Text>
        </View>

        {/* ==========================================
            QUESTION
        ========================================== */}

        {!submitted && (
          <View style={styles.questionBlock}>
            <Text style={styles.questionText}>
              Does the evidence actually show that
              this causes that?
            </Text>

            <Text style={styles.questionHint}>
              Choose carefully. The headline may not tell
              the whole story.
            </Text>
          </View>
        )}

        {/* ==========================================
            VERDICT OPTIONS
        ========================================== */}

        <View style={styles.options}>
          {VERDICT_OPTIONS.map((option) => {
            const isSelected =
              selectedVerdict === option.value;

            const isCorrectOption =
              submitted &&
              option.value === caseData.correctVerdict;

            const isWrongSelection =
              submitted &&
              isSelected &&
              !isCorrect;

            return (
              <Pressable
                key={option.value}
                disabled={submitted}
                onPress={() =>
                  setSelectedVerdict(option.value)
                }
                style={({ pressed }) => [
                  styles.verdictOption,

                  option.value === 'true' &&
                    styles.trueOption,

                  option.value === 'false' &&
                    styles.falseOption,

                  option.value === 'not-enough' &&
                    styles.unsureOption,

                  isSelected &&
                    !submitted &&
                    styles.selectedOption,

                  isCorrectOption &&
                    styles.correctOption,

                  isWrongSelection &&
                    styles.wrongOption,

                  pressed &&
                    !submitted &&
                    styles.buttonPressed,
                ]}
              >
                <View style={styles.optionLeft}>
                  <View
                    style={[
                      styles.radio,
                      isSelected &&
                        styles.radioSelected,
                    ]}
                  >
                    {isSelected && (
                      <View style={styles.radioDot} />
                    )}
                  </View>

                  <View style={styles.optionText}>
                    <Text style={styles.optionLabel}>
                      {option.label}
                    </Text>

                    {!submitted && (
                      <Text style={styles.optionDescription}>
                        {option.description}
                      </Text>
                    )}
                  </View>
                </View>

                {submitted && isCorrectOption && (
                  <Text style={styles.resultIcon}>
                    ✓
                  </Text>
                )}

                {submitted &&
                  isWrongSelection && (
                    <Text style={styles.resultIcon}>
                      ✕
                    </Text>
                  )}
              </Pressable>
            );
          })}
        </View>

        {/* ==========================================
            SUBMIT
        ========================================== */}

        {!submitted && (
          <Pressable
            disabled={!selectedVerdict}
            onPress={submitVerdict}
            style={({ pressed }) => [
              styles.submitButton,

              !selectedVerdict &&
                styles.submitButtonDisabled,

              pressed &&
                selectedVerdict &&
                styles.buttonPressed,
            ]}
          >
            <Text style={styles.submitText}>
              DELIVER VERDICT
            </Text>

            <Text style={styles.submitIcon}>
              ⚖
            </Text>
          </Pressable>
        )}

        {/* ==========================================
            RESULT
        ========================================== */}

        {submitted && (
          <View
            style={[
              styles.resultCard,
              isCorrect
                ? styles.resultCorrect
                : styles.resultIncorrect,
            ]}
          >
            <View style={styles.resultHeader}>
              <Text style={styles.resultEmoji}>
                {isCorrect ? '✓' : '✕'}
              </Text>

              <View style={styles.resultHeaderText}>
                <Text style={styles.resultTitle}>
                  {isCorrect
                    ? 'GOOD CALL, JUDGE.'
                    : 'NOT QUITE.'}
                </Text>

                <Text style={styles.resultVerdict}>
                  Correct verdict:{' '}
                  {caseData.correctVerdict === 'not-enough'
                    ? 'NOT ENOUGH EVIDENCE'
                    : caseData.correctVerdict.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.explanationLabel}>
              WHY?
            </Text>

            <Text style={styles.explanationText}>
              {caseData.explanation}
            </Text>

            <View style={styles.skillBox}>
              <Text style={styles.skillLabel}>
                SKILL LEARNED
              </Text>

              <Text style={styles.skillText}>
                {caseData.concept}
              </Text>
            </View>

            <View style={styles.questionBox}>
              <Text style={styles.questionBoxLabel}>
                ASK YOURSELF
              </Text>

              <Text style={styles.questionBoxText}>
                {caseData.keyQuestion}
              </Text>
            </View>
          </View>
        )}

        {/* ==========================================
            NEXT CASE
        ========================================== */}

        {submitted && (
          <Pressable
            onPress={goToNextCase}
            style={({ pressed }) => [
              styles.nextButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.nextButtonText}>
              {nextCaseIndex <
              causalCourtCases.length
                ? `CASE ${String(
                    nextCaseIndex + 1
                  ).padStart(2, '0')} →`
                : 'FINISH COURT'}
            </Text>

            <Text style={styles.nextIcon}>
              ⚖
            </Text>
          </Pressable>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ==========================================
          MASCOT
      ========================================== */}

      <View style={styles.mascot}>
        <Text style={styles.mascotFace}>
          •ᴗ•
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.forest,
  },

  backgroundScene: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },

  wall: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.forest,
  },

  wallPanelLeft: {
    position: 'absolute',
    top: 100,
    left: -30,
    width: 145,
    height: 230,
    backgroundColor: COLORS.forestDark,
    borderRightWidth: 4,
    borderColor: COLORS.walnut,
  },

  wallPanelRight: {
    position: 'absolute',
    top: 100,
    right: -30,
    width: 145,
    height: 230,
    backgroundColor: COLORS.forestDark,
    borderLeftWidth: 4,
    borderColor: COLORS.walnut,
  },

  window: {
    position: 'absolute',
    top: 95,
    left: '50%',
    marginLeft: -40,
    width: 80,
    height: 105,
    backgroundColor: '#657A68',
    borderWidth: 4,
    borderColor: COLORS.walnut,
  },

  windowVertical: {
    position: 'absolute',
    left: 36,
    top: 0,
    width: 5,
    height: '100%',
    backgroundColor: COLORS.walnut,
  },

  windowHorizontal: {
    position: 'absolute',
    top: 48,
    left: 0,
    width: '100%',
    height: 5,
    backgroundColor: COLORS.walnut,
  },

  bench: {
    position: 'absolute',
    top: 265,
    left: 25,
    right: 25,
    height: 85,
  },

  benchTop: {
    height: 14,
    backgroundColor: COLORS.oak,
    borderWidth: 3,
    borderColor: COLORS.ink,
  },

  benchBody: {
    flex: 1,
    backgroundColor: COLORS.walnut,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.ink,
  },

  floor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: COLORS.walnut,
    borderTopWidth: 4,
    borderColor: COLORS.ink,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 70,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.parchment,
    borderWidth: 2,
    borderColor: COLORS.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backText: {
    fontSize: 30,
    color: COLORS.ink,
    marginTop: -4,
  },

  buttonPressed: {
    transform: [
      {
        translateY: 3,
      },
    ],
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 9,
  },

  headerTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 1,
  },

  progressTrack: {
    width: '80%',
    height: 8,
    marginTop: 6,
    backgroundColor: COLORS.forestDark,
    borderWidth: 2,
    borderColor: COLORS.ink,
  },

  progressFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
  },

  progressText: {
    marginTop: 4,
    fontSize: 8,
    fontWeight: '900',
    color: COLORS.parchment,
  },

  xpPill: {
    height: 30,
    paddingHorizontal: 9,
    borderRadius: 15,
    backgroundColor: COLORS.gold,
    borderWidth: 2,
    borderColor: COLORS.ink,
    justifyContent: 'center',
  },

  xpText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.ink,
  },

  verdictHeader: {
    alignItems: 'center',
    marginBottom: 18,
  },

  gavel: {
    fontSize: 30,
    color: COLORS.gold,
    marginBottom: 3,
  },

  verdictTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 1,
  },

  verdictSubtitle: {
    marginTop: 5,
    fontSize: 10,
    color: COLORS.parchment,
    textAlign: 'center',
  },

  claimCard: {
    backgroundColor: COLORS.parchment,
    borderWidth: 3,
    borderColor: COLORS.ink,
    padding: 17,
    marginBottom: 17,

    shadowColor: COLORS.parchmentShadow,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },

  sectionLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.walnut,
    letterSpacing: 1,
    marginBottom: 7,
  },

  claimText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '900',
    color: COLORS.ink,
  },

  questionBlock: {
    marginBottom: 15,
  },

  questionText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '900',
    color: COLORS.white,
    textAlign: 'center',
  },

  questionHint: {
    marginTop: 5,
    fontSize: 9,
    lineHeight: 14,
    color: COLORS.parchment,
    textAlign: 'center',
  },

  options: {
    gap: 11,
  },

  verdictOption: {
    minHeight: 67,
    borderRadius: 33,
    borderWidth: 3,
    borderColor: COLORS.ink,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: COLORS.parchmentShadow,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },

  trueOption: {
    backgroundColor: COLORS.trueGreen,
  },

  falseOption: {
    backgroundColor: COLORS.falseRed,
  },

  unsureOption: {
    backgroundColor: COLORS.unsureBlue,
  },

  selectedOption: {
    borderWidth: 4,
    transform: [
      {
        scale: 1.015,
      },
    ],
  },

  correctOption: {
    borderWidth: 4,
    borderColor: COLORS.gold,
  },

  wrongOption: {
    opacity: 0.55,
  },

  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  radio: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: COLORS.parchment,
    borderWidth: 2,
    borderColor: COLORS.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  radioSelected: {
    backgroundColor: COLORS.white,
  },

  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: COLORS.ink,
  },

  optionText: {
    flex: 1,
  },

  optionLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.ink,
    letterSpacing: 0.4,
  },

  optionDescription: {
    marginTop: 3,
    fontSize: 8,
    lineHeight: 12,
    color: COLORS.ink,
    opacity: 0.75,
  },

  resultIcon: {
    fontSize: 23,
    fontWeight: '900',
    color: COLORS.ink,
    marginLeft: 8,
  },

  submitButton: {
    width: '100%',
    height: 57,
    marginTop: 19,
    borderRadius: 29,
    borderWidth: 3,
    borderColor: COLORS.ink,
    backgroundColor: COLORS.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.walnut,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },

  submitButtonDisabled: {
    backgroundColor: COLORS.parchmentShadow,
    opacity: 0.7,
  },

  submitText: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.ink,
  },

  submitIcon: {
    marginLeft: 10,
    fontSize: 18,
    color: COLORS.walnut,
  },

  resultCard: {
    marginTop: 18,
    padding: 17,
    borderWidth: 3,
    borderColor: COLORS.ink,
    shadowColor: COLORS.parchmentShadow,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },

  resultCorrect: {
    backgroundColor: COLORS.trueGreen,
  },

  resultIncorrect: {
    backgroundColor: COLORS.parchment,
  },

  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  resultEmoji: {
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: COLORS.parchment,
    borderWidth: 2,
    borderColor: COLORS.ink,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.ink,
    marginRight: 11,
  },

  resultHeaderText: {
    flex: 1,
  },

  resultTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.ink,
  },

  resultVerdict: {
    marginTop: 4,
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.walnut,
  },

  divider: {
    height: 2,
    backgroundColor: COLORS.parchmentShadow,
    marginVertical: 14,
  },

  explanationLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.walnut,
    letterSpacing: 1,
  },

  explanationText: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 18,
    color: COLORS.ink,
    fontWeight: '600',
  },

  skillBox: {
    marginTop: 14,
    padding: 11,
    backgroundColor: COLORS.parchment,
    borderWidth: 2,
    borderColor: COLORS.ink,
  },

  skillLabel: {
    fontSize: 8,
    fontWeight: '900',
    color: COLORS.walnut,
  },

  skillText: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.ink,
  },

  questionBox: {
    marginTop: 10,
    padding: 11,
    backgroundColor: COLORS.parchmentLight,
    borderWidth: 2,
    borderColor: COLORS.ink,
  },

  questionBoxLabel: {
    fontSize: 8,
    fontWeight: '900',
    color: COLORS.walnut,
  },

  questionBoxText: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '700',
    color: COLORS.ink,
  },

  nextButton: {
    width: '100%',
    height: 57,
    marginTop: 16,
    borderRadius: 29,
    borderWidth: 3,
    borderColor: COLORS.ink,
    backgroundColor: COLORS.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.walnut,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },

  nextButtonText: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.ink,
  },

  nextIcon: {
    marginLeft: 10,
    fontSize: 17,
    color: COLORS.walnut,
  },

  mascot: {
    position: 'absolute',
    right: 12,
    bottom: 15,
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: COLORS.parchment,
    borderWidth: 2,
    borderColor: COLORS.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mascotFace: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.ink,
  },
});