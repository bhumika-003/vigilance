import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native'
import { useEffect, useRef } from 'react'
import { scaleFontSize, scaleSpacing, getResponsiveBorderRadius, getScreenDimensions } from '../utils/responsive'

type CaseTransitionProps = {
  active: boolean
  caseNumber: number
  title: string
  onComplete?: () => void
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  card: {
    backgroundColor: '#2a2a2a',
    paddingVertical: scaleSpacing(40),
    paddingHorizontal: scaleSpacing(30),
    borderRadius: getResponsiveBorderRadius(),
    alignItems: 'center',
  },
  caseNumber: {
    fontSize: scaleFontSize(14),
    color: '#74c6a0',
    fontWeight: '600',
    marginBottom: scaleSpacing(12),
    textTransform: 'uppercase',
  },
  title: {
    fontSize: scaleFontSize(24),
    color: '#fff',
    fontWeight: 'bold',
  },
})

export function CaseTransition({ active, caseNumber, title, onComplete }: CaseTransitionProps) {
  const { width } = getScreenDimensions()
  const opacityAnim = useRef(new Animated.Value(0)).current
  const translateXAnim = useRef(new Animated.Value(-width)).current

  useEffect(() => {
    if (active) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateXAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateXAnim, {
          toValue: width,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start(() => onComplete?.())
    }
  }, [active])

  if (!active) return null

  return (
    <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ translateX: translateXAnim }],
          },
        ]}
      >
        <Text style={styles.caseNumber}>Case {caseNumber}</Text>
        <Text style={styles.title}>{title}</Text>
      </Animated.View>
    </Animated.View>
  )
}
