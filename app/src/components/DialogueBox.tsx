import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { scaleFontSize, scaleSpacing, getResponsiveBorderRadius, getLineHeight } from '../utils/responsive'

type DialogueBoxProps = {
  speaker: string
  text: string
  onAdvance: () => void
}

const baseNameFontSize = 12
const baseTextFontSize = 16
const baseLineHeight = 24

const styles = StyleSheet.create({
  dialogueShell: {
    backgroundColor: '#2a2a2a',
    borderRadius: getResponsiveBorderRadius(),
    padding: scaleSpacing(16),
    borderLeftWidth: 4,
    borderLeftColor: '#74c6a0',
  },
  namePlate: {
    fontSize: scaleFontSize(baseNameFontSize),
    color: '#74c6a0',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: scaleSpacing(8),
  },
  textBox: {
    minHeight: scaleSpacing(60),
  },
  text: {
    fontSize: scaleFontSize(baseTextFontSize),
    color: '#e0e0e0',
    lineHeight: getLineHeight(scaleFontSize(baseTextFontSize)),
    fontWeight: '400',
  },
  continueChevron: {
    color: '#74c6a0',
    fontSize: scaleFontSize(18),
    marginTop: scaleSpacing(12),
    fontWeight: 'bold',
  },
})

export function DialogueBox({ speaker, text, onAdvance }: DialogueBoxProps) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    setDisplayText('')
    setIsTyping(true)

    let index = 0
    const interval = setInterval(() => {
      index += 1
      setDisplayText(text.slice(0, index))

      if (index >= text.length) {
        clearInterval(interval)
        setIsTyping(false)
      }
    }, 18)

    return () => clearInterval(interval)
  }, [text])

  const handlePress = () => {
    if (isTyping) {
      setDisplayText(text)
      setIsTyping(false)
      return
    }

    onAdvance()
  }

  return (
    <Pressable onPress={handlePress} style={styles.dialogueShell}>
      <Text style={styles.namePlate}>{speaker}</Text>
      <View style={styles.textBox}>
        <Text style={styles.text}>{displayText}</Text>
        {!isTyping && (
          <Text style={styles.continueChevron}>▾</Text>
        )}
      </View>
    </Pressable>
  )
}
