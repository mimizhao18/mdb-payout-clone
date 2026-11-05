import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Brand } from '@/constants/theme';

/** "mode mobile" wordmark, drawn with text so no image asset is needed. */
export function ModeLogo({ size = 28, light = false }: { size?: number; light?: boolean }) {
  const letters = [
    { c: 'm', color: '#DB2777' },
    { c: 'o', color: '#9333EA' },
    { c: 'd', color: '#7C3AED' },
    { c: 'e', color: '#06B6D4' },
  ];
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: size, fontWeight: '600', letterSpacing: -0.5 }}>
        {letters.map((l) => (
          <Text key={l.c} style={{ color: l.color }}>
            {l.c}
          </Text>
        ))}
      </Text>
      <Text
        style={{
          fontSize: size * 0.42,
          marginTop: -size * 0.12,
          color: light ? Brand.white : Brand.muted,
        }}>
        mobile
      </Text>
    </View>
  );
}

export function BrandBadge({
  letter,
  color,
  size = 56,
  style,
}: {
  letter: string;
  color: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: Brand.white,
        },
        style,
      ]}>
      <Text style={{ color: Brand.white, fontWeight: '800', fontSize: size * 0.42 }}>{letter}</Text>
    </View>
  );
}

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'white' | 'purple' | 'soft';
  style?: StyleProp<ViewStyle>;
};

export function PillButton({ label, onPress, variant = 'white', style }: ButtonProps) {
  const palette = {
    white: { bg: Brand.white, fg: Brand.purple },
    purple: { bg: Brand.purple, fg: Brand.white },
    soft: { bg: Brand.chip, fg: Brand.inkSoft },
  }[variant];
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        { backgroundColor: palette.bg, opacity: pressed ? 0.8 : 1 },
        style,
      ]}>
      <Text style={[styles.pillLabel, { color: palette.fg }]}>{label}</Text>
    </Pressable>
  );
}

export function SmallButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.small, { opacity: pressed ? 0.8 : 1 }]}>
      <Text style={styles.smallLabel}>{label}</Text>
    </Pressable>
  );
}

export function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      onPress={onPress}
      style={[styles.chip, active && { backgroundColor: Brand.chipActive }]}>
      <Text style={[styles.chipLabel, active && { color: Brand.white }]}>{label}</Text>
    </Pressable>
  );
}

export function Tag({ kind }: { kind: 'no-proof' | 'uncapped' }) {
  const noProof = kind === 'no-proof';
  return (
    <Text style={[styles.tag, { color: noProof ? Brand.green : Brand.amber }]}>
      {noProof ? 'No proof ✓' : 'Uncapped ●'}
    </Text>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  pillLabel: { fontSize: 16, fontWeight: '700' },
  small: {
    backgroundColor: Brand.purpleDark,
    borderRadius: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  smallLabel: { color: Brand.white, fontSize: 15, fontWeight: '600' },
  chip: {
    backgroundColor: Brand.chip,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chipLabel: { color: Brand.muted, fontSize: 14, fontWeight: '600' },
  tag: { fontSize: 11, fontWeight: '700' },
});
