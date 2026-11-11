import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Brand } from '@/constants/theme';

/**
 * The purple card gradient from Figma: purple-800 (#4A27C9) at 0.65% to
 * purple-500 (#8E2EDF) at 97.4%. `tilt` is the vertical drift of the gradient
 * line (Figma uses ~106° on the banner and ~99° on the wallet card).
 */
export function GradientCard({
  children,
  style,
  tilt = 0.3,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  tilt?: number;
}) {
  return (
    <LinearGradient
      colors={[Brand.gradientStart, Brand.gradientEnd]}
      locations={[0.0065, 0.974]}
      start={{ x: 0, y: 0.5 - tilt / 2 }}
      end={{ x: 1, y: 0.5 + tilt / 2 }}
      style={[styles.card, style]}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 15, overflow: 'hidden' },
});
