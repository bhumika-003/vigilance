import { Palette } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';

type AppProgressBarProps = {
  progress: number; // 0 to 1
  color?: string;
};

export function AppProgressBar({ progress, color = Palette.green }: AppProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, progress));

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${clamped * 100}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 10,
    borderRadius: 6,
    backgroundColor: '#E4E2F5',
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: 6,
  },
});