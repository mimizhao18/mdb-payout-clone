/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://unistyl.es/), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/** ModeMobile brand palette, taken from the Figma "Hifi" screens. */
export const Brand = {
  blue: '#2B73E8',
  /** purple-600: primary CTA buttons and accents. */
  purple: '#7E2DD8',
  /** purple-700: the small "Claim" buttons. */
  purpleDark: '#642AD0',
  /** purple-800 → purple-500 make up the banner and wallet-card gradient. */
  gradientStart: '#4A27C9',
  gradientEnd: '#8E2EDF',
  progress: '#5129CB',
  purpleLink: '#6750A4',
  purpleSoft: '#EDE4FB',
  surface: '#F7F9F8',
  card: '#FFFFFF',
  chip: 'rgba(232,236,239,0.54)',
  chipActive: '#6C757E',
  ink: '#000000',
  inkSoft: '#2C3E50',
  muted: '#6C757E',
  mutedLight: '#737E86',
  heading: '#555970',
  border: '#E5E7EB',
  track: '#EFEFEF',
  claimed: '#00B451',
  noProofBg: '#E4F6E7',
  noProofFg: '#00AA34',
  uncappedBg: '#FFF3C7',
  uncappedFg: '#C18300',
  uncappedIcon: '#E5A100',
  dotPending: '#FFAD10',
  dotSent: '#00AA34',
  dotClosed: '#FD0400',
  link: '#027FFF',
  buttonGrey: '#E7ECEE',
  pillGrey: '#F1F2F6',
  white: '#FFFFFF',
} as const;

/** Shared card shadows from the Figma effects. */
export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  bar: {
    shadowColor: '#000',
    shadowOpacity: 0.09,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
