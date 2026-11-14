import { router } from 'expo-router';
import { useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandBubble, PillButton } from '@/components/mode/primitives';
import { Brand } from '@/constants/theme';

const BG = require('@/assets/images/mode/bg.png');
const LOGOS = {
  apple: require('@/assets/images/mode/apple.png'),
  spotify: require('@/assets/images/mode/spotify.png'),
  pepsi: require('@/assets/images/mode/pepsi.png'),
  instagram: require('@/assets/images/mode/instagram.png'),
  fortnite: require('@/assets/images/mode/fortnite.png'),
};

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
      <View style={[styles.offer, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 40 }]}>
        <Pressable accessibilityLabel="Close" onPress={finish} style={styles.offerClose}>
          <Text style={styles.offerCloseGlyph}>✕</Text>
        </Pressable>
        <View style={styles.offerBody}>
          <Text style={styles.offerTitle}>
            We want you to{'\n'}
            <Text style={{ color: Brand.purple }}>make some money</Text>
          </Text>
          <Text style={styles.gift}>🎁</Text>
          <View style={styles.discountPill}>
            <Text style={styles.discountCheck}>✓</Text>
            <Text style={styles.discountLabel}>50% Discount Applied</Text>
          </View>
          <Text style={styles.offerCopy}>
            Use the app for{'\n'}a discount with our{'\n'}one time offer!
          </Text>
        </View>
        <PillButton label="Continue for 50% OFF" variant="purple" onPress={finish} />
      </View>
    );
  }

  return (
    <ImageBackground source={BG} resizeMode="cover" style={styles.bg}>
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.tint]} />
      <View style={[styles.screen, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }]}>
        <Pressable accessibilityLabel="Close" onPress={() => setShowOffer(true)} style={styles.close}>
          <Text style={styles.closeGlyph}>✕</Text>
        </Pressable>

        <View style={styles.hero}>
          <View style={styles.cloud}>
            <BrandBubble source={LOGOS.apple} size={78} style={{ position: 'absolute', left: 0, top: 40 }} />
            <BrandBubble source={LOGOS.spotify} size={78} style={{ position: 'absolute', left: 105, top: 0 }} />
            <BrandBubble source={LOGOS.pepsi} size={78} style={{ position: 'absolute', left: 200, top: 32 }} />
            <BrandBubble source={LOGOS.instagram} size={78} style={{ position: 'absolute', left: 62, top: 126 }} />
            <BrandBubble source={LOGOS.fortnite} size={78} style={{ position: 'absolute', left: 160, top: 122 }} />
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

        <PillButton label="Continue" onPress={() => setShowOffer(true)} style={styles.cta} />
        <View style={styles.footer}>
          <Text style={styles.footerLink}>Terms</Text>
          <Text style={styles.footerLink}>Privacy</Text>
          <Text style={styles.footerLink}>Restore</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Brand.blue },
  tint: { backgroundColor: 'rgba(43,115,232,0.5)' },
  screen: { flex: 1, paddingHorizontal: 24, gap: 16 },
  close: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeGlyph: { color: Brand.white, fontSize: 14, fontWeight: '700' },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  cloud: { width: 278, height: 204, marginBottom: 12 },
  title: {
    color: Brand.white,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 1,
    textAlign: 'center',
    textShadowColor: 'rgba(30,64,175,0.6)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  copy: { color: Brand.white, fontSize: 13, fontWeight: '700', letterSpacing: 0.4, textAlign: 'center' },
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
  cta: { alignSelf: 'center', width: 297 },
  footer: { flexDirection: 'row', justifyContent: 'space-around' },
  footerLink: { color: Brand.white, fontSize: 11, textDecorationLine: 'underline' },
  offer: { flex: 1, backgroundColor: Brand.white, paddingHorizontal: 42, gap: 16 },
  offerClose: {
    alignSelf: 'flex-end',
    width: 33,
    height: 33,
    borderRadius: 17,
    backgroundColor: 'rgba(125,125,125,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerCloseGlyph: { color: 'rgba(60,60,60,0.8)', fontSize: 16, fontWeight: '800' },
  offerBody: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 22 },
  offerTitle: {
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: 1.5,
    textAlign: 'center',
    color: Brand.ink,
  },
  gift: { fontSize: 150, lineHeight: 180 },
  discountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Brand.purple,
    borderRadius: 50,
    height: 43,
    paddingHorizontal: 18,
  },
  discountCheck: { color: Brand.white, fontSize: 16, fontWeight: '700' },
  discountLabel: { color: Brand.white, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  offerCopy: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
    color: Brand.ink,
  },
});
