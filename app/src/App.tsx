import { useMemo, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Modal,
  ScrollView,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'

import { CaseTransition } from './components/CaseTransition'
import { WitnessDialogue } from './components/WitnessDialogue'
import { DetectiveQuestionsPanel } from './components/DetectiveQuestionsPanel'
import { AIAnalyst } from './components/AIAnalyst'
import { InterrogationRoomBackground } from './components/InterrogationRoomBackground'
import { ImpactBeat } from './components/ImpactBeat'
import { VerdictPanel } from './components/VerdictPanel'

import { GameProvider, useGame } from './game/gameState'

import {
  scaleFontSize,
  scaleSpacing,
} from './utils/responsive'


function InterrogationScene() {
  const {
    currentCase,
    askedQuestion,
    currentConfidence,
    history,
    isResolved,
    submitQuestion,
    continueToNextCase,
  } = useGame()

  const [showQuestionsPanel, setShowQuestionsPanel] =
    useState(false)

  const [showEvidence, setShowEvidence] =
    useState(false)

  const [showAI, setShowAI] =
    useState(false)

  const [impactBeat, setImpactBeat] =
    useState<string | null>(null)

  const [caseTransition, setCaseTransition] =
    useState(false)


  const witnessStatement = useMemo(() => {
    if (askedQuestion) {
      return `The claim: "${currentCase.claimText}"`
    }

    return 'The witness is ready for questioning. Choose a question to expose the weak link.'
  }, [
    askedQuestion,
    currentCase.claimText,
  ])


  const selectedOption =
    currentCase.questionOptions.find(
      option => option.text === askedQuestion
    ) ?? null


  const handleSelectQuestion = (
    option: {
      text: string
      targetsWeakLink: boolean
      rulingText: string
    }
  ) => {
    setShowQuestionsPanel(false)

    setImpactBeat(
      option.targetsWeakLink
        ? 'Sharp Question!'
        : 'Missed the Mark!'
    )

    submitQuestion(
      option.text,
      option.targetsWeakLink
    )
  }


  const handleDialogueAdvance = () => {
    if (
      !askedQuestion &&
      !showQuestionsPanel
    ) {
      setShowQuestionsPanel(true)
    }
  }


  const handleContinue = () => {
    setCaseTransition(true)

    setTimeout(() => {
      continueToNextCase()
      setCaseTransition(false)
    }, 600)
  }


  const aiFact = askedQuestion
    ? `Analyzing witness response to: "${selectedOption?.text || askedQuestion}"`
    : 'Awaiting question selection...'


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* =========================
          INTERROGATION ROOM
      ========================== */}

      <View style={styles.gameScene}>

        <InterrogationRoomBackground
          onEvidencePress={() =>
            setShowEvidence(true)
          }
          onAIPress={() =>
            setShowAI(true)
          }
        />


        {/* =========================
            TOP HUD
        ========================== */}

        <View style={styles.hud}>

          <View style={styles.caseBadge}>

            <Text style={styles.caseLabel}>
              CASE
            </Text>

            <Text style={styles.caseNumber}>
              #{currentCase.caseNumber}
            </Text>

          </View>


          <Pressable
            onPress={() =>
              setShowAI(true)
            }
            style={styles.confidenceBox}
          >

            <Text style={styles.confidenceLabel}>
              CONFIDENCE
            </Text>

            <Text style={styles.confidenceValue}>
              {currentConfidence}%
            </Text>

          </Pressable>

        </View>


        {/* =========================
            QUESTION BUTTON
        ========================== */}

        {!askedQuestion &&
          !showQuestionsPanel && (

            <Pressable
              style={styles.questionButton}
              onPress={() =>
                setShowQuestionsPanel(true)
              }
            >

              <Text style={styles.questionButtonText}>
                ASK QUESTION
              </Text>

            </Pressable>

          )}


        {/* =========================
            QUESTION MENU
        ========================== */}

        {showQuestionsPanel &&
          !isResolved && (

            <DetectiveQuestionsPanel
              questions={currentCase.questionOptions.map(
                (option, index) => ({
                  id: String(index),
                  text: option.text,
                })
              )}
              onSelect={(question) => {

                const option =
                  currentCase.questionOptions.find(
                    item =>
                      item.text === question.text
                  )

                if (option) {
                  handleSelectQuestion(option)
                }

              }}
            />

          )}


        {/* =========================
            EVIDENCE OVERLAY
        ========================== */}

        <Modal
          visible={showEvidence}
          transparent
          animationType="fade"
          onRequestClose={() =>
            setShowEvidence(false)
          }
        >

          <View style={styles.modalBackdrop}>

            <View style={styles.evidencePanel}>

              <View style={styles.evidenceHeader}>

                <View>

                  <Text style={styles.evidenceTitle}>
                    EVIDENCE FILE
                  </Text>

                  <Text style={styles.evidenceCase}>
                    CASE #{currentCase.caseNumber}
                  </Text>

                </View>


                <Pressable
                  onPress={() =>
                    setShowEvidence(false)
                  }
                  style={styles.closeButton}
                >

                  <Text style={styles.closeText}>
                    X
                  </Text>

                </Pressable>

              </View>


              <ScrollView
                contentContainerStyle={
                  styles.evidenceContent
                }
              >

                <Text style={styles.evidenceLabel}>
                  WITNESS CLAIM
                </Text>

                <Text style={styles.evidenceText}>
                  {currentCase.claimText}
                </Text>


                <View
                  style={styles.evidenceDivider}
                />


                <Text style={styles.evidenceLabel}>
                  INVESTIGATION STATUS
                </Text>

                <Text style={styles.evidenceText}>
                  {askedQuestion
                    ? 'A QUESTION HAS BEEN SUBMITTED. ANALYZE THE RESPONSE.'
                    : 'NO QUESTION HAS BEEN ASKED YET.'}
                </Text>


                {selectedOption && (
                  <>

                    <View
                      style={
                        styles.evidenceDivider
                      }
                    />


                    <Text
                      style={
                        styles.evidenceLabel
                      }
                    >
                      LAST QUESTION
                    </Text>


                    <Text
                      style={
                        styles.evidenceText
                      }
                    >
                      {selectedOption.text}
                    </Text>

                  </>
                )}

              </ScrollView>


              <Pressable
                style={styles.returnButton}
                onPress={() =>
                  setShowEvidence(false)
                }
              >

                <Text
                  style={
                    styles.returnButtonText
                  }
                >
                  RETURN TO ROOM
                </Text>

              </Pressable>

            </View>

          </View>

        </Modal>


        {/* =========================
            AI ANALYST
        ========================== */}

        <AIAnalyst
          visible={showAI}
          onClose={() =>
            setShowAI(false)
          }
          currentCase={currentCase}
          confidence={currentConfidence}
          fact={aiFact}
        />


        {/* =========================
            VERDICT
        ========================== */}

        {isResolved &&
          selectedOption && (

            <View style={styles.verdictOverlay}>

              <VerdictPanel
                questionText={
                  selectedOption.text
                }
                rulingText={
                  selectedOption.rulingText
                }
                previousConfidence={
                  history[0]?.confidenceBefore ??
                  currentCase.startingConfidence
                }
                currentConfidence={
                  currentConfidence
                }
                onContinue={
                  handleContinue
                }
              />

            </View>

          )}


        {/* =========================
            WITNESS DIALOGUE
        ========================== */}

        {!isResolved &&
          !showQuestionsPanel && (

            <WitnessDialogue
              text={witnessStatement}
              speaker="WITNESS"
              onAdvance={
                handleDialogueAdvance
              }
            />

          )}


        {/* =========================
            TACTICAL FEEDBACK
        ========================== */}

        {impactBeat && (

          <ImpactBeat
            text={impactBeat}
            onComplete={() =>
              setImpactBeat(null)
            }
          />

        )}


        {/* =========================
            CASE TRANSITION
        ========================== */}

        {caseTransition && (
          <CaseTransition
            active={caseTransition}
            caseNumber={currentCase.caseNumber}
            title={currentCase.claimText}
          />
        )}

      </View>

    </SafeAreaView>
  )
}


export default function App() {
  return (
    <GameProvider>
      <InterrogationScene />
    </GameProvider>
  )
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#08090c',
  },


  gameScene: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },


  /* =====================
      TOP HUD
  ====================== */

  hud: {
    position: 'absolute',

    top: scaleSpacing(12),

    left: scaleSpacing(14),

    right: scaleSpacing(14),

    flexDirection: 'row',

    justifyContent: 'space-between',

    zIndex: 50,
  },


  caseBadge: {
    backgroundColor: '#17191d',

    borderWidth: 3,
    borderColor: '#050505',

    paddingHorizontal: scaleSpacing(12),

    paddingVertical: scaleSpacing(7),

    minWidth: 90,
  },


  caseLabel: {
    color: '#8d9299',

    fontSize: scaleFontSize(8),

    fontWeight: '900',

    letterSpacing: 1,
  },


  caseNumber: {
    color: '#f0d37a',

    fontSize: scaleFontSize(18),

    fontWeight: '900',
  },


  confidenceBox: {
    backgroundColor: '#10282b',

    borderWidth: 3,
    borderColor: '#4dd4b0',

    paddingHorizontal: scaleSpacing(12),

    paddingVertical: scaleSpacing(7),

    alignItems: 'flex-end',
  },


  confidenceLabel: {
    color: '#78a59c',

    fontSize: scaleFontSize(8),

    fontWeight: '900',

    letterSpacing: 1,
  },


  confidenceValue: {
    color: '#70f0c5',

    fontSize: scaleFontSize(18),

    fontWeight: '900',
  },


  /* =====================
      QUESTION BUTTON
  ====================== */

  questionButton: {
    position: 'absolute',

    top: '58%',

    alignSelf: 'center',

    backgroundColor: '#d4af37',

    borderWidth: 4,
    borderColor: '#1b1506',

    paddingHorizontal: scaleSpacing(22),

    paddingVertical: scaleSpacing(12),

    zIndex: 60,

    elevation: 10,
  },


  questionButtonText: {
    color: '#171205',

    fontSize: scaleFontSize(13),

    fontWeight: '900',

    letterSpacing: 1,
  },


  /* =====================
      EVIDENCE MODAL
  ====================== */

  modalBackdrop: {
    flex: 1,

    backgroundColor: 'rgba(0,0,0,0.75)',

    justifyContent: 'center',

    alignItems: 'center',

    padding: scaleSpacing(20),
  },


  evidencePanel: {
    width: '100%',

    maxWidth: 650,

    maxHeight: '75%',

    backgroundColor: '#ded2b2',

    borderWidth: 5,
    borderColor: '#171205',

    overflow: 'hidden',
  },


  evidenceHeader: {
    backgroundColor: '#a47d2e',

    borderBottomWidth: 4,
    borderBottomColor: '#38280d',

    padding: scaleSpacing(14),

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',
  },


  evidenceTitle: {
    color: '#201608',

    fontSize: scaleFontSize(17),

    fontWeight: '900',

    letterSpacing: 1,
  },


  evidenceCase: {
    color: '#4d3a15',

    fontSize: scaleFontSize(9),

    fontWeight: 'bold',

    marginTop: 3,
  },


  closeButton: {
    width: 34,
    height: 34,

    backgroundColor: '#2b2110',

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 2,
    borderColor: '#080604',
  },


  closeText: {
    color: '#f2e8c9',

    fontSize: scaleFontSize(14),

    fontWeight: '900',
  },


  evidenceContent: {
    padding: scaleSpacing(18),
  },


  evidenceLabel: {
    color: '#74633e',

    fontSize: scaleFontSize(9),

    fontWeight: '900',

    letterSpacing: 1,
  },


  evidenceText: {
    color: '#242018',

    fontSize: scaleFontSize(14),

    lineHeight: scaleFontSize(22),

    fontWeight: '600',

    marginTop: 6,
  },


  evidenceDivider: {
    height: 2,

    backgroundColor: '#aa9d7e',

    marginVertical: scaleSpacing(18),
  },


  returnButton: {
    backgroundColor: '#2b2110',

    paddingVertical: scaleSpacing(14),

    alignItems: 'center',
  },


  returnButtonText: {
    color: '#f2e8c9',

    fontSize: scaleFontSize(11),

    fontWeight: '900',

    letterSpacing: 1,
  },


  /* =====================
      VERDICT
  ====================== */

  verdictOverlay: {
    ...StyleSheet.absoluteFillObject,

    zIndex: 180,

    justifyContent: 'center',

    alignItems: 'center',

    backgroundColor: 'rgba(0,0,0,0.45)',
  },

})