import { Palette } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

type AppHeartsProps = {
  total: number;
  filled: number;
};

export function AppHearts({ total, filled }: AppHeartsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <Text key={i} style={[styles.heart, { color: i < filled ? Palette.coral : '#E4E2F5' }]}>
          ♥
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
  },
  heart: {
    fontSize: 22,
  },
});