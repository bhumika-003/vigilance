import { View, Text, StyleSheet } from 'react-native'
import { scaleFontSize, scaleSpacing, getResponsiveBorderRadius, getLineHeight, getScreenDimensions } from '../utils/responsive'

type AIAnalystProps = {
  label?: string
  fact?: string
  confidence: number
  caseNumber: number
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a2a3a',
    borderLeftWidth: 3,
    borderLeftColor: '#4db8a8',
    padding: scaleSpacing(14),
    marginVertical: scaleSpacing(12),
    borderRadius: getResponsiveBorderRadius(),
    borderWidth: 1,
    borderColor: 'rgba(77, 184, 168, 0.2)',
    shadowColor: '#4db8a8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaleSpacing(10),
    paddingBottom: scaleSpacing(10),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(77, 184, 168, 0.3)',
  },
  title: {
    fontSize: scaleFontSize(12),
    color: '#4db8a8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  caseTag: {
    fontSize: scaleFontSize(10),
    color: '#4db8a8',
    fontWeight: '500',
    opacity: 0.7,
  },
  factLabel: {
    fontSize: scaleFontSize(10),
    color: '#7ba8a0',
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: scaleSpacing(4),
  },
  factText: {
    fontSize: scaleFontSize(13),
    color: '#c0e0d8',
    lineHeight: getLineHeight(scaleFontSize(13)),
    fontWeight: '400',
    marginBottom: scaleSpacing(12),
  },
  confidenceMeter: {
    marginTop: scaleSpacing(10),
  },
  confidenceLabel: {
    fontSize: scaleFontSize(10),
    color: '#7ba8a0',
    fontWeight: '500',
    marginBottom: scaleSpacing(4),
  },
  meterTrack: {
    height: scaleSpacing(6),
    backgroundColor: '#0a1a2a',
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(77, 184, 168, 0.2)',
  },
  meterFill: {
    height: '100%',
    backgroundColor: '#4db8a8',
    borderRadius: 3,
  },
  confidenceText: {
    fontSize: scaleFontSize(11),
    color: '#4db8a8',
    fontWeight: '600',
    marginTop: scaleSpacing(4),
  },
})

export function AIAnalyst({ label = 'AI Analysis', fact, confidence, caseNumber }: AIAnalystProps) {
  const displayFact = fact || 'Analyzing witness statements...'
  const confidencePercent = Math.round(confidence)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{label}</Text>
        <Text style={styles.caseTag}>Case #{caseNumber}</Text>
      </View>

      <View>
        <Text style={styles.factLabel}>Current Analysis</Text>
        <Text style={styles.factText}>{displayFact}</Text>
      </View>

      <View style={styles.confidenceMeter}>
        <Text style={styles.confidenceLabel}>Analysis Confidence</Text>
        <View style={styles.meterTrack}>
          <View
            style={[
              styles.meterFill,
              {
                width: `${confidencePercent}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.confidenceText}>{confidencePercent}%</Text>
      </View>
    </View>
  )
}
