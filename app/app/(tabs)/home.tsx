import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DynamicMascot, MascotMood } from '../../components/DynamicMascot';
import { Palette } from '@/constants/theme';

export default function HomeScreen() {
  const [mood, setMood] = useState<MascotMood>('neutral');
  const [score, setScore] = useState(100);

  // Automatic state switcher based on player game events
  const handleGameAction = (actionType: 'win' | 'lose' | 'caught') => {
    if (actionType === 'win') {
      setMood('happy');
      setScore((prev) => prev + 10);
    } else if (actionType === 'lose') {
      setMood('sad');
      setScore((prev) => Math.max(0, prev - 15));
    } else if (actionType === 'caught') {
      setMood('shocked');
      setScore((prev) => Math.max(0, prev - 25));
    }

    // Automatically revert to neutral state after 3 seconds
    setTimeout(() => {
      setMood('neutral');
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vigilance Home Tab</Text>
      <Text style={styles.subtitle}>Drag the brain mascot with your cursor!</Text>

      {/* Control panel simulating in-game user actions */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: Palette.periwinkle }]}
          onPress={() => handleGameAction('win')}
        >
          <Text style={styles.btnText}>Correct Answer (+10)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: Palette.pink }]}
          onPress={() => handleGameAction('lose')}
        >
          <Text style={styles.btnText}>Wrong Answer (-15)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: '#D69B36' }]}
          onPress={() => handleGameAction('caught')}
        >
          <Text style={styles.btnText}>Trigger Shocked / Caught</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: '#68702C' }]}
          onPress={() => setMood('neutral')}
        >
          <Text style={styles.btnText}>Reset to Neutral</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Draggable Mascot Component */}
      <DynamicMascot mood={mood} score={score} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Palette.olive,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.cream,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Palette.creamMuted,
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 280,
    gap: 10,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
