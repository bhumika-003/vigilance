import { Animated, View, Text, StyleSheet, Dimensions } from 'react-native'
import { useEffect, useRef } from 'react'
import { scaleFontSize } from '../utils/responsive'

type ImpactBeatProps = {
  active: boolean
  label: string
  color: string
  intensity: 'sharp' | 'weak'
  onComplete?: () => void
}

const styles = StyleSheet.create({
  beatRoot: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  flash: {
    ...StyleSheet.absoluteFillObject,
  },
  textWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  text: {
    fontSize: scaleFontSize(28),
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
})

export function ImpactBeat({ active, label, color, intensity, onComplete }: ImpactBeatProps) {
  const opacityAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.2)).current
  const rotateAnim = useRef(new Animated.Value(-8)).current
  const shakeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (active) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.25,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 8,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -6,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 6,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onComplete?.())
    }
  }, [active])

  if (!active) return null

  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [-8, 0],
    outputRange: ['-8deg', '0deg'],
  })

  return (
    <Animated.View style={[styles.beatRoot, { opacity: opacityAnim }]}>
      <Animated.View
        style={[
          styles.flash,
          {
            backgroundColor: color,
            opacity: intensity === 'sharp' ? opacityAnim : opacityAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.4],
            }),
          },
        ]}
      />

      <Animated.View
        style={[
          styles.textWrap,
          {
            transform: [
              { scale: scaleAnim },
              { rotate: rotateInterpolation },
              { translateX: shakeAnim },
            ],
          },
        ]}
      >
        <Text style={styles.text}>{label}</Text>
      </Animated.View>
    </Animated.View>
  )
}
