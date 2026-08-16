import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native'
import { scaleFontSize, scaleSpacing, getResponsiveBorderRadius, getLineHeight, getScreenDimensions } from '../utils/responsive'

type QuestionOption = {
  text: string
  targetsWeakLink: boolean
  rulingText: string
}

type DetectiveQuestionsProps = {
  options: QuestionOption[]
  onSelect: (option: QuestionOption) => void
  visible: boolean
}

const baseTextFontSize = 14

const styles = StyleSheet.create({
  container: {
    paddingVertical: scaleSpacing(16),
    paddingHorizontal: scaleSpacing(12),
  },
  header: {
    paddingBottom: scaleSpacing(12),
    marginBottom: scaleSpacing(12),
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(212, 175, 55, 0.3)',
  },
  headerText: {
    fontSize: scaleFontSize(12),
    color: '#d4af37',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  optionsScroll: {
    maxHeight: '100%',
  },
  questionCard: {
    backgroundColor: '#2a3a4a',
    borderRadius: getResponsiveBorderRadius(),
    padding: scaleSpacing(12),
    marginBottom: scaleSpacing(10),
    borderLeftWidth: 4,
    borderLeftColor: '#d4af37',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  questionCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  questionIndex: {
    fontSize: scaleFontSize(11),
    color: '#d4af37',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: scaleSpacing(4),
  },
  questionText: {
    fontSize: scaleFontSize(baseTextFontSize),
    color: '#e8f4f8',
    lineHeight: getLineHeight(scaleFontSize(baseTextFontSize)),
    fontWeight: '400',
  },
})

export function DetectiveQuestionsPanel({ options, onSelect, visible }: DetectiveQuestionsProps) {
  if (!visible) return null

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Detective's Questions</Text>
      </View>

      <ScrollView style={styles.optionsScroll} showsVerticalScrollIndicator={false}>
        {options.map((option, index) => (
          <Pressable
            key={option.text}
            onPress={() => onSelect(option)}
            style={({ pressed }) => [
              styles.questionCard,
              pressed && styles.questionCardPressed,
            ]}
          >
            <Text style={styles.questionIndex}>Q{index + 1}</Text>
            <Text style={styles.questionText}>{option.text}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  )
}
