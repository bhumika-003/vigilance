import { AppFonts, Palette } from '@/constants/theme';
import { Pressable, PressableProps, StyleSheet, Text } from 'react-native';

type AppButtonProps = PressableProps & {
  title: string;
  variant?: 'primary' | 'secondary';
};

export function AppButton({ title, variant = 'primary', style, ...rest }: AppButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        pressed && { opacity: 0.8 },
      ]}
      {...rest}
    >
      <Text style={[styles.text, isPrimary ? styles.textPrimary : styles.textSecondary]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: Palette.indigo,
  },
  secondary: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: Palette.indigo,
  },
  text: {
    fontFamily: AppFonts.headingMedium,
    fontSize: 16,
  },
  textPrimary: {
    color: '#fff',
  },
  textSecondary: {
    color: Palette.indigo,
  },
});