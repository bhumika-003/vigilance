import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native'
import { useEffect, useRef } from 'react'
import {
  scaleFontSize,
  scaleSpacing,
} from '../utils/responsive'

type ImpactBeatProps = {
  text: string
  onComplete?: () => void
}

export function ImpactBeat({
  text,
  onComplete,
}: ImpactBeatProps) {
  const scale = useRef(new Animated.Value(0.4)).current
  const opacity = useRef(new Animated.Value(0)).current
  const translateX = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(20)).current
  const flashOpacity = useRef(new Animated.Value(0)).current

  const getFeedbackType = () => {
    const message = text.toLowerCase()

    if (
      message.includes('sharp') ||
      message.includes('correct') ||
      message.includes('weak')
    ) {
      return 'success'
    }

    if (
      message.includes('miss') ||
      message.includes('wrong') ||
      message.includes('fail')
    ) {
      return 'failure'
    }

    if (
      message.includes('contradiction') ||
      message.includes('defensive') ||
      message.includes('pressure')
    ) {
      return 'warning'
    }

    return 'neutral'
  }

  const feedbackType = getFeedbackType()

  const config = {
    success: {
      label: '✓',
      title: text.toUpperCase(),
      subtitle: 'TACTICAL ADVANTAGE GAINED',
    },

    failure: {
      label: '✕',
      title: text.toUpperCase(),
      subtitle: 'THE LEAD HAS GONE COLD',
    },

    warning: {
      label: '!',
      title: text.toUpperCase(),
      subtitle: 'WITNESS RESPONSE CHANGED',
    },

    neutral: {
      label: '•',
      title: text.toUpperCase(),
      subtitle: 'NEW INFORMATION RECEIVED',
    },
  }[feedbackType]

  useEffect(() => {
    scale.setValue(0.4)
    opacity.setValue(0)
    translateX.setValue(0)
    translateY.setValue(20)
    flashOpacity.setValue(0)

    const shake = Animated.sequence([
      Animated.timing(translateX, {
        toValue: -10,
        duration: 45,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 10,
        duration: 45,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: -6,
        duration: 45,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 6,
        duration: 45,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 45,
        useNativeDriver: true,
      }),
    ])

    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          tension: 100,
          useNativeDriver: true,
        }),

        Animated.timing(opacity, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),

        Animated.timing(translateY, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),

        Animated.sequence([
          Animated.timing(flashOpacity, {
            toValue: 0.45,
            duration: 80,
            useNativeDriver: true,
          }),

          Animated.timing(flashOpacity, {
            toValue: 0,
            duration: 220,
            useNativeDriver: true,
          }),
        ]),
      ]),

      shake,

      Animated.delay(700),

      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1.15,
          duration: 200,
          useNativeDriver: true,
        }),

        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onComplete?.()
    })
  }, [text])

  return (
    <View pointerEvents="none" style={styles.container}>
      {/* Screen flash */}
      <Animated.View
        style={[
          styles.flash,
          { opacity: flashOpacity },
        ]}
      />

      {/* Tactical feedback */}
      <Animated.View
        style={[
          styles.feedbackBox,
          {
            opacity,
            transform: [
              { translateX },
              { translateY },
              { scale },
            ],
          },
        ]}
      >
        <View
          style={[
            styles.iconBox,
            feedbackType === 'success' && styles.successBox,
            feedbackType === 'failure' && styles.failureBox,
            feedbackType === 'warning' && styles.warningBox,
          ]}
        >
          <Text style={styles.icon}>
            {config.label}
          </Text>
        </View>

        <View style={styles.messageContent}>
          <Text style={styles.title}>
            {config.title}
          </Text>

          <Text style={styles.subtitle}>
            {config.subtitle}
          </Text>
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },

  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f2e8c9',
  },

  feedbackBox: {
    width: '82%',
    minHeight: 80,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#17191d',

    borderWidth: 4,
    borderColor: '#050505',

    padding: scaleSpacing(10),

    shadowColor: '#000',
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 20,
  },

  iconBox: {
    width: 54,
    height: 54,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#3f4650',

    borderWidth: 3,
    borderColor: '#090909',

    marginRight: scaleSpacing(10),
  },

  successBox: {
    backgroundColor: '#3f7d5d',
  },

  failureBox: {
    backgroundColor: '#8a4242',
  },

  warningBox: {
    backgroundColor: '#9a7535',
  },

  icon: {
    color: '#f5eed9',

    fontSize: scaleFontSize(28),

    fontWeight: '900',
  },

  messageContent: {
    flex: 1,
  },

  title: {
    color: '#f5eed9',

    fontSize: scaleFontSize(16),

    fontWeight: '900',

    letterSpacing: 1,
  },

  subtitle: {
    color: '#9fa6ad',

    fontSize: scaleFontSize(9),

    fontWeight: 'bold',

    marginTop: 4,

    letterSpacing: 0.8,
  },
})