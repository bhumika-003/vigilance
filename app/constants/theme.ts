/**
 * VIGILANCE app palette: indigo / gold / coral / green
 * Typography: Poppins (headings), Lora (body text)
 */

import { Platform } from 'react-native';

// Your team's brand palette
export const Palette = {
  indigo: '#4B3FA0',   // primary brand color, buttons, active states
  gold: '#F4B400',     // accent, highlights, streak flame
  coral: '#FF6F59',    // danger/wrong answers, hearts lost
  green: '#2ECC71',    // success/correct answers
};

const tintColorLight = Palette.indigo;
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// App-specific typography (Poppins for headings, Lora for body)
export const AppFonts = {
  heading: 'Poppins_700Bold',
  headingMedium: 'Poppins_600SemiBold',
  body: 'Lora_400Regular',
  bodyBold: 'Lora_700Bold',
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});


