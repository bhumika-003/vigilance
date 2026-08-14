import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';

const CHECK_STEPS = [
  'Extracting claim details...',
  'Searching verified sources...',
  'Analyzing context & facts...',
  'Generating vigilance report...',
];

interface ClaimCheckProgressProps {
  onComplete?: () => void;
  intervalMs?: number;
}

export const ClaimCheckProgress = ({
  onComplete,
  intervalMs = 2000,
}: ClaimCheckProgressProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (currentStepIndex < CHECK_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, intervalMs);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      const completeTimer = setTimeout(() => {
        onComplete();
      }, intervalMs);

      return () => clearTimeout(completeTimer);
    }
  }, [currentStepIndex, intervalMs, onComplete]);

  return (
    <View style={styles.container}>
      <AnimatePresence exitBeforeEnter>
        <MotiView
          key={currentStepIndex}
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: -10 }}
          transition={{ type: 'timing', duration: 400 }}
          style={styles.textWrapper}
        >
          <Text style={styles.stepText}>{CHECK_STEPS[currentStepIndex]}</Text>
        </MotiView>
      </AnimatePresence>

      {/* Animated Pulse Indicator */}
      <MotiView
        from={{ scale: 0.8, opacity: 0.5 }}
        animate={{ scale: 1.2, opacity: 1 }}
        transition={{
          type: 'timing',
          duration: 800,
          loop: true,
        }}
        style={styles.pulseDot}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  textWrapper: {
    marginBottom: 16,
  },
  stepText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  pulseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
});