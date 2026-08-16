import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { scaleFontSize, scaleSpacing, getResponsiveBorderRadius, getLineHeight } from '../utils/responsive'

type VerdictPanelProps = {
  questionText: string
  rulingText: string
  previousConfidence: number
  currentConfidence: number
  onContinue: () => void
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: '#2a2a2a',
    borderRadius: getResponsiveBorderRadius(),
    padding: scaleSpacing(20),
    marginVertical: scaleSpacing(16),
    borderTopWidth: 2,
    borderTopColor: '#74c6a0',
  },
  headingRow: {
    marginBottom: scaleSpacing(16),
  },
  label: {
    fontSize: scaleFontSize(12),
    color: '#74c6a0',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  questionWrap: {
    backgroundColor: 'rgba(116, 198, 160, 0.1)',
    borderRadius: getResponsiveBorderRadius(),
    padding: scaleSpacing(12),
    marginBottom: scaleSpacing(16),
    borderLeftWidth: 3,
    borderLeftColor: '#74c6a0',
  },
  questionTag: {
    fontSize: scaleFontSize(11),
    color: '#74c6a0',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: scaleSpacing(6),
  },
  questionText: {
    fontSize: scaleFontSize(14),
    color: '#e0e0e0',
    lineHeight: getLineHeight(scaleFontSize(14)),
  },
  rulingWrap: {
    marginBottom: scaleSpacing(20),
  },
  rulingText: {
    fontSize: scaleFontSize(14),
    color: '#b0b0b0',
    lineHeight: getLineHeight(scaleFontSize(14)),
  },
  meterWrap: {
    marginBottom: scaleSpacing(20),
  },
  meterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scaleSpacing(8),
  },
  meterLabel: {
    fontSize: scaleFontSize(12),
    color: '#74c6a0',
    fontWeight: '600',
  },
  meterValue: {
    fontSize: scaleFontSize(12),
    color: '#74c6a0',
    fontWeight: '600',
  },
  meterTrack: {
    height: scaleSpacing(8),
    backgroundColor: '#444',
    borderRadius: 4,
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    backgroundColor: '#74c6a0',
    borderRadius: 4,
  },
  continueButton: {
    paddingVertical: scaleSpacing(12),
    paddingHorizontal: scaleSpacing(24),
    backgroundColor: '#74c6a0',
    borderRadius: getResponsiveBorderRadius(),
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#1a1a1a',
    fontSize: scaleFontSize(16),
    fontWeight: '600',
  },
})

export function VerdictPanel({
  questionText,
  rulingText,
  previousConfidence,
  currentConfidence,
  onContinue,
}: VerdictPanelProps) {
  const [displayText, setDisplayText] = useState('')
  const meterWidthAnim = useRef(new Animated.Value(previousConfidence)).current
  const panelOpacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    setDisplayText('')
    let index = 0
    const interval = setInterval(() => {
      index += 1
      setDisplayText(rulingText.slice(0, index))

      if (index >= rulingText.length) {
        clearInterval(interval)
      }
    }, 18)

    return () => clearInterval(interval)
  }, [rulingText])

  useEffect(() => {
    Animated.parallel([
      Animated.timing(panelOpacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(meterWidthAnim, {
        toValue: currentConfidence,
        duration: 700,
        useNativeDriver: false,
      }),
    ]).start()
  }, [])

  const meterWidth = meterWidthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  })

  return (
    <Animated.View
      style={[
        styles.panel,
        {
          opacity: panelOpacityAnim,
        },
      ]}
    >
      <View style={styles.headingRow}>
        <Text style={styles.label}>Ruling</Text>
      </View>

      <View style={styles.questionWrap}>
        <Text style={styles.questionTag}>Question</Text>
        <Text style={styles.questionText}>{questionText}</Text>
      </View>

      <View style={styles.rulingWrap}>
        <Text style={styles.rulingText}>{displayText}</Text>
      </View>

      <View style={styles.meterWrap}>
        <View style={styles.meterHeader}>
          <Text style={styles.meterLabel}>Confidence</Text>
          <Text style={styles.meterValue}>{currentConfidence}%</Text>
        </View>
        <View style={styles.meterTrack}>
          <Animated.View
            style={[
              styles.meterFill,
              {
                width: meterWidth,
              },
            ]}
          />
        </View>
      </View>

      <Pressable
        onPress={onContinue}
        style={({ pressed }) => ({
          ...styles.continueButton,
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </Pressable>
    </Animated.View>
  )
}
