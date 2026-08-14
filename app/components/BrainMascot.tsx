import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export type BrainExpression = 'idle' | 'happy' | 'sad' | 'excited';

interface BrainMascotProps {
  score?: number;
  expression?: BrainExpression;
  message?: string;
  position?: 'left' | 'right';
}

export const BrainMascot = ({
  score = 0,
  expression = 'idle',
  message,
  position = 'right',
}: BrainMascotProps) => {
  const slideAnim = useRef(new Animated.Value(120)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const expressionsConfig: Record<BrainExpression, { face: string; defaultMsg: string }> = {
    idle: { face: '🧠💭', defaultMsg: "I'm ready! Let's go!" },
    happy: { face: '🧠✨', defaultMsg: 'Nice! Great job!' },
    sad: { face: '🧠💧', defaultMsg: 'Oops! Don’t give up!' },
    excited: { face: '🧠🎉', defaultMsg: 'Unstoppable!! 🔥' },
  };

  const currentConfig = expressionsConfig[expression] || expressionsConfig.idle;
  const activeMessage = message || currentConfig.defaultMsg;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

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
      <View style={styles.bubble}>
        <Text style={styles.bubbleText}>{activeMessage}</Text>
      </View>

      <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
        <Text style={styles.avatarEmoji}>{currentConfig.face}</Text>
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
    bottom: 70,
    alignItems: 'center',
    zIndex: 999,
  },
  bubble: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    marginBottom: 6,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  bubbleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  avatarEmoji: {
    fontSize: 48,
  },
  scoreBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
});