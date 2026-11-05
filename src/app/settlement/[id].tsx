import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandBadge, PillButton, Tag } from '@/components/mode/primitives';
import { Brand } from '@/constants/theme';
import { getSettlement } from '@/data/settlements';

export default function SettlementDetails() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const settlement = getSettlement(id);

  if (!settlement) {
    return (
      <View style={[styles.screen, styles.missing, { paddingTop: insets.top }]}>
        <Text style={styles.missingText}>That settlement could not be found.</Text>
        <PillButton label="Go back" variant="purple" onPress={() => router.back()} />
      </View>
    );
  }

  const share = () =>
    Share.share({
      message: `${settlement.title}: ${settlement.headline}. Found on ModeMobile.`,
    });

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backLabel}>‹ Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Settlement Details</Text>
        <Text style={styles.infoPill}>Info</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <BrandBadge letter={settlement.letter} color={settlement.color} size={64} />
          <Text style={styles.headline}>{settlement.headline}</Text>
          <Text style={styles.company}>{settlement.company}</Text>
        </View>

        {settlement.tag ? <Tag kind={settlement.tag} /> : null}
        <Text style={styles.title}>{settlement.title}</Text>
        <Text style={styles.copy}>{settlement.summary}</Text>

        <Text style={styles.label}>Deadline to claim</Text>
        <Text style={styles.copy}>Due in {settlement.dueInDays} days</Text>

        <Text style={styles.label}>Description</Text>
        <Text style={styles.copy}>{settlement.description}</Text>
      </ScrollView>

      <View style={[styles.actions, { paddingBottom: insets.bottom + 12 }]}>
        <PillButton label="Tell your friends" variant="soft" onPress={share} style={styles.action} />
        <PillButton
          label="Get Started"
          variant="purple"
          onPress={() => router.replace('/forms')}
          style={styles.action}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.white },
  missing: { alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },
  missingText: { fontSize: 15, color: Brand.muted },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  back: { minWidth: 56 },
  backLabel: { color: Brand.purple, fontSize: 16 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: Brand.ink },
  infoPill: {
    minWidth: 40,
    textAlign: 'center',
    color: Brand.purple,
    backgroundColor: Brand.purpleSoft,
    fontSize: 12,
    fontWeight: '700',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: { padding: 20, gap: 10, paddingBottom: 24 },
  hero: { alignItems: 'center', gap: 6, paddingVertical: 12 },
  headline: { fontSize: 24, fontWeight: '800', color: Brand.ink, textAlign: 'center' },
  company: { fontSize: 11, color: Brand.muted },
  title: { fontSize: 16, fontWeight: '800', color: Brand.ink },
  copy: { fontSize: 13, lineHeight: 19, color: Brand.muted },
  label: { fontSize: 14, fontWeight: '800', color: Brand.ink, marginTop: 8 },
  actions: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Brand.border,
  },
  action: { height: 44, borderRadius: 8 },
});
