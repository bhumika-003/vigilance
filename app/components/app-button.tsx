import { Pressable, Text, StyleSheet, PressableProps } from 'react-native';
import { Palette, AppFonts } from '@/constants/theme';

type AppButtonProps = PressableProps & {
  title: string;
  variant?: 'primary' | 'secondary';
  color?: string;
};

export function AppButton({ title, variant = 'primary', color, style, ...rest }: AppButtonProps) {
  const isPrimary = variant === 'primary';
  const bgColor = color ?? Palette.indigo;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        isPrimary ? { backgroundColor: bgColor } : { backgroundColor: '#fff', borderWidth: 2, borderColor: bgColor },
        pressed && { opacity: 0.8 },
      ]}
      {...rest}
    >
      <Text style={[styles.text, { color: isPrimary ? '#fff' : bgColor }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  text: { fontFamily: AppFonts.headingMedium, fontSize: 16 },
});