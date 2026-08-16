import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native'
import { useState } from 'react'
import {
  getScreenDimensions,
  scaleFontSize,
  scaleSpacing,
} from '../../utils/responsive'

type Question = {
  id: string
  text: string
}

type DetectiveQuestionsPanelProps = {
  questions: Question[]
  onSelect: (question: Question) => void
}

export function DetectiveQuestionsPanel({
  questions,
  onSelect,
}: DetectiveQuestionsPanelProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const { width } = getScreenDimensions()
  const isWideScreen = width >= 768

  return (
    <View
      style={[
        styles.overlay,
        isWideScreen && styles.overlayWide,
      ]}
    >
      {/* Retro window header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          CHOOSE YOUR QUESTION
        </Text>

        <Text style={styles.headerSubText}>
          SELECT A LINE OF INQUIRY
        </Text>
      </View>

      {/* Question menu */}
      <View style={styles.menu}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.menuContent}
        >
          {questions.map((question, index) => {
            const isSelected = selectedIndex === index

            return (
              <Pressable
                key={question.id}
                onPress={() => {
                  setSelectedIndex(index)
                  onSelect(question)
                }}
                style={({ pressed }) => [
                  styles.questionRow,
                  isSelected && styles.questionRowSelected,
                  pressed && styles.questionPressed,
                ]}
              >
                {/* Pokemon-style selection arrow */}
                <Text
                  style={[
                    styles.selector,
                    !isSelected && styles.selectorHidden,
                  ]}
                >
                  ▶
                </Text>

                <View style={styles.questionContent}>
                  <Text
                    style={[
                      styles.questionNumber,
                      isSelected && styles.questionNumberSelected,
                    ]}
                  >
                    0{index + 1}
                  </Text>

                  <Text
                    style={[
                      styles.questionText,
                      isSelected && styles.questionTextSelected,
                    ]}
                  >
                    {question.text}
                  </Text>
                </View>
              </Pressable>
            )
          })}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          TAP A QUESTION TO INTERROGATE
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: scaleSpacing(16),
    right: scaleSpacing(16),
    top: '20%',
    bottom: '18%',

    backgroundColor: '#e8dfc3',

    borderWidth: 4,
    borderColor: '#080808',

    padding: 5,

    zIndex: 80,

    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 12,
  },

  overlayWide: {
    left: '18%',
    right: '18%',
    top: '18%',
    bottom: '22%',
  },

  header: {
    backgroundColor: '#1a1a1a',

    borderBottomWidth: 3,
    borderBottomColor: '#080808',

    paddingHorizontal: scaleSpacing(14),
    paddingVertical: scaleSpacing(10),
  },

  headerText: {
    color: '#f2e8c9',

    fontSize: scaleFontSize(14),
    fontWeight: '900',

    letterSpacing: 1,
  },

  headerSubText: {
    color: '#9e9a8e',

    fontSize: scaleFontSize(8),

    fontWeight: 'bold',

    marginTop: 3,

    letterSpacing: 1,
  },

  menu: {
    flex: 1,

    borderWidth: 2,
    borderColor: '#4b463c',

    marginTop: 4,

    backgroundColor: '#d9d0b5',
  },

  menuContent: {
    paddingVertical: scaleSpacing(8),
  },

  questionRow: {
    flexDirection: 'row',

    alignItems: 'center',

    minHeight: 60,

    paddingHorizontal: scaleSpacing(10),

    marginHorizontal: 4,

    marginVertical: 2,

    borderWidth: 2,
    borderColor: 'transparent',
  },

  questionRowSelected: {
    backgroundColor: '#2b2b2b',

    borderColor: '#080808',
  },

  questionPressed: {
    transform: [{ scale: 0.98 }],
  },

  selector: {
    width: 24,

    color: '#f2d06b',

    fontSize: scaleFontSize(14),

    fontWeight: '900',
  },

  selectorHidden: {
    opacity: 0,
  },

  questionContent: {
    flex: 1,

    flexDirection: 'row',

    alignItems: 'center',

    gap: scaleSpacing(10),
  },

  questionNumber: {
    color: '#5b5549',

    fontSize: scaleFontSize(10),

    fontWeight: '900',

    width: 28,
  },

  questionNumberSelected: {
    color: '#f2d06b',
  },

  questionText: {
    flex: 1,

    color: '#222',

    fontSize: scaleFontSize(13),

    fontWeight: '700',

    lineHeight: scaleFontSize(18),
  },

  questionTextSelected: {
    color: '#f5eed9',
  },

  footer: {
    backgroundColor: '#1a1a1a',

    marginTop: 4,

    paddingVertical: scaleSpacing(6),

    alignItems: 'center',
  },

  footerText: {
    color: '#9e9a8e',

    fontSize: scaleFontSize(8),

    fontWeight: 'bold',

    letterSpacing: 1,
  },
})