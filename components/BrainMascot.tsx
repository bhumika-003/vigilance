import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export type BrainExpression = 'idle' | 'happy' | 'sad' | 'excited';

interface BrainMascotProps {
  score: number;
  expression: BrainExpression;
  message?: string;
  position?: 'left' | 'right';
}

export const BrainMascot = ({
  score = 0,
  expression = 'idle',
  message,
  position = 'right',
}: BrainMascotProps) => {
  // Animation refs
  const slideAnim = useRef(new Animated.Value(120)).current; // Slide in from bottom
  const bounceAnim = useRef(new Animated.Value(1)).current;  // Reaction bounce

  // Character expressions configuration
  const expressionsConfig: Record<BrainExpression, { face: string; defaultMsg: string; color: string }> = {
    idle: { face: '🧠💭', defaultMsg: "I'm ready! Let's go!", color: '#4A90E2' },
    happy: { face: '🧠✨', defaultMsg: 'Nice! Great job!', color: '#2ECC71' },
    sad: { face: '🧠💧', defaultMsg: 'Oops! Don’t give up!', color: '#E74C3C' },
    excited: { face: '🧠🎉', defaultMsg: 'Unstoppable!! 🔥', color: '#F1C40F' },
  };

  const currentConfig = expressionsConfig[expression] || expressionsConfig.idle;
  const activeMessage = message || currentConfig.defaultMsg;

  // Slide-in on initial load
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  // Pop/Bounce when expression or score changes
  useEffect(() => {
    Animated.sequence([
      Animated.timing(bounceAnim, { toValue: 1.25, duration: 120, useNativeDriver: true }),
      Animated.spring(bounceAnim, { toValue: 1, friction: 3, tension: 100, useNativeDriver: true }),
    ]).start();
  }, [expression, score, message]);

  return (
    <Animated.View
      style={[
        styles.container,
        position === 'right' ? { right: 20 } : { left: 20 },
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* Speech Bubble */}
      <View style={styles.bubble}>
        <Text style={styles.bubbleText}>{activeMessage}</Text>
        <View style={[styles.bubbleTail, position === 'right' ? { right: 25 } : { left: 25 }]} />
      </View>

      {/* Mascot & Score Badge Container */}
      <Animated.View style={[styles.avatarWrapper, { transform: [{ scale: bounceAnim }] }]}>
        <Text style={styles.avatarEmoji}>{currentConfig.face}</Text>

        {/* Dynamic Score Counter */}
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>⭐ {score}</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 25,
    alignItems: 'center',
    zIndex: 999,
  },
  bubble: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    maxWidth: 180,
  },
  bubbleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },
  avatarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 52,
  },
  scoreBadge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#F1C40F',
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});