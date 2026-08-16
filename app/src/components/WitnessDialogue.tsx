import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { scaleFontSize, scaleSpacing, getResponsiveBorderRadius, getLineHeight } from '../utils/responsive'

type WitnessDialogueProps = {
  text: string
  onAdvance: () => void
}

const baseTextFontSize = 14

const styles = StyleSheet.create({
  bubbleContainer: {
    marginVertical: scaleSpacing(12),
    marginRight: scaleSpacing(40),
    alignItems: 'flex-start',
  },
  speechBubble: {
    backgroundColor: '#3d5c7c',
    borderRadius: 20,
    padding: scaleSpacing(14),
    borderWidth: 2,
    borderColor: '#5a7fa0',
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
  tail: {
    position: 'absolute',
    bottom: scaleSpacing(8),
    left: -scaleSpacing(8),
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeftColor: '#3d5c7c',
    borderLeftWidth: scaleSpacing(12),
    borderTopColor: '#3d5c7c',
    borderTopWidth: scaleSpacing(8),
    borderBottomColor: 'transparent',
    borderBottomWidth: scaleSpacing(4),
    borderRightColor: 'transparent',
    borderRightWidth: 0,
  },
  text: {
    fontSize: scaleFontSize(baseTextFontSize),
    color: '#e8f4f8',
    lineHeight: getLineHeight(scaleFontSize(baseTextFontSize)),
    fontWeight: '400',
  },
  continueIndicator: {
    color: '#a0c8e0',
    fontSize: scaleFontSize(12),
    marginTop: scaleSpacing(6),
    fontWeight: '500',
  },
})

export function WitnessDialogue({ text, onAdvance }: WitnessDialogueProps) {
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
    <Pressable onPress={handlePress} style={styles.bubbleContainer}>
      <View style={styles.speechBubble}>
        <Text style={styles.text}>{displayText}</Text>
        {!isTyping && <Text style={styles.continueIndicator}>▾ Tap to continue</Text>}
      </View>
      <View style={styles.tail} />
    </Pressable>
  )
}
