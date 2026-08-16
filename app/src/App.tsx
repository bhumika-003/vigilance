import { useMemo, useState, useEffect } from 'react'
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, Pressable } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { CaseTransition } from './components/CaseTransition'
import { WitnessDialogue } from './components/WitnessDialogue'
import { DetectiveQuestionsPanel } from './components/DetectiveQuestionsPanel'
import { AIAnalyst } from './components/AIAnalyst'
import { InterrogationRoomBackground } from './components/InterrogationRoomBackground'
import { ImpactBeat } from './components/ImpactBeat'
import { QuestionSelectOverlay } from './components/QuestionSelectOverlay'
import { VerdictPanel } from './components/VerdictPanel'
import { GameProvider, useGame } from './game/gameState'
import {
  getScreenDimensions,
  scaleFontSize,
  scaleSpacing,
  getContainerPadding,
  getResponsiveMargin,
  getAvatarSize,
  getResponsiveBorderRadius,
} from './utils/responsive'

const { width: screenWidth } = getScreenDimensions()
const isWideScreen = screenWidth >= 1024

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  mainLayout: {
    flex: 1,
    flexDirection: isWideScreen ? 'row' : 'column',
  },
  leftPanel: {
    flex: isWideScreen ? 1.2 : 1,
    zIndex: 1,
  },
  rightPanel: {
    flex: isWideScreen ? 0.8 : 0,
    backgroundColor: '#0f0f0f',
    borderLeftWidth: isWideScreen ? 2 : 0,
    borderLeftColor: 'rgba(77, 184, 168, 0.1)',
    paddingHorizontal: isWideScreen ? scaleSpacing(12) : 0,
    paddingVertical: isWideScreen ? scaleSpacing(16) : 0,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: scaleSpacing(20),
  },
  contentArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: getContainerPadding().h,
    paddingVertical: scaleSpacing(16),
    position: 'relative',
    zIndex: 2,
  },
  sceneHeader: {
    marginBottom: scaleSpacing(20),
    paddingBottom: scaleSpacing(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  caseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  caseNumber: {
    fontSize: scaleFontSize(14),
    color: '#d4af37',
    fontWeight: '700',
    letterSpacing: 1,
  },
  confidenceText: {
    fontSize: scaleFontSize(12),
    color: '#a0c8e0',
    fontWeight: '500',
  },
  dialogueArea: {
    flex: 1,
    marginVertical: scaleSpacing(12),
  },
  actionBar: {
    alignItems: 'center',
    marginTop: scaleSpacing(16),
  },
  askButton: {
    paddingHorizontal: scaleSpacing(40),
    paddingVertical: scaleSpacing(14),
    backgroundColor: '#d4af37',
    borderRadius: getResponsiveBorderRadius(),
    borderWidth: 2,
    borderColor: '#1a1a1a',
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  askButtonText: {
    color: '#1a1a1a',
    fontSize: scaleFontSize(16),
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
  },
  rightPanelScroll: {
    flex: 1,
  },
})

function CourtroomScene() {
  const { currentCase, askedQuestion, currentConfidence, history, isResolved, submitQuestion, continueToNextCase } = useGame()
  const [showQuestionsPanel, setShowQuestionsPanel] = useState(false)
  const [impactBeat, setImpactBeat] = useState<{ label: string; color: string; intensity: 'sharp' | 'weak' } | null>(null)
  const [caseTransition, setCaseTransition] = useState(false)

  const witnessStatement = useMemo(() => {
    if (askedQuestion) {
      return `The claim: "${currentCase.claimText}"`
    }
    return 'The witness is ready for questioning. Choose a question to expose the weak link.'
  }, [askedQuestion, currentCase.claimText])

  const selectedOption = currentCase.questionOptions.find((option) => option.text === askedQuestion) ?? null

  const handleSelect = (option: { text: string; targetsWeakLink: boolean; rulingText: string }) => {
    setShowQuestionsPanel(false)
    setImpactBeat({
      label: option.targetsWeakLink ? 'Sharp question!' : 'Missed the mark',
      color: option.targetsWeakLink ? 'rgba(77, 184, 168, 0.8)' : 'rgba(212, 175, 55, 0.6)',
      intensity: option.targetsWeakLink ? 'sharp' : 'weak',
    })
    submitQuestion(option.text, option.targetsWeakLink)
  }

  const handleContinue = () => {
    setCaseTransition(true)
    setTimeout(() => {
      continueToNextCase()
      setCaseTransition(false)
    }, 600)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <InterrogationRoomBackground />

      <View style={styles.mainLayout}>
        {/* Left Panel - Main Interrogation Scene */}
        <View style={styles.leftPanel}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <View style={styles.contentArea}>
              {/* Case Header */}
              <View style={styles.sceneHeader}>
                <View style={styles.caseInfo}>
                  <Text style={styles.caseNumber}>CASE #{currentCase.caseNumber}</Text>
                  <Text style={styles.confidenceText}>Confidence: {currentConfidence}%</Text>
                </View>
              </View>

              {/* Witness Dialogue Area */}
              <View style={styles.dialogueArea}>
                <WitnessDialogue
                  text={witnessStatement}
                  onAdvance={() => {
                    if (!askedQuestion && !showQuestionsPanel) {
                      setShowQuestionsPanel(true)
                    }
                  }}
                />
              </View>

              {/* Verdict or Action Area */}
              {isResolved && selectedOption ? (
                <VerdictPanel
                  questionText={selectedOption.text}
                  rulingText={selectedOption.rulingText}
                  previousConfidence={history[0]?.confidenceBefore ?? currentCase.startingConfidence}
                  currentConfidence={currentConfidence}
                  onContinue={handleContinue}
                />
              ) : (
                !askedQuestion && (
                  <View style={styles.actionBar}>
                    <Pressable
                      onPress={() => setShowQuestionsPanel(!showQuestionsPanel)}
                      style={({ pressed }) => [styles.askButton, { opacity: pressed ? 0.85 : 1 }]}
                    >
                      <Text style={styles.askButtonText}>
                        {showQuestionsPanel ? 'HIDE' : 'CHOOSE QUESTION'}
                      </Text>
                    </Pressable>
                  </View>
                )
              )}

              {/* Detective Questions Panel */}
              {showQuestionsPanel && !isResolved && (
                <View style={{ marginTop: scaleSpacing(20) }}>
                  <DetectiveQuestionsPanel
                    options={currentCase.questionOptions}
                    onSelect={handleSelect}
                    visible={showQuestionsPanel}
                  />
                </View>
              )}
            </View>
          </ScrollView>
        </View>

        {/* Right Panel - AI Analyst (Desktop only) */}
        {isWideScreen && (
          <View style={styles.rightPanel}>
            <ScrollView style={styles.rightPanelScroll} showsVerticalScrollIndicator={false}>
              <AIAnalyst
                label="AI FACT-CHECK"
                fact={askedQuestion ? `Analyzing the witness response to: "${selectedOption?.text || 'pending'}"` : 'Awaiting question selection...'}
                confidence={currentConfidence}
                caseNumber={currentCase.caseNumber}
              />

              {selectedOption && (
                <View style={{ marginTop: scaleSpacing(16) }}>
                  <AIAnalyst
                    label="VERDICT ANALYSIS"
                    fact={selectedOption.rulingText}
                    confidence={selectedOption.targetsWeakLink ? 100 : 40}
                    caseNumber={currentCase.caseNumber}
                  />
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Overlay modals and animations */}
      {impactBeat && (
        <ImpactBeat
          active={Boolean(impactBeat)}
          label={impactBeat.label}
          color={impactBeat.color}
          intensity={impactBeat.intensity}
          onComplete={() => setImpactBeat(null)}
        />
      )}

      <CaseTransition
        active={caseTransition}
        caseNumber={currentCase.caseNumber + 1}
        title="Next file"
      />
    </SafeAreaView>
  )
}

export default function App() {
  return (
    <GameProvider>
      <CourtroomScene />
    </GameProvider>
  )
}
