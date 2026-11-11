import { Image, type ImageSource } from 'expo-image';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Brand, Shadow } from '@/constants/theme';

/** A `require()`d asset (number) or an expo-image source object. */
type AssetSource = ImageSource | number;

/** Large "mode mobile" wordmark drawn with text, used on the blue onboarding screens. */
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

/** The logo image used in the white app headers (68 × 28 in Figma). */
export function LogoImage() {
  return (
    <Image
      source={require('@/assets/images/mode/logo.png')}
      contentFit="contain"
      style={{ width: 68, height: 28 }}
      accessibilityLabel="ModeMobile"
    />
  );
}

/** Round white brand icon used on the onboarding and paywall screens. */
export function BrandBubble({
  source,
  size = 93,
  style,
}: {
  source: AssetSource;
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
          backgroundColor: Brand.white,
          overflow: 'hidden',
        },
        style,
      ]}>
      <Image source={source} contentFit="cover" style={{ width: size, height: size }} />
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

/** Square thumbnail shown beside a settlement. */
export function Thumb({ source, size = 45, radius = 5 }: { source: AssetSource; size?: number; radius?: number }) {
  return (
    <Image
      source={source}
      contentFit="cover"
      style={{ width: size, height: size, borderRadius: radius }}
    />
  );
}

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'white' | 'purple' | 'soft';
  style?: StyleProp<ViewStyle>;
};

/** Large rounded CTA from the onboarding and paywall screens (radius 50, 20pt semibold). */
export function PillButton({ label, onPress, variant = 'white', style }: ButtonProps) {
  const palette = {
    white: { bg: Brand.white, fg: Brand.purple },
    purple: { bg: Brand.purple, fg: Brand.white },
    soft: { bg: Brand.buttonGrey, fg: Brand.ink },
  }[variant];
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        { backgroundColor: palette.bg, opacity: pressed ? 0.85 : 1 },
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
      style={({ pressed }) => [styles.small, { opacity: pressed ? 0.85 : 1 }]}>
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

/** Pill badge: green "No proof ✓" or amber "Uncapped ★". */
export function Tag({ kind, large = false }: { kind: 'no-proof' | 'uncapped'; large?: boolean }) {
  const noProof = kind === 'no-proof';
  return (
    <View
      style={[
        styles.tag,
        large && styles.tagLarge,
        { backgroundColor: noProof ? Brand.noProofBg : Brand.uncappedBg },
      ]}>
      <Text
        style={[
          styles.tagLabel,
          large && { fontSize: 15 },
          { color: noProof ? Brand.noProofFg : Brand.uncappedFg },
        ]}>
        {noProof ? 'No proof' : 'Uncapped'}
      </Text>
      <Text
        style={{
          fontSize: large ? 14 : 11,
          color: noProof ? Brand.noProofFg : Brand.uncappedIcon,
        }}>
        {noProof ? '✓' : '★'}
      </Text>
    </View>
  );
}

/** Round tinted icon + label, used as the Featured legend. */
export function LegendBadge({ kind }: { kind: 'no-proof' | 'uncapped' }) {
  const noProof = kind === 'no-proof';
  return (
    <View style={styles.legend}>
      <View
        style={[
          styles.legendCircle,
          { backgroundColor: noProof ? Brand.noProofBg : Brand.uncappedBg },
        ]}>
        <Text style={{ fontSize: 12, color: noProof ? Brand.noProofFg : Brand.uncappedIcon }}>
          {noProof ? '✓' : '★'}
        </Text>
      </View>
      <Text style={styles.legendLabel}>{noProof ? 'No Proof' : 'Uncapped'}</Text>
    </View>
  );
}

/** White app bar with the logo on the left and a title (centered by default). */
export function AppBar({
  title,
  right,
  logo = true,
  titleAlign = 'center',
  titleSize = 20,
}: {
  title: string;
  right?: ReactNode;
  logo?: boolean;
  titleAlign?: 'center' | 'left';
  titleSize?: number;
}) {
  return (
    <View style={[styles.bar, Shadow.bar]}>
      {logo ? (
        <View style={styles.barLeft}>
          <LogoImage />
        </View>
      ) : null}
      <Text
        style={[
          styles.barTitle,
          { fontSize: titleSize },
          titleAlign === 'left' && { textAlign: 'left', marginLeft: 22 },
        ]}>
        {title}
      </Text>
      {right ? <View style={styles.barRight}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 62,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    alignSelf: 'stretch',
  },
  pillLabel: { fontSize: 20, fontWeight: '600' },
  small: {
    backgroundColor: Brand.purpleDark,
    borderRadius: 5,
    height: 35,
    minWidth: 78,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallLabel: { color: Brand.white, fontSize: 15, fontWeight: '600' },
  chip: {
    backgroundColor: Brand.chip,
    borderRadius: 20,
    height: 41,
    paddingHorizontal: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipLabel: { color: Brand.muted, fontSize: 16, letterSpacing: 0.5 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: 10,
    paddingHorizontal: 8,
    height: 23,
  },
  tagLarge: { borderRadius: 17, height: 34, paddingHorizontal: 14, gap: 4 },
  tagLabel: { fontSize: 13, fontWeight: '600', letterSpacing: -0.26 },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendCircle: {
    width: 23,
    height: 23,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendLabel: { fontSize: 15, fontWeight: '600', color: 'rgba(0,0,0,0.46)' },
  bar: {
    height: 55,
    backgroundColor: Brand.white,
    justifyContent: 'center',
  },
  barLeft: { position: 'absolute', left: 28 },
  barRight: { position: 'absolute', right: 28 },
  barTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.15,
    color: Brand.ink,
    textAlign: 'center',
  },
});
