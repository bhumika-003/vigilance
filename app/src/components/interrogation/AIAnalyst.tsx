import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  Animated,
} from 'react-native'
import { useEffect, useRef } from 'react'

import {
  scaleFontSize,
  scaleSpacing,
} from '../../utils/responsive'


type AIAnalystProps = {
  visible: boolean
  onClose: () => void

  currentCase?: any
  confidence?: number
  fact?: string
}


export function AIAnalyst({
  visible,
  onClose,

  currentCase,
  confidence = 0,
  fact,
}: AIAnalystProps) {

  const scanOpacity =
    useRef(new Animated.Value(0.2)).current


  useEffect(() => {

    if (!visible) {
      return
    }

    const animation = Animated.loop(

      Animated.sequence([

        Animated.timing(scanOpacity, {
          toValue: 0.75,
          duration: 900,
          useNativeDriver: true,
        }),

        Animated.timing(scanOpacity, {
          toValue: 0.2,
          duration: 900,
          useNativeDriver: true,
        }),

      ])

    )

    animation.start()

    return () => {
      animation.stop()
    }

  }, [visible])


  const getStatus = () => {

    if (confidence >= 75) {

      return {
        label: 'HIGH CONFIDENCE',
        symbol: '✓',

        recommendation:
          'THE EVIDENCE STRONGLY SUPPORTS THIS LEAD.',
      }

    }


    if (confidence >= 40) {

      return {
        label: 'ANALYZING',
        symbol: '!',

        recommendation:
          'MORE QUESTIONING IS RECOMMENDED.',
      }

    }


    return {

      label: 'LOW CONFIDENCE',
      symbol: '?',

      recommendation:
        'THE CURRENT LEAD IS STILL UNCERTAIN.',

    }

  }


  const status = getStatus()


  return (

    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >

      <View style={styles.modalBackdrop}>

        <View style={styles.terminalPanel}>


          {/* =====================
              HEADER
          ====================== */}

          <View style={styles.header}>

            <View>

              <Text style={styles.headerTitle}>
                A.I.D.A.
              </Text>

              <Text style={styles.headerSubtitle}>
                INVESTIGATION ASSISTANT
              </Text>

            </View>


            <Pressable
              onPress={onClose}
              style={styles.closeButton}
            >

              <Text style={styles.closeText}>
                X
              </Text>

            </Pressable>

          </View>


          {/* =====================
              TERMINAL CONTENT
          ====================== */}

          <ScrollView
            style={styles.content}
            contentContainerStyle={
              styles.contentContainer
            }
            showsVerticalScrollIndicator={false}
          >


            {/* SYSTEM STATUS */}

            <View style={styles.systemRow}>

              <Animated.View
                style={[
                  styles.systemIndicator,
                  {
                    opacity: scanOpacity,
                  },
                ]}
              />

              <Text style={styles.systemText}>
                ANALYZING CASE DATA...
              </Text>

            </View>


            {/* CASE */}

            <View style={styles.section}>

              <Text style={styles.sectionLabel}>
                CASE
              </Text>

              <Text style={styles.sectionValue}>

                {currentCase?.title ||
                  currentCase?.name ||
                  `CASE #${currentCase?.caseNumber || '01'}`}

              </Text>

            </View>


            {/* FACT CHECK */}

            <View style={styles.section}>

              <Text style={styles.sectionLabel}>
                FACT CHECK
              </Text>

              <View style={styles.factBox}>

                <Text style={styles.factText}>

                  {fact ||
                    currentCase?.fact ||
                    'NO FACT DATA AVAILABLE.'}

                </Text>

              </View>

            </View>


            {/* CONFIDENCE */}

            <View style={styles.section}>

              <View
                style={
                  styles.confidenceHeader
                }
              >

                <Text style={styles.sectionLabel}>
                  CONFIDENCE
                </Text>


                <Text
                  style={
                    styles.confidenceNumber
                  }
                >

                  {Math.round(confidence)}%

                </Text>

              </View>


              <View style={styles.progressTrack}>

                <View
                  style={[
                    styles.progressFill,
                    {
                      width:
                        `${Math.max(
                          0,
                          Math.min(
                            confidence,
                            100
                          )
                        )}%`,
                    },
                  ]}
                />

              </View>

            </View>


            {/* AI ASSESSMENT */}

            <View style={styles.assessment}>

              <Text
                style={
                  styles.assessmentSymbol
                }
              >
                {status.symbol}
              </Text>


              <View
                style={
                  styles.assessmentContent
                }
              >

                <Text
                  style={
                    styles.assessmentTitle
                  }
                >
                  {status.label}
                </Text>


                <Text
                  style={
                    styles.assessmentText
                  }
                >
                  {status.recommendation}
                </Text>

              </View>

            </View>


            {/* TACTICAL RECOMMENDATION */}

            <View style={styles.recommendation}>

              <Text
                style={
                  styles.recommendationLabel
                }
              >
                RECOMMENDED ACTION
              </Text>


              <Text
                style={
                  styles.recommendationText
                }
              >

                {confidence >= 75
                  ? 'PRESENT EVIDENCE'
                  : confidence >= 40
                  ? 'ASK A FOLLOW-UP QUESTION'
                  : 'CHANGE YOUR APPROACH'}

              </Text>

            </View>

          </ScrollView>


          {/* =====================
              FOOTER
          ====================== */}

          <Pressable
            style={styles.returnButton}
            onPress={onClose}
          >

            <Text style={styles.returnText}>
              RETURN TO INTERROGATION
            </Text>

          </Pressable>

        </View>

      </View>

    </Modal>

  )

}


const styles = StyleSheet.create({

  modalBackdrop: {
    flex: 1,

    backgroundColor:
      'rgba(0,0,0,0.78)',

    justifyContent: 'center',

    alignItems: 'center',

    padding: scaleSpacing(18),
  },


  terminalPanel: {

    width: '100%',

    maxWidth: 650,

    maxHeight: '85%',

    backgroundColor: '#0b1719',

    borderWidth: 4,

    borderColor: '#4dd4b0',

    shadowColor: '#4dd4b0',

    shadowOpacity: 0.3,

    shadowRadius: 15,

    elevation: 15,

    overflow: 'hidden',

  },


  /* =====================
      HEADER
  ====================== */

  header: {

    minHeight: 68,

    backgroundColor: '#10282b',

    borderBottomWidth: 3,

    borderBottomColor: '#4dd4b0',

    paddingHorizontal:
      scaleSpacing(14),

    paddingVertical:
      scaleSpacing(10),

    flexDirection: 'row',

    justifyContent:
      'space-between',

    alignItems: 'center',

  },


  headerTitle: {

    color: '#70f0c5',

    fontSize:
      scaleFontSize(20),

    fontWeight: '900',

    letterSpacing: 2,

  },


  headerSubtitle: {

    color: '#7ba9a0',

    fontSize:
      scaleFontSize(8),

    fontWeight: 'bold',

    letterSpacing: 1,

    marginTop: 2,

  },


  closeButton: {

    width: 34,

    height: 34,

    borderWidth: 2,

    borderColor: '#4dd4b0',

    alignItems: 'center',

    justifyContent: 'center',

  },


  closeText: {

    color: '#70f0c5',

    fontWeight: '900',

    fontSize:
      scaleFontSize(14),

  },


  /* =====================
      CONTENT
  ====================== */

  content: {
    flex: 1,
  },


  contentContainer: {

    padding:
      scaleSpacing(16),

    gap:
      scaleSpacing(16),

  },


  systemRow: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 8,

    borderBottomWidth: 1,

    borderBottomColor:
      '#244246',

    paddingBottom: 10,

  },


  systemIndicator: {

    width: 8,

    height: 8,

    borderRadius: 4,

    backgroundColor:
      '#70f0c5',

  },


  systemText: {

    color: '#70f0c5',

    fontSize:
      scaleFontSize(9),

    fontWeight: 'bold',

    letterSpacing: 1,

  },


  section: {
    gap: 7,
  },


  sectionLabel: {

    color: '#6f9690',

    fontSize:
      scaleFontSize(9),

    fontWeight: '900',

    letterSpacing: 1.2,

  },


  sectionValue: {

    color: '#d6f3e8',

    fontSize:
      scaleFontSize(15),

    fontWeight: '700',

  },


  factBox: {

    backgroundColor:
      '#102326',

    borderWidth: 2,

    borderColor:
      '#244246',

    padding:
      scaleSpacing(12),

  },


  factText: {

    color: '#d6f3e8',

    fontSize:
      scaleFontSize(13),

    lineHeight:
      scaleFontSize(20),

  },


  confidenceHeader: {

    flexDirection: 'row',

    justifyContent:
      'space-between',

    alignItems: 'center',

  },


  confidenceNumber: {

    color: '#70f0c5',

    fontSize:
      scaleFontSize(16),

    fontWeight: '900',

  },


  progressTrack: {

    height: 14,

    backgroundColor:
      '#071012',

    borderWidth: 2,

    borderColor:
      '#244246',

  },


  progressFill: {

    height: '100%',

    backgroundColor:
      '#4dd4b0',

  },


  /* =====================
      ASSESSMENT
  ====================== */

  assessment: {

    flexDirection: 'row',

    gap:
      scaleSpacing(12),

    backgroundColor:
      '#102326',

    borderWidth: 2,

    borderColor:
      '#244246',

    padding:
      scaleSpacing(12),

  },


  assessmentSymbol: {

    color: '#70f0c5',

    fontSize:
      scaleFontSize(28),

    fontWeight: '900',

  },


  assessmentContent: {
    flex: 1,
  },


  assessmentTitle: {

    color: '#70f0c5',

    fontSize:
      scaleFontSize(13),

    fontWeight: '900',

    letterSpacing: 1,

  },


  assessmentText: {

    color: '#b7d3ca',

    fontSize:
      scaleFontSize(11),

    lineHeight:
      scaleFontSize(17),

    marginTop: 4,

  },


  /* =====================
      RECOMMENDATION
  ====================== */

  recommendation: {

    borderWidth: 2,

    borderColor:
      '#4dd4b0',

    padding:
      scaleSpacing(12),

  },


  recommendationLabel: {

    color: '#6f9690',

    fontSize:
      scaleFontSize(8),

    fontWeight: '900',

    letterSpacing: 1,

  },


  recommendationText: {

    color: '#f0f6d6',

    fontSize:
      scaleFontSize(14),

    fontWeight: '900',

    marginTop: 6,

    letterSpacing: 0.5,

  },


  /* =====================
      FOOTER
  ====================== */

  returnButton: {

    backgroundColor:
      '#10282b',

    borderTopWidth: 3,

    borderTopColor:
      '#4dd4b0',

    paddingVertical:
      scaleSpacing(14),

    alignItems: 'center',

  },


  returnText: {

    color: '#70f0c5',

    fontSize:
      scaleFontSize(11),

    fontWeight: '900',

    letterSpacing: 1,

  },

})