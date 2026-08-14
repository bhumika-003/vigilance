import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';

export type VerdictType = 'TRUE' | 'FALSE' | 'MISLEADING' | 'UNVERIFIED';

interface VerdictCardProps {
  verdict: VerdictType;
  explanation?: string;
}

const VERDICT_CONFIG = {
  TRUE: {
    label: 'TRUE',
    color: '#2E7D32',
    backgroundColor: '#E8F5E9',
  },
  FALSE: {
    label: 'FALSE',
    color: '#D32F2F',
    backgroundColor: '#FFEBEE',
  },
  MISLEADING: {
    label: 'MISLEADING',
    color: '#ED6C02',
    backgroundColor: '#FFF3E0',
  },
  UNVERIFIED: {
    label: 'UNVERIFIED',
    color: '#0288D1',
    backgroundColor: '#E0F7FA',
  },
};

export const VerdictCard = ({ verdict, explanation }: VerdictCardProps) => {
  const config = VERDICT_CONFIG[verdict];

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 12 }}
      style={[styles.card, { backgroundColor: config.backgroundColor }]}
    >
      <View style={[styles.badge, { backgroundColor: config.color }]}>
        <Text style={styles.badgeText}>{config.label}</Text>
      </View>

      {explanation ? (
        <MotiView
          from={{ opacity: 0, translateY: 5 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 300, delay: 200 }}
        >
          <Text style={styles.explanationText}>{explanation}</Text>
        </MotiView>
      ) : null}
    </MotiView>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  explanationText: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 6,
  },
});