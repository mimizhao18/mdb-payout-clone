import { router } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandBadge, ModeLogo, PillButton } from '@/components/mode/primitives';
import { BRANDS, PAYOUT_METHODS } from '@/data/settlements';
import { Brand } from '@/constants/theme';

type StepProps = { onNext: () => void };

function Headline({ children }: { children: ReactNode }) {
  return <Text style={styles.headline}>{children}</Text>;
}

function Body({ children }: { children: ReactNode }) {
  return <Text style={styles.body}>{children}</Text>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

function Center({ children }: { children: ReactNode }) {
  return <View style={styles.center}>{children}</View>;
}

function Welcome({ onNext }: StepProps) {
  return (
    <>
      <Center>
        <ModeLogo size={56} light />
      </Center>
      <PillButton label="Get Started" onPress={onNext} />
      <Text style={styles.legal}>
        By continuing you agree to our <Text style={styles.underline}>Terms of Use</Text> and{' '}
        <Text style={styles.underline}>Class Action Terms</Text>
      </Text>
    </>
  );
}

function Simple({
  onNext,
  eyebrow,
  hero,
  title,
  body,
  cta = 'Next',
}: StepProps & { eyebrow?: string; hero: ReactNode; title?: string; body?: string; cta?: string }) {
  return (
    <>
      <Center>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        {hero}
        {title ? <Headline>{title}</Headline> : null}
        {body ? <Body>{body}</Body> : null}
      </Center>
      <PillButton label={cta} onPress={onNext} />
    </>
  );
}

function BrandCloud() {
  return (
    <View style={styles.cloud}>
      <BrandBadge letter="" color="#111827" size={64} style={styles.cloud1} />
      <BrandBadge letter="S" color="#16A34A" size={64} style={styles.cloud2} />
      <BrandBadge letter="P" color="#1D4ED8" size={64} style={styles.cloud3} />
      <BrandBadge letter="I" color="#C026D3" size={64} style={styles.cloud4} />
      <BrandBadge letter="F" color="#1F2937" size={64} style={styles.cloud5} />
    </View>
  );
}

function NotificationCard() {
  return (
    <View style={styles.notification}>
      <View style={styles.notificationIcon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.notificationTitle}>New $10 Claim!</Text>
        <Text style={styles.notificationBody}>We’re holding your spot</Text>
      </View>
      <Text style={styles.notificationTime}>9:31 AM</Text>
    </View>
  );
}

function EligibleCard() {
  return (
    <View style={styles.eligible}>
      <BrandBadge letter="" color="#111827" size={52} />
      <View style={{ flex: 1 }}>
        <Text style={styles.eligibleTitle}>Apple</Text>
        <Text style={styles.eligibleSub}>Claim by Aug 10th 2025</Text>
      </View>
      <Text style={styles.noProofPill}>No Proof</Text>
    </View>
  );
}

function Testimonial() {
  return (
    <View style={styles.testimonial}>
      <View style={styles.testimonialHeader}>
        <View style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.testimonialName}>John D.</Text>
          <Text style={styles.testimonialSub}>Claimed $41 last month</Text>
        </View>
        <Text style={styles.stars}>★★★★★</Text>
      </View>
      <Text style={styles.quote}>“It’s like finding money on the ground every single week!”</Text>
    </View>
  );
}

function BrandPicker({ onNext }: StepProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) =>
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  return (
    <>
      <View style={styles.pickerBody}>
        <Text style={styles.question}>Which brands have you purchased from in the past 5 years?</Text>
        <Text style={styles.hint}>Pick the ones you haven’t claimed money from yet</Text>
        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          {BRANDS.map((b) => {
            const on = selected.includes(b.id);
            return (
              <Pressable
                key={b.id}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: on }}
                onPress={() => toggle(b.id)}
                style={[styles.brandTile, on && styles.brandTileOn]}>
                <BrandBadge letter={b.letter} color={b.color} size={44} />
                <Text style={styles.brandName}>{b.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      <PillButton label="Next" onPress={onNext} />
    </>
  );
}

function PayoutPicker({ onNext }: StepProps) {
  const [method, setMethod] = useState<string | null>(null);
  return (
    <>
      <View style={styles.pickerBody}>
        <Text style={styles.question}>How would you like to receive payouts?</Text>
        <Text style={styles.hint}>This will be set as the default payout method when claims are filled</Text>
        <View style={styles.options}>
          {PAYOUT_METHODS.map((m) => (
            <Pressable
              key={m}
              accessibilityRole="radio"
              accessibilityState={{ selected: method === m }}
              onPress={() => setMethod(m)}
              style={[styles.option, method === m && styles.optionOn]}>
              <Text style={[styles.optionLabel, method === m && { color: Brand.white }]}>{m}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <PillButton label="Next" onPress={onNext} />
    </>
  );
}

function Estimating({ onNext }: StepProps) {
  useEffect(() => {
    const t = setTimeout(onNext, 2200);
    return () => clearTimeout(t);
  }, [onNext]);
  return (
    <>
      <Center>
        <ModeLogo size={48} light />
        <Body>Estimating settlements you can claim now!</Body>
        <ActivityIndicator color={Brand.white} style={{ marginTop: 12 }} />
      </Center>
      <PillButton label="Next" onPress={onNext} />
    </>
  );
}

const TOTAL_STEPS = 12;

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const next = () => {
    if (step >= TOTAL_STEPS - 1) {
      router.replace('/paywall');
    } else {
      setStep((s) => s + 1);
    }
  };

  const steps: ReactNode[] = [
    <Welcome key="welcome" onNext={next} />,
    <Simple
      key="class-action"
      onNext={next}
      hero={<Text style={styles.emoji}>👩‍⚖️</Text>}
      title="Class Action Settlements"
      body="Are when companies have to pay money to customers because they may have done something wrong or illegal."
    />,
    <Simple
      key="billion"
      onNext={next}
      eyebrow={'Last year people\nlike you were awarded'}
      hero={<Text style={styles.emoji}>💰</Text>}
      title="$1.3 Billion"
      body="Companies have to pay money to customers, but it is up to the people to claim the reward."
    />,
    <Simple
      key="new-settlements"
      onNext={next}
      hero={<BrandCloud />}
      title="New Settlements to claim every week"
      body="Many of the largest companies often pay penalties for misleading people. ModeMobile finds and organizes these opportunities for you to claim your cash."
    />,
    <Simple
      key="track"
      onNext={next}
      hero={
        <>
          <Text style={styles.emoji}>🔔</Text>
          <NotificationCard />
        </>
      }
      title="We find and track everything for you"
      body="When a new settlement opens, we’ll let you know. If you’re eligible, you can use ModeMobile for easy filing and skip the headache."
    />,
    <Simple
      key="no-proof"
      onNext={next}
      hero={<EligibleCard />}
      title={'No proof?\nStill eligible!'}
      body="You can still file a claim if you lost your receipt. If something requires proof, we’ll let you know before you file."
    />,
    <Simple
      key="yearly"
      onNext={next}
      eyebrow={'On a yearly average\nyou are owed'}
      hero={
        <>
          <Text style={styles.bigNumber}>$397</Text>
          <Testimonial />
        </>
      }
    />,
    <Simple
      key="number-one"
      onNext={next}
      eyebrow={'Class Action\nPayout App'}
      hero={
        <>
          <Text style={styles.bigNumber}>#1</Text>
          <Text style={styles.bigStars}>★★★★★</Text>
        </>
      }
      body="Trusted by thousands of users"
    />,
    <BrandPicker key="brands" onNext={next} />,
    <PayoutPicker key="payout" onNext={next} />,
    <Estimating key="estimating" onNext={next} />,
    <Simple
      key="estimate"
      onNext={next}
      hero={
        <>
          <ModeLogo size={48} light />
          <Text style={styles.estimate}>$4.822 B</Text>
        </>
      }
      body="Brands you selected are estimated to pay this much out to Class Actions"
      cta="Claim My Cash"
    />,
  ];

  const progress = step === 0 ? 0 : step / (TOTAL_STEPS - 1);

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }]}>
      {step > 0 && (
        <View style={styles.track} accessibilityRole="progressbar">
          <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]} />
        </View>
      )}
      <View style={styles.content}>{steps[step]}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.blue, paddingHorizontal: 24 },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginBottom: 12,
    overflow: 'hidden',
  },
  fill: { height: 4, backgroundColor: Brand.white },
  content: { flex: 1, justifyContent: 'space-between', gap: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  headline: {
    color: Brand.white,
    fontSize: 24,
    fontWeight: '800',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  body: { color: Brand.white, fontSize: 13, fontWeight: '600', textAlign: 'center', lineHeight: 18 },
  eyebrow: { color: Brand.white, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  legal: { color: Brand.white, fontSize: 11, textAlign: 'center' },
  underline: { textDecorationLine: 'underline' },
  emoji: { fontSize: 72 },
  bigNumber: { color: Brand.white, fontSize: 56, fontWeight: '900', fontStyle: 'italic' },
  bigStars: { color: '#FACC15', fontSize: 48, letterSpacing: 4 },
  estimate: { color: Brand.white, fontSize: 36, fontWeight: '800' },
  cloud: { width: 260, height: 190 },
  cloud1: { position: 'absolute', left: 10, top: 20 },
  cloud2: { position: 'absolute', left: 95, top: 0 },
  cloud3: { position: 'absolute', right: 10, top: 20 },
  cloud4: { position: 'absolute', left: 50, bottom: 10 },
  cloud5: { position: 'absolute', right: 40, bottom: 20 },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Brand.white,
    borderRadius: 14,
    padding: 12,
    alignSelf: 'stretch',
  },
  notificationIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: Brand.purple },
  notificationTitle: { fontSize: 13, fontWeight: '700', color: Brand.ink },
  notificationBody: { fontSize: 12, color: Brand.muted },
  notificationTime: { fontSize: 11, color: Brand.muted },
  eligible: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#D8C8F5',
    borderRadius: 16,
    padding: 14,
    alignSelf: 'stretch',
  },
  eligibleTitle: { fontSize: 18, fontWeight: '800', color: Brand.white },
  eligibleSub: { fontSize: 12, color: Brand.white },
  noProofPill: {
    backgroundColor: Brand.purple,
    color: Brand.white,
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
  testimonial: {
    backgroundColor: '#7E22CE',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    alignSelf: 'stretch',
    borderWidth: 2,
    borderColor: Brand.white,
  },
  testimonialHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: Brand.white },
  testimonialName: { color: Brand.white, fontWeight: '700', fontSize: 13 },
  testimonialSub: { color: Brand.white, fontSize: 11 },
  stars: { color: '#FACC15', fontSize: 12 },
  quote: { color: Brand.white, fontSize: 13, fontWeight: '700' },
  pickerBody: { flex: 1, alignItems: 'center', gap: 8, paddingTop: 8 },
  question: { color: Brand.white, fontSize: 20, textAlign: 'center' },
  hint: { color: Brand.white, fontSize: 11, textAlign: 'center', opacity: 0.85 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center', paddingVertical: 16 },
  brandTile: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: Brand.white,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  brandTileOn: { borderColor: Brand.purple },
  brandName: { fontSize: 11, fontWeight: '700', color: Brand.ink },
  options: { alignSelf: 'stretch', gap: 12, marginTop: 16 },
  option: {
    backgroundColor: Brand.white,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  optionOn: { backgroundColor: Brand.purple },
  optionLabel: { fontSize: 13, fontWeight: '700', color: Brand.ink },
});
