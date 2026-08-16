import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {
  causalCourtCases,
  type CausalCourtCase,
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

  white: '#F4EBDD',
};

export default function CausalCourtScreen() {
  const router = useRouter();

const params = useLocalSearchParams();

const caseIndex = Number(params.caseIndex ?? 0);

const caseData: CausalCourtCase =
  causalCourtCases[caseIndex] ?? causalCourtCases[0];
  const [introVisible, setIntroVisible] = useState(true);
  const [evidenceExamined, setEvidenceExamined] =
    useState(false);

  const introOpacity = useSharedValue(1);
  const introY = useSharedValue(0);

  const caseOpacity = useSharedValue(0);
  const caseY = useSharedValue(25);

  useEffect(() => {
    if (!introVisible) {
      caseOpacity.value = withTiming(1, {
        duration: 450,
        easing: Easing.out(Easing.cubic),
      });

      caseY.value = withTiming(0, {
        duration: 450,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [introVisible]);

  const introStyle = useAnimatedStyle(() => ({
    opacity: introOpacity.value,
    transform: [
      {
        translateY: introY.value,
      },
    ],
  }));

  const caseStyle = useAnimatedStyle(() => ({
    opacity: caseOpacity.value,
    transform: [
      {
        translateY: caseY.value,
      },
    ],
  }));

  const enterCourt = () => {
    introOpacity.value = withTiming(0, {
      duration: 250,
    });

    introY.value = withTiming(-15, {
      duration: 250,
    });

    setTimeout(() => {
      setIntroVisible(false);
    }, 250);
  };

  const examineEvidence = () => {
    setEvidenceExamined(true);
  };

  return (
    <View style={styles.container}>
      {/* ==========================================
          COURTROOM BACKGROUND
      ========================================== */}

      <View style={styles.backgroundScene}>
        <View style={styles.wall} />

        <View style={styles.wallPanelLeft} />
        <View style={styles.wallPanelRight} />

        <View style={styles.window}>
          <View style={styles.windowCrossVertical} />
          <View style={styles.windowCrossHorizontal} />
        </View>

        <View style={styles.bench}>
          <View style={styles.benchTop} />
          <View style={styles.benchBody} />
        </View>

        <View style={styles.gavel}>
          <View style={styles.gavelHead} />
          <View style={styles.gavelHandle} />
        </View>

        <View style={styles.scales}>
          <View style={styles.scalePole} />
          <View style={styles.scaleBeam} />

          <View style={styles.scaleLeft} />
          <View style={styles.scaleRight} />
        </View>

        <View style={styles.floor} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ==========================================
            INTRO
        ========================================== */}

        {introVisible && (
          <Animated.View
            style={[
              styles.introScreen,
              introStyle,
            ]}
          >
            <View style={styles.mascotLarge}>
              <Text style={styles.mascotEyes}>
                •ᴗ•
              </Text>

              <Text style={styles.mascotBody}>
                ◡
              </Text>
            </View>

            <Text style={styles.gameTitle}>
              CAUSAL COURT
            </Text>

            <View style={styles.titleUnderline} />

            <View style={styles.hookCard}>
              <Text style={styles.hookText}>
                "Students who sleep more get better grades!" says the study.
              </Text>

              <Text style={styles.hookText}>
                😮 Whoa — so more sleep causes better grades?
              </Text>

              <Text style={styles.hookText}>
                Or maybe students who manage their time well both sleep more and study smarter —
                the headline never says which.
              </Text>

              <Text style={styles.hookText}>
                Let's engage critically. Flex your causation skills. 🧠⚖️
              </Text>
            </View>

            <Text style={styles.readyText}>
              Ready to take the bench?
            </Text>

            <Text style={styles.readySubtext}>
              Here's your first case.
            </Text>

            <Pressable
              onPress={enterCourt}
              style={({ pressed }) => [
                styles.enterButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.enterButtonText}>
                ENTER THE COURT
              </Text>

              <Text style={styles.enterIcon}>
                ⚖
              </Text>
            </Pressable>
          </Animated.View>
        )}

        {/* ==========================================
            CASE
        ========================================== */}

        {!introVisible && (
          <Animated.View
            style={[
              styles.caseScreen,
              caseStyle,
            ]}
          >
            {/* HEADER */}

            <View style={styles.header}>
              <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => [
                  styles.backButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.backText}>
                  ‹
                </Text>
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
                        width: `${100 / causalCourtCases.length}%`,
                      },
                    ]}
                  />
                </View>

                <Text style={styles.progressText}>
                  CASE 01 OF {String(causalCourtCases.length).padStart(2, '0')}
                </Text>
              </View>

              <View style={styles.xpPill}>
                <Text style={styles.xpText}>
                  +{caseData.xp} XP
                </Text>
              </View>
            </View>

            {/* CASE LABEL */}

            <View style={styles.caseStamp}>
              <Text style={styles.caseStampText}>
                CASE 01
              </Text>
            </View>

            {/* CLAIM */}

            <View style={styles.claimCard}>
              <Text style={styles.sectionLabel}>
                THE CLAIM
              </Text>

              <Text style={styles.claimText}>
                “{caseData.claim}”
              </Text>
            </View>

            {/* STUDY */}

            <View style={styles.studyCard}>
              <View style={styles.studyHeader}>
                <Text style={styles.sectionLabel}>
                  THE STUDY
                </Text>

                <Text style={styles.studySource}>
                  {caseData.evidence.source}
                </Text>
              </View>

              <Text style={styles.studyText}>
                {caseData.evidence.description}
              </Text>

              <View style={styles.metaRow}>
                <View>
                  <Text style={styles.metaLabel}>
                    TIMEFRAME
                  </Text>

                  <Text style={styles.metaValue}>
                    {caseData.evidence.period}
                  </Text>
                </View>

                <View>
                  <Text style={styles.metaLabel}>
                    SKILL
                  </Text>

                  <Text style={styles.metaValue}>
                    {caseData.concept}
                  </Text>
                </View>
              </View>
            </View>

            {/* EVIDENCE */}

            <Pressable
              onPress={examineEvidence}
              style={({ pressed }) => [
                styles.examineButton,
                evidenceExamined &&
                  styles.examineButtonDone,
                pressed && styles.buttonPressed,
              ]}
            >
              <View style={styles.examineIcon}>
                <Text style={styles.magnifyingGlass}>
                  {evidenceExamined ? '✓' : '⌕'}
                </Text>
              </View>

              <View style={styles.examineContent}>
                <Text style={styles.examineTitle}>
                  {evidenceExamined
                    ? 'EVIDENCE EXAMINED'
                    : 'EXAMINE THE EVIDENCE'}
                </Text>

                <Text style={styles.examineSubtitle}>
                  {evidenceExamined
                    ? 'Look closely before making your judgment.'
                    : 'What does the study actually show?'}
                </Text>
              </View>
            </Pressable>

            {evidenceExamined && (
              <View style={styles.observationCard}>
                <Text style={styles.observationLabel}>
                  WHAT DO YOU NOTICE?
                </Text>

                <Text style={styles.observationText}>
                  {caseData.observation}
                </Text>
              </View>
            )}

            {/* VERDICT CTA */}

            <View style={styles.verdictArea}>
              <Text style={styles.verdictQuestion}>
                Is the claim supported?
              </Text>

              <Text style={styles.verdictHint}>
                You will choose TRUE, FALSE, or NOT ENOUGH EVIDENCE.
              </Text>

              <Pressable
               disabled={!evidenceExamined}
onPress={() =>
  router.push({
    pathname: '/games/causal-court-verdict',
    params: {
      caseIndex: String(caseIndex),
    },
  })
}
                style={({ pressed }) => [
                  styles.verdictButton,
                  !evidenceExamined &&
                    styles.verdictButtonDisabled,
                  pressed &&
                    evidenceExamined &&
                    styles.buttonPressed,
                ]}
              >
                <Text style={styles.verdictButtonText}>
                  {evidenceExamined
                    ? 'MAKE YOUR VERDICT'
                    : 'EXAMINE EVIDENCE FIRST'}
                </Text>

                <Text style={styles.gavelIcon}>
                  {evidenceExamined ? '⚖' : '🔒'}
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* ==========================================
          SMALL MASCOT
      ========================================== */}

      {!introVisible && (
        <View style={styles.mascot}>
          <Text style={styles.mascotEyes}>
            •ᴗ•
          </Text>

          <Text style={styles.mascotBody}>
            ◡
          </Text>
        </View>
      )}
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
    top: 115,
    left: -25,
    width: 150,
    height: 230,
    backgroundColor: COLORS.forestDark,
    borderRightWidth: 4,
    borderColor: COLORS.walnut,
    transform: [
      {
        skewY: '-3deg',
      },
    ],
  },

  wallPanelRight: {
    position: 'absolute',
    top: 115,
    right: -25,
    width: 150,
    height: 230,
    backgroundColor: COLORS.forestDark,
    borderLeftWidth: 4,
    borderColor: COLORS.walnut,
    transform: [
      {
        skewY: '3deg',
      },
    ],
  },

  window: {
    position: 'absolute',
    top: 105,
    left: '50%',
    marginLeft: -42,
    width: 84,
    height: 110,
    backgroundColor: '#657A68',
    borderWidth: 4,
    borderColor: COLORS.walnut,
  },

  windowCrossVertical: {
    position: 'absolute',
    left: 37,
    top: 0,
    width: 5,
    height: '100%',
    backgroundColor: COLORS.walnut,
  },

  windowCrossHorizontal: {
    position: 'absolute',
    top: 50,
    left: 0,
    width: '100%',
    height: 5,
    backgroundColor: COLORS.walnut,
  },

  bench: {
    position: 'absolute',
    top: 270,
    left: 25,
    right: 25,
    height: 90,
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

  gavel: {
    position: 'absolute',
    top: 225,
    right: 62,
    width: 70,
    height: 55,
  },

  gavelHead: {
    position: 'absolute',
    top: 2,
    left: 3,
    width: 35,
    height: 16,
    backgroundColor: COLORS.oak,
    borderWidth: 3,
    borderColor: COLORS.ink,
  },

  gavelHandle: {
    position: 'absolute',
    top: 14,
    left: 29,
    width: 9,
    height: 40,
    backgroundColor: COLORS.walnut,
    borderWidth: 2,
    borderColor: COLORS.ink,
    transform: [
      {
        rotate: '18deg',
      },
    ],
  },

  scales: {
    position: 'absolute',
    top: 150,
    right: 40,
    width: 80,
    height: 75,
  },

  scalePole: {
    position: 'absolute',
    left: 38,
    top: 5,
    width: 5,
    height: 60,
    backgroundColor: COLORS.gold,
  },

  scaleBeam: {
    position: 'absolute',
    left: 10,
    top: 10,
    width: 60,
    height: 4,
    backgroundColor: COLORS.gold,
  },

  scaleLeft: {
    position: 'absolute',
    left: 3,
    top: 28,
    width: 25,
    height: 15,
    borderBottomWidth: 3,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: COLORS.gold,
  },

  scaleRight: {
    position: 'absolute',
    right: 3,
    top: 28,
    width: 25,
    height: 15,
    borderBottomWidth: 3,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: COLORS.gold,
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
    paddingBottom: 80,
  },

  /* INTRO */

  introScreen: {
    minHeight: 720,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
  },

  mascotLarge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.parchment,
    borderWidth: 3,
    borderColor: COLORS.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: COLORS.parchmentShadow,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },

  mascotEyes: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.ink,
  },

  mascotBody: {
    marginTop: -4,
    fontSize: 17,
    color: COLORS.walnut,
  },

  gameTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 1,
    textAlign: 'center',
  },

  titleUnderline: {
    width: 70,
    height: 4,
    backgroundColor: COLORS.gold,
    marginTop: 9,
    marginBottom: 22,
  },

  hookCard: {
    width: '100%',
    backgroundColor: COLORS.parchment,
    borderWidth: 3,
    borderColor: COLORS.ink,
    padding: 18,
    shadowColor: COLORS.parchmentShadow,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },

  hookText: {
    fontSize: 12,
    lineHeight: 19,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 9,
  },

  readyText: {
    marginTop: 24,
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.white,
    textAlign: 'center',
  },

  readySubtext: {
    marginTop: 5,
    fontSize: 11,
    color: COLORS.parchment,
    textAlign: 'center',
  },

  enterButton: {
    width: '100%',
    height: 56,
    marginTop: 17,
    borderRadius: 28,
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
    elevation: 5,
  },

  enterButtonText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.ink,
  },

  enterIcon: {
    marginLeft: 10,
    fontSize: 18,
    color: COLORS.walnut,
  },

  /* HEADER */

  caseScreen: {
    width: '100%',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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
    shadowColor: COLORS.parchmentShadow,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },

  backText: {
    fontSize: 30,
    lineHeight: 30,
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

  caseStamp: {
    alignSelf: 'center',
    paddingHorizontal: 15,
    paddingVertical: 7,
    backgroundColor: COLORS.parchment,
    borderWidth: 2,
    borderColor: COLORS.ink,
    transform: [
      {
        rotate: '-2deg',
      },
    ],
    marginBottom: 14,
  },

  caseStampText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.ink,
    letterSpacing: 1,
  },

  /* CLAIM */

  claimCard: {
    backgroundColor: COLORS.parchment,
    borderWidth: 3,
    borderColor: COLORS.ink,
    padding: 18,
    shadowColor: COLORS.parchmentShadow,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    marginBottom: 14,
  },

  sectionLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.walnut,
    letterSpacing: 1,
    marginBottom: 7,
  },

  claimText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '900',
    color: COLORS.ink,
  },

  /* STUDY */

  studyCard: {
    backgroundColor: COLORS.parchmentLight,
    borderWidth: 2,
    borderColor: COLORS.ink,
    padding: 16,
    marginBottom: 13,
  },

  studyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  studySource: {
    maxWidth: '48%',
    fontSize: 8,
    lineHeight: 12,
    color: COLORS.walnut,
    fontWeight: '800',
    textAlign: 'right',
  },

  studyText: {
    fontSize: 11,
    lineHeight: 18,
    color: COLORS.ink,
    fontWeight: '600',
  },

  metaRow: {
    flexDirection: 'row',
    gap: 30,
    marginTop: 14,
    paddingTop: 11,
    borderTopWidth: 2,
    borderTopColor: COLORS.parchmentShadow,
  },

  metaLabel: {
    fontSize: 8,
    fontWeight: '900',
    color: COLORS.walnut,
  },

  metaValue: {
    marginTop: 3,
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.ink,
  },

  /* EXAMINE */

  examineButton: {
    minHeight: 63,
    borderRadius: 31,
    borderWidth: 3,
    borderColor: COLORS.ink,
    backgroundColor: COLORS.parchment,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,

    shadowColor: COLORS.parchmentShadow,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },

  examineButtonDone: {
    backgroundColor: '#B4C4A5',
  },

  examineIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.gold,
    borderWidth: 2,
    borderColor: COLORS.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  magnifyingGlass: {
    fontSize: 21,
    fontWeight: '900',
    color: COLORS.ink,
  },

  examineContent: {
    flex: 1,
  },

  examineTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.ink,
    letterSpacing: 0.5,
  },

  examineSubtitle: {
    marginTop: 3,
    fontSize: 9,
    lineHeight: 13,
    color: COLORS.walnut,
  },

  observationCard: {
    marginTop: 12,
    backgroundColor: COLORS.parchment,
    borderWidth: 2,
    borderColor: COLORS.parchmentShadow,
    padding: 14,
  },

  observationLabel: {
    fontSize: 8,
    fontWeight: '900',
    color: COLORS.walnut,
    letterSpacing: 0.7,
    marginBottom: 5,
  },

  observationText: {
    fontSize: 10,
    lineHeight: 16,
    fontWeight: '700',
    color: COLORS.ink,
  },

  /* VERDICT */

  verdictArea: {
    marginTop: 24,
    alignItems: 'center',
  },

  verdictQuestion: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.white,
    textAlign: 'center',
  },

  verdictHint: {
    marginTop: 5,
    fontSize: 9,
    lineHeight: 14,
    color: COLORS.parchment,
    textAlign: 'center',
  },

  verdictButton: {
    width: '100%',
    height: 56,
    marginTop: 13,
    borderRadius: 28,
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
    elevation: 5,
  },

  verdictButtonDisabled: {
    backgroundColor: COLORS.parchmentShadow,
    opacity: 0.7,
  },

  verdictButtonText: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.ink,
  },

  gavelIcon: {
    marginLeft: 10,
    fontSize: 17,
    color: COLORS.walnut,
  },

  mascot: {
    position: 'absolute',
    right: 12,
    bottom: 16,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.parchment,
    borderWidth: 2,
    borderColor: COLORS.ink,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.parchmentShadow,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
});