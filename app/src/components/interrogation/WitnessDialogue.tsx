import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native'
import { useEffect, useRef, useState } from 'react'
import {
  getScreenDimensions,
  scaleFontSize,
  scaleSpacing,
} from '../../utils/responsive'

type WitnessDialogueProps = {
  text: string
  onAdvance: () => void
  speaker?: string
}

export function WitnessDialogue({
  text,
  onAdvance,
  speaker = 'WITNESS',
}: WitnessDialogueProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  const arrowOpacity = useRef(new Animated.Value(1)).current

  const { width } = getScreenDimensions()
  const isWideScreen = width >= 768

  useEffect(() => {
    setDisplayedText('')
    setIsComplete(false)

    let index = 0

    const interval = setInterval(() => {
      index++

      setDisplayedText(text.slice(0, index))

      if (index >= text.length) {
        clearInterval(interval)
        setIsComplete(true)
      }
    }, 25)

    return () => clearInterval(interval)
  }, [text])

  useEffect(() => {
    if (!isComplete) {
      arrowOpacity.setValue(0)
      return
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(arrowOpacity, {
          toValue: 0.25,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(arrowOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    )

    animation.start()

    return () => animation.stop()
  }, [isComplete])

  const handlePress = () => {
    if (!isComplete) {
      setDisplayedText(text)
      setIsComplete(true)
      return
    }

    onAdvance()
  }

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.wrapper,
        isWideScreen && styles.wrapperWide,
      ]}
    >
      {/* Speaker name */}
      <View style={styles.nameTag}>
        <Text style={styles.nameText}>
          {speaker}
        </Text>
      </View>

      {/* Main dialogue box */}
      <View style={styles.dialogueBox}>
        {/* Inner pixel border */}
        <View style={styles.innerBorder}>
          <Text style={styles.dialogueText}>
            {displayedText}
          </Text>

          {isComplete && (
            <Animated.Text
              style={[
                styles.arrow,
                {
                  opacity: arrowOpacity,
                },
              ]}
            >
              ▼
            </Animated.Text>
          )}
        </View>
      </View>

      <Text style={styles.hint}>
        {isComplete
          ? 'TAP TO CONTINUE'
          : 'TAP TO SKIP'}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: scaleSpacing(12),
    right: scaleSpacing(12),
    bottom: scaleSpacing(12),
    zIndex: 100,
  },

  wrapperWide: {
    left: '8%',
    right: '8%',
    bottom: scaleSpacing(20),
  },

  nameTag: {
    alignSelf: 'flex-start',

    backgroundColor: '#1a1a1a',

    borderWidth: 3,
    borderColor: '#050505',

    paddingHorizontal: scaleSpacing(10),
    paddingVertical: scaleSpacing(4),

    marginLeft: scaleSpacing(10),

    zIndex: 2,
  },

  nameText: {
    color: '#f2e8c9',

    fontSize: scaleFontSize(11),
    fontWeight: '900',

    letterSpacing: 1.5,
  },

  dialogueBox: {
    backgroundColor: '#e8dfc3',

    borderWidth: 4,
    borderColor: '#080808',

    padding: 4,

    minHeight: 120,

    shadowColor: '#000',
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 10,
  },

  innerBorder: {
    flex: 1,

    minHeight: 104,

    borderWidth: 2,
    borderColor: '#4b463c',

    paddingHorizontal: scaleSpacing(16),
    paddingVertical: scaleSpacing(14),

    justifyContent: 'center',
  },

  dialogueText: {
    color: '#181818',

    fontSize: scaleFontSize(16),
    fontWeight: '600',

    lineHeight: scaleFontSize(24),

    paddingRight: 20,
  },

  arrow: {
    position: 'absolute',

    right: scaleSpacing(12),
    bottom: scaleSpacing(8),

    fontSize: scaleFontSize(14),

    color: '#111',
  },

  hint: {
    alignSelf: 'flex-end',

    marginTop: 4,
    marginRight: 6,

    color: '#aaa',

    fontSize: scaleFontSize(8),

    fontWeight: 'bold',

    letterSpacing: 1,
  },
})