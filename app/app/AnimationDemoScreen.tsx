import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BrainMascot, BrainExpression } from '../components/BrainMascot';

export function AnimationDemoScreen() {
  const [score, setScore] = useState(0);
  const [expression, setExpression] = useState<BrainExpression>('idle');
  const [customMsg, setCustomMsg] = useState('');

  const handleCorrect = () => {
    setScore((prev) => prev + 10);
    setExpression('happy');
    setCustomMsg('Awesome! +10 Points!');
  };

  const handleWrong = () => {
    setExpression('sad');
    setCustomMsg('Not quite! Try again!');
  };

  const handleCombo = () => {
    setScore((prev) => prev + 50);
    setExpression('excited');
    setCustomMsg('5 STREAK! YOU ARE ON FIRE!');
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>MIL App Quiz Gameplay</Text>
      <Text style={styles.subtitle}>Tap the buttons below to test the brain mascot:</Text>

      {/* Game Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.btn, styles.btnSuccess]} onPress={handleCorrect}>
          <Text style={styles.btnText}>✅ Correct Answer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.btnDanger]} onPress={handleWrong}>
          <Text style={styles.btnText}>❌ Wrong Answer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.btnCombo]} onPress={handleCombo}>
          <Text style={styles.btnText}>🔥 Big Combo!</Text>
        </TouchableOpacity>
      </View>

      {/* The Brain Mascot floating in the bottom-right corner */}
      <BrainMascot 
        score={score} 
        expression={expression} 
        message={customMsg} 
        position="right" 
      />
    </View>
  );
}

export default AnimationDemoScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
    gap: 12,
  },
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnSuccess: { backgroundColor: '#10B981' },
  btnDanger: { backgroundColor: '#EF4444' },
  btnCombo: { backgroundColor: '#8B5CF6' },
  btnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});