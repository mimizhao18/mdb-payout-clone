import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandBadge, PillButton } from '@/components/mode/primitives';
import { Brand } from '@/constants/theme';

const PLANS = [
  { id: 'weekly', name: 'Weekly Unlimited', note: 'Perfect for trying it out', price: '$9.99', per: 'Weekly' },
  { id: 'yearly', name: 'Yearly Unlimited', note: 'Make the most money', price: '$39.99', per: 'Yearly' },
] as const;

function finish() {
  router.replace('/home');
}

export default function Paywall() {
  const insets = useSafeAreaInsets();
  const [plan, setPlan] = useState<(typeof PLANS)[number]['id']>('yearly');
  const [showOffer, setShowOffer] = useState(false);

  if (showOffer) {
    return (
      <View style={[styles.offer, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }]}>
        <Pressable accessibilityLabel="Close" onPress={finish} style={styles.offerClose}>
          <Text style={styles.closeGlyph}>✕</Text>
        </Pressable>
        <View style={styles.offerBody}>
          <Text style={styles.offerTitle}>
            We want you to{'\n'}
            <Text style={{ color: Brand.purple }}>make some money</Text>
          </Text>
          <Text style={styles.gift}>🎁</Text>
          <Text style={styles.discount}>✓ 50% Discount Applied</Text>
          <Text style={styles.offerCopy}>Use the app for{'\n'}a discount with our{'\n'}one time offer!</Text>
        </View>
        <PillButton label="Continue for 50% OFF" variant="purple" onPress={finish} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }]}>
      <Pressable accessibilityLabel="Close" onPress={() => setShowOffer(true)} style={styles.close}>
        <Text style={styles.closeGlyph}>✕</Text>
      </Pressable>

      <View style={styles.hero}>
        <View style={styles.row}>
          <BrandBadge letter="" color="#111827" size={64} />
          <BrandBadge letter="S" color="#16A34A" size={64} />
          <BrandBadge letter="P" color="#1D4ED8" size={64} />
        </View>
        <View style={styles.row}>
          <BrandBadge letter="I" color="#C026D3" size={64} />
          <BrandBadge letter="F" color="#1F2937" size={64} />
        </View>
        <Text style={styles.title}>$1B in settlements{'\n'}coming this year</Text>
        <Text style={styles.copy}>
          Gain Access to Unlimited Settlements! Payout is the easiest way to get loads of cash with little effort
        </Text>
      </View>

      <View style={styles.plans}>
        {PLANS.map((p) => {
          const on = plan === p.id;
          return (
            <Pressable
              key={p.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              onPress={() => setPlan(p.id)}
              style={[styles.plan, on && styles.planOn]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.planName}>{p.name}</Text>
                <Text style={styles.planNote}>{p.note}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.planName}>{p.price}</Text>
                <Text style={styles.planNote}>{p.per}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <PillButton label="Continue" onPress={() => setShowOffer(true)} />
      <View style={styles.footer}>
        <Text style={styles.footerLink}>Terms</Text>
        <Text style={styles.footerLink}>Privacy</Text>
        <Text style={styles.footerLink}>Restore</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.blue, paddingHorizontal: 24, gap: 16 },
  close: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeGlyph: { color: Brand.white, fontSize: 14, fontWeight: '700' },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  row: { flexDirection: 'row', gap: 12 },
  title: { color: Brand.white, fontSize: 24, fontWeight: '800', fontStyle: 'italic', textAlign: 'center', marginTop: 12 },
  copy: { color: Brand.white, fontSize: 12, fontWeight: '600', textAlign: 'center' },
  plans: { gap: 10 },
  plan: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  planOn: { backgroundColor: 'rgba(255,255,255,0.25)', borderColor: Brand.white },
  planName: { color: Brand.white, fontSize: 14, fontWeight: '700' },
  planNote: { color: Brand.white, fontSize: 11, opacity: 0.85 },
  footer: { flexDirection: 'row', justifyContent: 'space-around' },
  footerLink: { color: Brand.white, fontSize: 11, textDecorationLine: 'underline' },
  offer: { flex: 1, backgroundColor: Brand.white, paddingHorizontal: 24, gap: 16 },
  offerClose: {
    alignSelf: 'flex-end',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Brand.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerBody: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  offerTitle: { fontSize: 22, fontWeight: '800', textAlign: 'center', color: Brand.ink },
  gift: { fontSize: 120 },
  discount: {
    backgroundColor: Brand.purple,
    color: Brand.white,
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    overflow: 'hidden',
  },
  offerCopy: { fontSize: 18, fontWeight: '700', textAlign: 'center', color: Brand.ink },
});
